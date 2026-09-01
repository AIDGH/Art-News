import { HealthController } from "./health.controller";

describe("HealthController", () => {
  it("returns the service readiness payload", () => {
    const result = new HealthController().check();

    expect(result.status).toBe("ok");
    expect(result.service).toBe("art-news-api");
    expect(result.timestamp).toBeDefined();
  });
});
