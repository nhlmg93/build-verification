import Docker from "dockerode";
import { randomUUID } from "node:crypto";

const docker = new Docker({
  socketPath: process.env.DOCKER_SOCKET ?? "/var/run/docker.sock",
});

const image = "hashicorp/http-echo:1.0.0";
const ownerLabel = "build-verification.example";
const runLabel = "build-verification.run";
const owner = "docker-example";

function resourceName(runId: string): string {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(runId)) {
    throw new Error("Expected the run ID returned by testbed up.");
  }

  return `verification-${runId}`;
}

async function pullImage(): Promise<void> {
  const stream = await docker.pull(image);

  await new Promise<void>((resolve, reject) => {
    docker.modem.followProgress(stream, (error) => {
      if (error) reject(error);
      else resolve();
    });
  });
}

export async function startTestbed() {
  const runId = randomUUID();
  const name = resourceName(runId);
  const labels = { [ownerLabel]: owner, [runLabel]: runId };

  await pullImage();
  const network = await docker.createNetwork({ Name: name, Labels: labels });
  let container: Docker.Container | undefined;

  try {
    container = await docker.createContainer({
      name,
      Image: image,
      Cmd: ["-listen=:5678", "-text=verification-example"],
      Labels: labels,
      ExposedPorts: { "5678/tcp": {} },
      HostConfig: {
        NetworkMode: name,
        PortBindings: {
          "5678/tcp": [{ HostIp: "127.0.0.1", HostPort: "" }],
        },
      },
    });

    await container.start();
    const info = await container.inspect();
    const port = info.NetworkSettings.Ports["5678/tcp"]?.[0]?.HostPort;

    if (!port) throw new Error("Docker did not assign a host port.");

    return {
      runId,
      container: name,
      network: name,
      url: `http://127.0.0.1:${port}`,
      expected: "verification-example",
    };
  } catch (error) {
    // Attempt both removals even if one cleanup operation fails.
    const cleanupErrors: Error[] = [];

    if (container) {
      try {
        await container.remove({ force: true, v: true });
      } catch (cleanupError) {
        cleanupErrors.push(new Error("Could not remove the container.", { cause: cleanupError }));
      }
    }

    try {
      await network.remove();
    } catch (cleanupError) {
      cleanupErrors.push(new Error("Could not remove the network.", { cause: cleanupError }));
    }

    if (cleanupErrors.length) {
      throw new AggregateError(
        [error, ...cleanupErrors],
        `Setup failed. Inspect Docker resources named ${name} for incomplete cleanup.`,
      );
    }

    throw error;
  }
}

export async function stopTestbed(runId: string): Promise<void> {
  resourceName(runId);
  const filters = {
    label: [`${ownerLabel}=${owner}`, `${runLabel}=${runId}`],
  };
  const cleanupErrors: Error[] = [];

  try {
    const containers = await docker.listContainers({ all: true, filters });

    for (const container of containers) {
      try {
        await docker.getContainer(container.Id).remove({ force: true, v: true });
      } catch (error) {
        cleanupErrors.push(new Error(`Could not remove container ${container.Id}.`, { cause: error }));
      }
    }
  } catch (error) {
    cleanupErrors.push(new Error("Could not list this run's containers.", { cause: error }));
  }

  try {
    const networks = await docker.listNetworks({ filters });

    for (const network of networks) {
      try {
        await docker.getNetwork(network.Id).remove();
      } catch (error) {
        cleanupErrors.push(new Error(`Could not remove network ${network.Id}.`, { cause: error }));
      }
    }
  } catch (error) {
    cleanupErrors.push(new Error("Could not list this run's networks.", { cause: error }));
  }

  if (cleanupErrors.length) {
    throw new AggregateError(cleanupErrors, `Cleanup incomplete for run ${runId}. Run down again to retry.`);
  }
}
