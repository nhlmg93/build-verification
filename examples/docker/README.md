# Docker testbed example

Use the verification CLI against an isolated environment. Dockerode manages the
environment; the agent uses the ordinary `http` command to check it. There is no
separate testbed verification interface.

Each run starts a small HTTP echo service with a unique container and network.
Docker assigns a free localhost port. Multiple runs can coexist without sharing
service state or host ports.

## Setup

Requires Node.js 22 or later and a running local Docker daemon.
From the repository root:

```sh
npm --prefix examples/docker install
```

Dockerode uses `/var/run/docker.sock` by default. Set `DOCKER_SOCKET` to use a
different local socket, such as a rootless Docker socket. Access to the Docker
daemon is privileged. This example does not mount the Docker socket or host
directories into the container.

## Start a testbed

```sh
npm --prefix examples/docker run verify -- testbed up
```

This pulls `hashicorp/http-echo:1.0.0` and creates the run's container and network.
It prints JSON containing a `runId`, the resource names, the service `url`, and
the expected response text. Copy the URL and run ID for the next commands.
The image remains cached after cleanup.

## Use the CLI against it

Replace the example port with the port in the returned URL:

```sh
npm --prefix examples/docker run verify -- http http://127.0.0.1:YOUR_PORT --expect verification-example
```

The command prints the observed HTTP status and body. It exits with code 0 if
the status is 200 and the trimmed body matches, or 1 otherwise.
It waits at most five seconds for the request. Setup does not wait for application
readiness, so retry the command if the service is still starting.

This check establishes the endpoint's response, not the correctness of an
application beyond it. The same command accepts another endpoint without Docker.

## Clean up this run

Replace `YOUR_RUN_ID` with the run ID returned by setup:

```sh
npm --prefix examples/docker run verify -- testbed down YOUR_RUN_ID
```

Cleanup finds containers and networks by this example's owner label and the run
ID. It force-removes matching containers, including stopped ones, before removing
matching networks. Already missing resources are fine, so cleanup can be repeated.
If removal fails, it still attempts the remaining cleanup and reports the failures.
It does not prune Docker or remove other runs. There are no persistent volumes.
Testbeds remain running until you remove them, even if a verification fails.

Run `testbed up` again for another independent environment. Keep track of each
returned run ID and clean up each one.

## Source

- `src/core/testbed.ts` implements Docker setup and cleanup.
- `src/core/check-http.ts` implements the HTTP verification.
- `src/index.ts` exposes those operations as Commander commands.

This is an example to adapt with your agent, not a Docker dependency for the
installed skill or its scaffold.
