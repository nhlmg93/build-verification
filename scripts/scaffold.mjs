import { constants, existsSync } from "node:fs";
import { copyFile, cp, mkdir, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);

if (args.length !== 1 || args[0] === "--help") {
  console.log("Usage: node scaffold.mjs <project-root>");
  console.log("Creates an empty verification CLI and starter traits. Installs nothing.");
  process.exit(args[0] === "--help" ? 0 : 1);
}

const root = resolve(args[0]);
const verify = join(root, ".pi/skills/verify");
const traits = join(root, ".agents/traits");
const template = fileURLToPath(new URL("../template/", import.meta.url));
const bundledTraits = fileURLToPath(new URL("../traits/", import.meta.url));

const templateFiles = [
  "cli/AGENTS.md",
  "cli/package.json",
  "cli/tsconfig.json",
  "cli/.gitignore",
  "cli/.oxfmtrc.json",
  "cli/oxlint.config.ts",
  "cli/src/index.ts",
];

const traitFiles = [
  "current-help.md",
  "verification-structure.md",
];

// Check existing work before creating files.
if (!existsSync(root)) {
  throw new Error(`Project root does not exist: ${root}`);
}

if (existsSync(verify)) {
  throw new Error(`Verification setup already exists: ${verify}. Work on it with the user instead.`);
}

for (const file of traitFiles) {
  const destination = join(traits, file);
  if (!existsSync(destination)) continue;

  const current = await readFile(destination, "utf8");
  const bundled = await readFile(join(bundledTraits, file), "utf8");

  if (current !== bundled) {
    throw new Error(`Existing trait differs: ${destination}. Discuss it with the user before scaffolding.`);
  }
}

async function copyNewFile(source, destination) {
  await mkdir(dirname(destination), { recursive: true });
  await copyFile(source, destination, constants.COPYFILE_EXCL);
  console.log(`Created ${destination}`);
}

await copyNewFile(join(template, "SKILL.md.template"), join(verify, "SKILL.md"));

for (const file of templateFiles) {
  await copyNewFile(join(template, file), join(verify, file));
}

await cp(join(template, "cli/tools"), join(verify, "cli/tools"), {
  recursive: true,
  force: false,
  errorOnExist: true,
});
console.log(`Created ${join(verify, "cli/tools")}`);

for (const file of traitFiles) {
  const destination = join(traits, file);
  if (existsSync(destination)) continue;

  await copyNewFile(join(bundledTraits, file), destination);
}

console.log("Scaffold created. No dependencies installed or verification commands run.");
