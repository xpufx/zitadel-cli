import { describe, it, expect } from "vitest";

// Simple test to verify the module loads
import { setOutputFormat, printResult } from "./format";

describe("format", () => {
  it("can set output format", () => {
    expect(() => setOutputFormat("json")).not.toThrow();
  });

  it("handles simple data", () => {
    expect(() => printResult({ foo: "bar" })).not.toThrow();
  });

  it("handles arrays", () => {
    expect(() => printResult([{ a: 1 }, { a: 2 }])).not.toThrow();
  });

  it("handles bigint", () => {
    expect(() => printResult({ count: BigInt(42) })).not.toThrow();
  });

  it("handles dates", () => {
    expect(() => printResult({ date: { seconds: 1700000000, nanos: 0 } })).not.toThrow();
  });
});
