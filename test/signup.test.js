const request = require("supertest");
const app = require("../server");
const db = require("../models/index");

beforeAll(async () => {
  await db.sequelize.sync({ force: true }); // Ensure database is in a clean state before tests
});

afterAll(async () => {
  await db.sequelize.close(); // Close the database connection after tests
});

describe("basic test", () => {
  it("should create a new user and respond with 200 status", async () => {
    const response = await request(app).post("/auth/signup").send({
      email: "testuser@example.com",
      password: "password123",
      firstName: "Test",
      lastName: "User",
    });
    expect(response.statusCode).toBe(200);
  });
});
