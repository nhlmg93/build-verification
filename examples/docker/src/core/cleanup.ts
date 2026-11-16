import { docker, runLabels } from "./docker.js";

function filtersFor(runId: string) {
  return {
    label: Object.entries(runLabels(runId)).map(([key, value]) => `${key}=${value}`),
  };
}

async function removeContainers(runId: string): Promise<void> {
  const containers = await docker.listContainers({ all: true, filters: filtersFor(runId) });

  for (const container of containers) {
    await docker.getContainer(container.Id).remove({ force: true, v: true });
  }
}

async function removeNetworks(runId: string): Promise<void> {
  const networks = await docker.listNetworks({ filters: filtersFor(runId) });

  for (const network of networks) {
    await docker.getNetwork(network.Id).remove();
  }
}

export async function stopTestbed(runId: string): Promise<void> {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(runId)) {
    throw new Error("Expected the run ID returned by testbed up.");
  }

  const errors: unknown[] = [];

  try {
    await removeContainers(runId);
  } catch (error) {
    errors.push(error);
  }

  try {
    await removeNetworks(runId);
  } catch (error) {
    errors.push(error);
  }

  if (errors.length) {
    throw new AggregateError(errors, `Cleanup incomplete for ${runId}. Run down again to retry.`);
  }
}

export async function cleanupFailedSetup(runId: string, cause: unknown): Promise<never> {
  try {
    await stopTestbed(runId);
  } catch (cleanupError) {
    throw new AggregateError(
      [cause, cleanupError],
      `Setup and cleanup failed. Retry testbed down ${runId}.`,
    );
  }

  throw cause;
}
