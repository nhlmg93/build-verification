import { copyFile, mkdir } from "node:fs/promises";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const require = createRequire(import.meta.url);
const assets = fileURLToPath(new URL("../assets/", import.meta.url));

await mkdir(assets, { recursive: true });

await copyFile(
  require.resolve("@picocss/pico/css/pico.classless.min.css"),
  join(assets, "pico.min.css"),
);

await copyFile(
  require.resolve("htmx.org/dist/htmx.min.js"),
  join(assets, "htmx.min.js"),
);
