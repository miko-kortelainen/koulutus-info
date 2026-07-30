import { expect, test } from "vitest";
import { parseAmkResponse, parseUniversityResponse, readResponse } from "./calculatorApi";

test.each([
  [() => parseUniversityResponse({ applicationRound: "2026", programs: [] }, false), "applicationRound"],
  [() => parseUniversityResponse({ applicationRound: "2026-kevat", programs: [{}] }, false), "programs[0]"],
  [
    () =>
      parseAmkResponse({ applicationRound: "2026-kevat", ammattikorkeakoulut: [], maximumScore: Number.NaN }, false),
    "ammattikorkeakoulut",
  ],
  [
    () => parseAmkResponse({ applicationRound: "2026-kevat", ammattikorkeakoulut: [{}], maximumScore: 100 }, false),
    "ammattikorkeakoulut[0]",
  ],
])("rejects malformed calculator responses", (parse, path) => {
  expect(parse).toThrow(path);
});

test.each([
  [JSON.stringify({ error: { message: "Test error" } }), 400, "Test error"],
  ["not json", 500, "Pistelaskurin pyyntö epäonnistui."],
])("uses the API error message or Finnish fallback", async (body, status, message) => {
  await expect(readResponse(Promise.resolve(new Response(body, { status })), () => null)).rejects.toThrow(message);
});

test("translates a fetch timeout", async () => {
  const timeout = Promise.reject(new DOMException("", "TimeoutError"));
  await expect(readResponse(timeout, () => null)).rejects.toThrow("Pistelaskurin pyyntö aikakatkaistiin.");
});
