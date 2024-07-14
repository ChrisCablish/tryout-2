const request = require("supertest");
const app = require("../server"); // Ensure this path correctly points to your Express app

test("Server should respond to the GET / route", async () => {
  const response = await request(app).get("/auth/signup");
  expect(response.statusCode).toBe(200); // Expecting HTTP status code 200 for a successful response
});
