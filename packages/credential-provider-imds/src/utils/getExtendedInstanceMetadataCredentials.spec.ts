import { Logger } from "@smithy/types";
import { afterEach, beforeEach, describe, expect, test as it, vi } from "vitest";

import { getExtendedInstanceMetadataCredentials } from "./getExtendedInstanceMetadataCredentials";

describe("getExtendedInstanceMetadataCredentials()", () => {
  let nowMock: any;
  const staticSecret = {
    accessKeyId: "key",
    secretAccessKey: "secret",
  };
  const logger: Logger = {
    warn: vi.fn(),
  } as any;

  beforeEach(() => {
    vi.spyOn(global.Math, "random");
    nowMock = vi.spyOn(Date, "now").mockReturnValueOnce(new Date("2022-02-22T00:00:00Z").getTime());
  });

  afterEach(() => {
    nowMock.mockRestore();
  });

  it("should extend the expiration random time(5~10 mins) from now", () => {
    const anyDate: Date = "any date" as unknown as Date;
    (Math.random as any).mockReturnValue(0.5);
    expect(getExtendedInstanceMetadataCredentials({ ...staticSecret, expiration: anyDate }, logger)).toEqual({
      ...staticSecret,
      originalExpiration: anyDate,
      expiration: new Date("2022-02-22T00:07:30Z"),
    });
    expect(Math.random).toBeCalledTimes(1);
  });

  it("should print warning message when extending the credentials", () => {
    const anyDate: Date = "any date" as unknown as Date;
    getExtendedInstanceMetadataCredentials({ ...staticSecret, expiration: anyDate }, logger);
    expect(logger.warn).toBeCalledWith(expect.stringContaining("Attempting credential expiration extension"));
  });
});
