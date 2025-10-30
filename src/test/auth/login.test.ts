import request from "supertest";
import app from "../../app"; // 👈 path check kar lena agar alag ho

describe("POST /v1/api/auth/login", () => {
    beforeAll(async () => {
      // Ensure user exists before testing login
      await request(app).post("/v1/api/auth/register").send({
        name: "azzi",
        email: "ayyazyousaf1223@gmail.com",
        password: "1234567",
      });
    });
  
    it("should login successfully with correct credentials", async () => {
      const res = await request(app)
        .post("/v1/api/auth/login")
        .send({
          email: "ayyazyousaf1223@gmail.com",
          password: "1234567",
        });
  
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("message", "Login successful");
      expect(res.body).toHaveProperty("accessToken");
    });
  
    it("should return 401 for invalid credentials", async () => {
      const res = await request(app)
        .post("/v1/api/auth/login")
        .send({
          email: "ayyazyousaf1223@gmail.com",
          password: "wrongpassword",
        });
  
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("message");
    });
  });