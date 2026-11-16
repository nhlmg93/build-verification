import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { z } from "zod";

const reportId = z.string().regex(/^[a-zA-Z0-9_-]{1,100}$/);
const reportFile = z.string().regex(/^[a-zA-Z0-9_-]+\.html$/);
const reportSchema = z.object({
  file: reportFile,
  source: z.string(),
  archived: z.boolean(),
});
const databaseSchema = z.object({
  reports: z.record(reportId, reportSchema),
});

const databasePath = fileURLToPath(new URL("../../db.json", import.meta.url));
const wwwDirectory = fileURLToPath(new URL("../../www/", import.meta.url));

function readDatabase() {
  if (!existsSync(databasePath)) return databaseSchema.parse({ reports: {} });

  return databaseSchema.parse(JSON.parse(readFileSync(databasePath, "utf8")));
}

export function getReport(id: string) {
  const database = readDatabase();

  if (!Object.hasOwn(database.reports, id)) return undefined;

  return database.reports[id];
}

export function listReports() {
  return Object.entries(readDatabase().reports).map(([id, report]) => ({
    id,
    file: report.file,
    archived: report.archived,
  }));
}

export function registerReport(id: string, file: string, source: string): void {
  reportId.parse(id);
  reportFile.parse(file);
  const database = readDatabase();

  if (Object.hasOwn(database.reports, id)) {
    throw new Error(`Report already registered: ${id}`);
  }

  if (!existsSync(join(wwwDirectory, file))) {
    throw new Error(`Write the report to www/${file} before registering it.`);
  }

  database.reports[id] = { file, source, archived: false };
  writeFileSync(databasePath, JSON.stringify(database, null, 2) + "\n");
}

export function archiveReport(id: string): void {
  const database = readDatabase();

  if (!Object.hasOwn(database.reports, id)) {
    throw new Error(`Unknown report: ${id}`);
  }

  database.reports[id].archived = true;
  writeFileSync(databasePath, JSON.stringify(database, null, 2) + "\n");
}

export function deleteReport(id: string): void {
  const database = readDatabase();

  if (!Object.hasOwn(database.reports, id)) {
    throw new Error(`Unknown report: ${id}`);
  }

  rmSync(join(wwwDirectory, database.reports[id].file), { force: true });
  delete database.reports[id];
  writeFileSync(databasePath, JSON.stringify(database, null, 2) + "\n");
}
