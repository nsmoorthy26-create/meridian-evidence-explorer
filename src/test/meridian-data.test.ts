import { describe, expect, it } from "vitest";

import { INITIAL_RESULT_COUNT, RESULTS_PER_PAGE, meridianResults } from "@/lib/meridian-data";

describe("Meridian evidence search", () => {
  it("starts with exactly three result sections", () => {
    expect(meridianResults.slice(0, INITIAL_RESULT_COUNT)).toHaveLength(3);
  });

  it("reveals three additional result sections per Show More action", () => {
    expect(meridianResults.slice(INITIAL_RESULT_COUNT, INITIAL_RESULT_COUNT + RESULTS_PER_PAGE)).toHaveLength(3);
  });
});