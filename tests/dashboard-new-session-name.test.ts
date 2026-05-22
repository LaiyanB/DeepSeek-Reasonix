import { describe, expect, it } from "vitest";
import { handleSessions } from "../src/server/api/sessions.js";

function makeCtx(current: string | null, calls: Array<string | undefined>) {
  return {
    mode: "attached" as const,
    configPath: "config.json",
    usageLogPath: "usage.jsonl",
    getSessionName: () => current,
    switchSession: (name: string | undefined) => {
      calls.push(name);
      return { ok: true as const };
    },
  };
}

describe("dashboard /sessions/new", () => {
  it("mints a named session based on the current session", async () => {
    const calls: Array<string | undefined> = [];
    const result = await handleSessions("POST", ["new"], "", makeCtx("alpha", calls));

    expect(result.status).toBe(200);
    expect(calls).toHaveLength(1);
    expect(calls[0]).toMatch(/^alpha-\d{14}$/);
  });

  it("uses default when the attached CLI has no named current session", async () => {
    const calls: Array<string | undefined> = [];
    const result = await handleSessions("POST", ["new"], "", makeCtx(null, calls));

    expect(result.status).toBe(200);
    expect(calls).toHaveLength(1);
    expect(calls[0]).toMatch(/^default-\d{14}$/);
  });
});
