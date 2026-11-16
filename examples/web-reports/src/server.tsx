import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import { checkConfig } from "./core/check-config.js";
import { writeReport } from "./core/write-report.js";
import { ConfigResultView } from "./reports/config-report.js";
import { fileURLToPath } from "node:url";
import { ReportActions } from "./components/report-actions.js";
import { archiveReport, deleteReport, getReport } from "./core/reports.js";

export function serveReports(): void {
  const wwwDirectory = fileURLToPath(new URL("../www/", import.meta.url));
  const assetsDirectory = fileURLToPath(new URL("../assets/", import.meta.url));
  const app = new Hono();

  // Browser mutations must originate from this server.
  app.use("/api/*", async (context, next) => {
    if (context.req.header("Origin") !== new URL(context.req.url).origin) {
      return context.text("Same-origin requests only.", 403);
    }

    await next();
  });

  app.post("/api/reports/:id/run", (context) => {
    const id = context.req.param("id");
    const report = getReport(id);

    if (!report) return context.text("Report not found.", 404);

    const result = checkConfig(report.source);
    writeReport(id, result, report.archived);

    return context.html(<ConfigResultView result={result} />);
  });

  app.post("/api/reports/:id/archive", (context) => {
    const id = context.req.param("id");

    if (!getReport(id)) return context.text("Report not found.", 404);

    archiveReport(id);

    return context.html(<ReportActions reportId={id} archived />);
  });

  app.delete("/api/reports/:id", (context) => {
    const id = context.req.param("id");

    if (!getReport(id)) return context.text("Report not found.", 404);

    deleteReport(id);

    return context.html(
      <p role="status">Report deleted. You can close this tab.</p>,
    );
  });
  app.use("/assets/*", serveStatic({
    root: assetsDirectory,
    rewriteRequestPath: (path) => path.replace(/^\/assets/, ""),
  }));
  app.use("*", serveStatic({ root: wwwDirectory }));

  serve(
    { fetch: app.fetch, hostname: "127.0.0.1", port: 3000 },
    () => {
      console.log("Reports: http://127.0.0.1:3000");
      console.log("Press Ctrl+C to stop.");
    },
  );
}
