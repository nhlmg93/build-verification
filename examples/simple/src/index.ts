import { Command } from "commander";
import { checkConfig } from "./core/check-config.js";

const program = new Command()
  .name("verify")
  .description("Verify a JSON application's name and port");

program
  .command("config")
  .description("Read a JSON file and check appName and port")
  .argument("<file>", "Path to the JSON config")
  .action((file: string) => {
    const result = checkConfig(file);
    console.log(JSON.stringify(result, null, 2));
    process.exitCode = result.passed ? 0 : 1;
  });

await program.parseAsync(process.argv);
