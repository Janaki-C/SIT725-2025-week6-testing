const { expect } = require("chai");
const supertest = require("supertest");
const app = require("../server");
const { connectToDatabase, getDb } = require("../dbconnection");

const request = supertest(app);
const testContent = {
  heading: "Test Heading",
  description: "Test Description",
  picture: "http://localhost:3000/images/dog-1.jpg"
};

let db;
let server;

describe("SIT725 Week 6 - Mocha & Chai Testing Suite", function () {
  this.timeout(10000);

  before(async () => {
    server = app.listen(4000);
    await connectToDatabase();
    db = getDb();
    await db.collection("contents").deleteMany({});
  });

  after(async () => {
    await db.collection("contents").deleteMany({});
    server.close();
  });

  // ✅ Unit Test - Validation Middleware (implicitly via POST)
  describe("Unit Test - Content Validation", () => {
    it("should reject empty fields", async () => {
      const res = await request.post("/api/addContent").send({
        heading: "",
        description: "",
        picture: ""
      });
      expect(res.status).to.equal(400);
      expect(res.body.error).to.include("required");
    });

    it("should reject missing fields", async () => {
      const res = await request.post("/api/addContent").send({
        heading: "Only heading"
      });
      expect(res.status).to.equal(400);
    });
  });

  // ✅ API + Integration Testing
  describe("Add and Fetch Content", () => {
    let insertedId;

    it("should add valid content", async () => {
      const res = await request.post("/api/addContent").send(testContent);
      expect(res.status).to.equal(201);
      expect(res.body.data).to.have.property("_id");
      insertedId = res.body.data._id;
    });

    it("should get all content", async () => {
      const res = await request.get("/api/getContent");
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("array");
      expect(res.body.length).to.be.at.least(1);
    });

    it("should delete existing content", async () => {
      const res = await request.delete(`/api/deleteContent/${insertedId}`);
      expect(res.status).to.equal(200);
      expect(res.body.message).to.include("deleted");
    });

    it("should fail to delete already deleted content", async () => {
      const res = await request.delete(`/api/deleteContent/${insertedId}`);
      expect(res.status).to.equal(404);
    });

    it("should return 400 for invalid ObjectId", async () => {
      const res = await request.delete("/api/deleteContent/invalidid123");
      expect(res.status).to.equal(400);
    });
  });
});
