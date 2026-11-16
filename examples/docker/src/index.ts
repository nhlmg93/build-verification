import { Command } from "commander";
import { checkHttp } from "./core/check-http.js";
import { startTestbed } from "./core/testbed.js";
import { stopTestbed } from "./core/cleanup.js";

const program = new Command()
  .name("verify")
  .description("Verify HTTP responses, with an optional isolated Docker testbed");

program
  .command("http")
  .description("Check that a URL returns HTTP 200 and the expected text")
  .argument("<url>", "HTTP endpoint to check")
  .requiredOption("--expect <text>", "Expected response body, ignoring surrounding whitespace")
  .action(async (url: string, options: { expect: string }) => {
    const result = await checkHttp(url, options.expect);

    console.log(JSON.stringify(result, null, 2));
    process.exitCode = result.passed ? 0 : 1;
  });

const testbed = program
  .command("testbed")
  .description("Manage isolated environments for the normal verification commands");

testbed
  .command("up")
  .description("Pull the example image and start a unique container and network")
  .action(async () => {
    console.log(JSON.stringify(await startTestbed(), null, 2));
  });

testbed
  .command("down")
  .description("Remove only the container and network belonging to a run")
  .argument("<run-id>", "Run ID returned by testbed up")
  .action(async (runId: string) => {
    await stopTestbed(runId);
    console.log(`Removed testbed ${runId}.`);
  });

try {
  await program.parseAsync(process.argv);
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}
