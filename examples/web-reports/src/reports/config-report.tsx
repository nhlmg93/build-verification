import type { ConfigResult } from "../core/check-config.js";
import { ReportActions } from "../components/report-actions.js";

export function ConfigResultView({ result }: { result: ConfigResult }) {
  return (
    <section id="result" aria-live="polite">
      <h2>{result.passed ? "Passed" : "Failed"}</h2>
      <dl>
        <dt>File</dt>
        <dd>{result.source}</dd>
        <dt>Checked at</dt>
        <dd>{result.checkedAt}</dd>
      </dl>
      <pre>{result.message}</pre>
    </section>
  );
}

interface ConfigReportProps {
  id: string;
  result: ConfigResult;
  archived: boolean;
}

export function ConfigReport({ id, result, archived }: ConfigReportProps) {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Config verification</title>
        <link rel="stylesheet" href="/assets/pico.min.css" />
        <script src="/assets/htmx.min.js" defer></script>
      </head>
      <body>
        <main>
          <h1>Config verification</h1>
          <p>
            Checks that appName is nonempty and port is an integer between 1 and
            65535. This does not check whether the application runs.
          </p>
          <ConfigResultView result={result} />
          <button
            type="button"
            hx-post={`/api/reports/${id}/run`}
            hx-target="#result"
            hx-swap="outerHTML"
            hx-disabled-elt="this"
          >
            Run again
          </button>
          <ReportActions reportId={id} archived={archived} />
        </main>
      </body>
    </html>
  );
}
