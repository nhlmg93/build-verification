import { randomUUID } from "node:crypto";
import { docker, runLabels } from "./docker.js";
import { cleanupFailedSetup } from "./cleanup.js";

const image = "hashicorp/http-echo:1.0.0";

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
  const name = `verification-${runId}`;
  const labels = runLabels(runId);

  try {
    await pullImage();
    await docker.createNetwork({ Name: name, Labels: labels });

    const container = await docker.createContainer({
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
    return cleanupFailedSetup(runId, error);
  }
}
