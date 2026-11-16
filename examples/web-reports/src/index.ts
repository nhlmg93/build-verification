import { Command } from "commander";
import { randomUUID } from "node:crypto";
import { checkConfig } from "./core/check-config.js";
import { registerReport } from "./core/reports.js";
import { writeReport } from "./core/write-report.js";
import { serveReports } from "./server.js";

const program = new Command()
  .name("verify")
  .description("Verify a JSON config and generate an interactive HTML report");

program
  .command("config")
  .description("Check appName and port, then write an HTML report")
  .argument("<file>", "Path to the JSON config")
  .action((file: string) => {
    const result = checkConfig(file);
    const id = randomUUID();
    const filename = writeReport(id, result);
    registerReport(id, filename, result.source);

    console.log(JSON.stringify(result, null, 2));
    console.log(`Report: http://127.0.0.1:3000/${filename}`);
    process.exitCode = result.passed ? 0 : 1;
  });

program
  .command("serve")
  .description("Serve reports and their actions at http://127.0.0.1:3000")
  .action(serveReports);

await program.parseAsync(process.argv);
