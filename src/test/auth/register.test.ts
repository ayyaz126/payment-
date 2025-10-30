import request from "supertest";
import app from "../../app";
import { Pool } from "pg";

describe("POST /v1/api/auth/register", () => {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  afterAll(async () => {
    await pool.end(); // ✅ close DB connection after tests
  });

  it("should register a new user successfully", async () => {
    const res = await request(app)
      .post("/v1/api/auth/register") // ✅ correct endpoint
      .send({
        name: "Test User",
        email: `test_${Date.now()}@example.com`,
        password: "Password123",
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("message", "User registered successfully");
    expect(res.body).toHaveProperty("user");
  });

  it("should return 400 if missing fields", async () => {
    const res = await request(app)
      .post("/v1/api/auth/register")
      .send({
        email: "missingname@example.com",
      });

    expect(res.status).toBe(400);
  });
});
