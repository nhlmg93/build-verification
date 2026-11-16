# Simple verification example

This CLI reads a JSON config and checks two fields. `appName` must be a nonempty
string, and `port` must be an integer between 1 and 65535.

## Use

From the repository root, with Node.js 22 or later:

```sh
npm --prefix examples/simple install
```

```sh
npm --prefix examples/simple run verify -- config examples/simple/config.json
```

The command prints the file path, timestamp, result, and explanation as JSON.
It exits with code 0 when the config meets these requirements and 1 otherwise.
That result says nothing about whether an application starts or listens on the port.

Command help:

```sh
npm --prefix examples/simple run verify -- config --help
```

The CLI parses arguments in `src/index.ts`. `src/core/check-config.ts` implements
the verification. The web-report example uses the same verification logic.
