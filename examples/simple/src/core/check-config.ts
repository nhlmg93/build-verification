import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { z } from "zod";

const configSchema = z.object({
  appName: z.string().trim().min(1),
  port: z.number().int().min(1).max(65535),
});

export interface ConfigResult {
  source: string;
  checkedAt: string;
  passed: boolean;
  message: string;
}

export function checkConfig(file: string): ConfigResult {
  const source = resolve(file);
  const checkedAt = new Date().toISOString();

  try {
    const result = configSchema.safeParse(JSON.parse(readFileSync(source, "utf8")));

    if (!result.success) {
      return {
        source,
        checkedAt,
        passed: false,
        message: result.error.issues
          .map((issue) => `${issue.path.join(".") || "config"}: ${issue.message}`)
          .join("\n"),
      };
    }

    return {
      source,
      checkedAt,
      passed: true,
      message: "appName is nonempty and port is an integer between 1 and 65535.",
    };
  } catch (error) {
    return {
      source,
      checkedAt,
      passed: false,
      message: error instanceof Error ? error.message : String(error),
    };
  }
}
