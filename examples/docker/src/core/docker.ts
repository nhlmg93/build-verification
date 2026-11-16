import Docker from "dockerode";

export const docker = new Docker({
  socketPath: process.env.DOCKER_SOCKET ?? "/var/run/docker.sock",
});

export function runLabels(runId: string) {
  return {
    "build-verification.example": "docker-example",
    "build-verification.run": runId,
  };
}
