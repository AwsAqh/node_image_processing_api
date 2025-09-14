import request from "supertest";
import app from "../../src/app";

describe("GET /api/images", () => {
  it("should return 400 if filename is missing", async () => {
    const res = await request(app).get("/api/images?width=200&height=200");
    expect(res.status).toBe(400);
    expect(res.text).toContain("Filename is required");
  });

  it("should return 400 if width or height is invalid", async () => {
    const res = await request(app).get(
      "/api/images?filename=fjord.jpg&width=-100&height=abc",
    );
    expect(res.status).toBe(400);
    expect(res.text).toContain("Width and height are required");
  });

  it("should return 400 if width or height is zero", async () => {
    const res = await request(app).get(
      "/api/images?filename=fjord.jpg&width=0&height=200",
    );
    expect(res.status).toBe(400);
    expect(res.text).toContain("Width and height are required");
  });

  it("should return 400 if width or height is missing", async () => {
    const res = await request(app).get(
      "/api/images?filename=fjord.jpg&width=200",
    );
    expect(res.status).toBe(400);
    expect(res.text).toContain("Width and height are required");
  });

  it("should return 404 if image does not exist", async () => {
    const res = await request(app).get(
      "/api/images?filename=nonexistent.jpg&width=200&height=200",
    );
    expect(res.status).toBe(404);
    expect(res.text).toContain(
      'Image "nonexistent.jpg" not found in full folder',
    );
  });

  it("should return 200 and serve the resized image", async () => {
    const res = await request(app).get(
      "/api/images?filename=fjord.jpg&width=200&height=200",
    );
    expect(res.status).toBe(200);
    expect(res.header["content-type"]).toContain("image/jpeg");
  });
});
