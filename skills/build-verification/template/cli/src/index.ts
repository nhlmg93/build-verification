import { Command } from "commander";

const program = new Command()
  .name("verify")
  .description("Project verification capabilities built together with the user")
  .showHelpAfterError();

// Add only capabilities being developed together with the user.

if (process.argv.length === 2) program.help();

await program.parseAsync(process.argv);
