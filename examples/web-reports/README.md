# Web-report verification example

This example checks the same JSON config as `../simple/`. It adds a single-file
HTML report that a reviewer can open and rerun with a button.

The CLI and browser both call `src/core/check-config.ts`. The check requires a
nonempty `appName` and an integer `port` between 1 and 65535. It does not start
an application or check that the port is listening.

## Use

From the repository root, with Node.js 22 or later:

```sh
npm --prefix examples/web-reports install
```

Installation copies Pico's minified classless CSS and HTMX into `assets/`.
If install scripts are disabled, copy them manually:

```sh
node examples/web-reports/scripts/copy-assets.mjs
```

Generate a report:

```sh
npm --prefix examples/web-reports run verify -- config examples/web-reports/config.json
```

The command prints its result and a report URL. It exits with code 0 for a valid
config and 1 otherwise. Both outcomes produce a report.

Start the local server in another terminal:

```sh
npm --prefix examples/web-reports run verify -- serve
```

Open the URL printed by the config command. There is no navigation page.
The server binds to `127.0.0.1:3000`. Press Ctrl+C to stop it.

## Report controls

- **Run again** reads the same config file, runs the same verification, updates
  the result in the browser, and rewrites the saved HTML.
- **Archive report** sets `archived` to true in `db.json`.
- **Delete report** removes the HTML file and database entry.

Edit `config.json` and click Run again to inspect the changed result.
The buttons require the local server. Opening the HTML as a `file://` URL will
not load the local assets or run its actions.

Archive does not move the file or prevent a later explicit deletion. There is
no automatic cleanup. The JSON registry assumes one writer process at a time.
Action endpoints check the registry and return 404 after deletion.

## Maintain the report

`src/reports/config-report.tsx` defines the report with Hono JSX.
`src/components/` holds the shared report buttons. Hono serves the generated
HTML from `www/` and local CSS and JavaScript from `assets/`.

The example trait at
[`.agents/traits/report-maintenance.md`](.agents/traits/report-maintenance.md)
describes what should remain true when the report changes. Use it with your
configured Traits integration. The example does not install Traits.

The server accepts report IDs, not arbitrary commands or input paths from the
browser. Reruns use the source path recorded when the CLI creates the report.
This is a local example, not a multiuser report service.
