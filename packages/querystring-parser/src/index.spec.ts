import { QueryParameterBag } from "@smithy/types";
import { describe, expect, test as it } from "vitest";

import { parseQueryString } from "./";

describe("parseQueryString", () => {
  const testCases = new Map<string, QueryParameterBag>([
    [
      "?snap=cr%C3%A4ckle&snap=p%C3%B4p&fizz=buzz&quux",
      {
        snap: ["cräckle", "pôp"],
        fizz: "buzz",
        quux: null,
      },
    ],
    ["?", {}],
    ["?foo=", { foo: "" }],
    ["foo=bar&foo=baz&foo=quux", { foo: ["bar", "baz", "quux"] }],
  ]);

  for (const [querystring, parsed] of testCases) {
    it(`should correctly parse ${querystring}`, () => {
      expect(parseQueryString(querystring)).toEqual(parsed);
    });
  }
});
