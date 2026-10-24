import { describe, expect, it } from "vitest";
import { calcStreak } from "./streak";

const today = "2026-10-24";

describe("calcStreak", () => {
  it("is 0 with no dates", () => {
    expect(calcStreak([], today)).toBe(0);
  });

  it("is 1 with only today", () => {
    expect(calcStreak(["2026-10-24"], today)).toBe(1);
  });

  it("is 1 with only yesterday (streak still alive)", () => {
    expect(calcStreak(["2026-10-23"], today)).toBe(1);
  });

  it("counts consecutive days ending today", () => {
    expect(calcStreak(["2026-10-22", "2026-10-23", "2026-10-24"], today)).toBe(3);
  });

  it("counts consecutive days ending yesterday", () => {
    expect(calcStreak(["2026-10-21", "2026-10-22", "2026-10-23"], today)).toBe(3);
  });

  it("stops at a gap", () => {
    expect(calcStreak(["2026-10-20", "2026-10-23", "2026-10-24"], today)).toBe(2);
  });

  it("is 0 when the last completion is two or more days ago", () => {
    expect(calcStreak(["2026-10-21", "2026-10-22"], today)).toBe(0);
  });

  it("ignores order and duplicates", () => {
    expect(
      calcStreak(["2026-10-24", "2026-10-22", "2026-10-23", "2026-10-23"], today)
    ).toBe(3);
  });

  it("works across a month boundary", () => {
    expect(
      calcStreak(["2026-10-30", "2026-10-31", "2026-11-01"], "2026-11-01")
    ).toBe(3);
  });
});