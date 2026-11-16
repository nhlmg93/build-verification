import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import type { ConfigResult } from "./check-config.js";
import { ConfigReport } from "../reports/config-report.js";

const wwwDirectory = fileURLToPath(new URL("../../www/", import.meta.url));

export function writeReport(id: string, result: ConfigResult, archived = false): string {
  const filename = `${id}.html`;

  mkdirSync(wwwDirectory, { recursive: true });
  writeFileSync(
    join(wwwDirectory, filename),
    "<!doctype html>" + (<ConfigReport id={id} result={result} archived={archived} />).toString(),
  );

  return filename;
}
