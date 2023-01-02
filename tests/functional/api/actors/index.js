import chai from "chai";
import request from "supertest";
const mongoose = require("mongoose");
import Actor from "../../../../api/actors/actorModel";
import api from "../../../../index";
import actors from "../../../../seedData/actors";

// set up seed data for datastore
const expect = chai.expect;
let db;

describe("Actors endpoint", () => {
  before(() => {
    mongoose.connect(process.env.MONGO_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = mongoose.connection;
  });
  beforeEach(async () => {
    try {
      await Actor.deleteMany();
      await Actor.collection.insertMany(actors);
    } catch (err) {
      console.error(`failed to Load user Data: ${err}`);
    }
  });
  after(async () => {
    try {
      await db.dropDatabase();
    } catch (error) {
      console.log(error);
    }
  });
  afterEach(() => {
    api.close(); // Release PORT 8080
  });
  describe("GET /api/actors", () => {
    it("should return 20 people and a status 200", () => {
      return request(api)
        .get(`/api/actors`)
        .expect(200)
        .then((res) => {
          expect(res.body).to.be.a("array");
          expect(res.body.length).to.equal(20);
        });
    });
  });
  describe("GET /api/actors/:id", () => {
    describe("when the id is valid", () => {
      it("should an object of people and a status 200", () => {
        return request(api)
          .get(`/api/actors/${actors[0].id}`)
          .expect(200)
          .then((res) => {
            expect(res.body).to.have.property("name", actors[0].name);
          });
      });
    })
    describe("when the id is invalid", () => {
      it("should return 500 because this actor resource isn't accessible from TMDB", () => {
        return request(api)
          .get(`/api/actors/9999999999999999`)
          .expect(500)
      });
    })
  });
  describe("GET /api/actors/popular", () => {
    it("should return 20 actors of corresponding page from tmdb and a status 200", () => {
      return request(api)
        .get('/api/actors/popular')
        .set("Accept", "application/json")
        .expect(200)
        .then((res) => {
          expect(res.body).to.have.property("page");
          expect(res.body.results).to.be.a("array");
          expect(res.body.results.length).to.equal(20);
        });
    });
  })
  describe("GET /api/actors/:id/movies", () => {
    describe("when the id is valid number", () => {
      it("should return an object containing all the actor's movies and status 200", () => {
        return request(api)
          .get(`/api/actors/${actors[0].id}/movies`)
          .expect(200)
          .then((res) => {
            expect(res.body).to.have.property("id", actors[0].id);
            expect(res.body).to.have.property("cast");
            expect(res.body).to.have.property("crew");
          });
      });
    });
    describe("when the id is not number", () => {
      it("should return 500 because this resource isn't accessible from TMDB", () => {
        return request(api)
          .get(`/api/actors/abcdefg/movies`)
          .expect(500)
      });
    });
  });
  describe("GET /api/actors/:id/images", () => {
    describe("when the id is valid number", () => {
      it("should return an object containing all the actor's images and status 200", () => {
        return request(api)
          .get(`/api/actors/${actors[0].id}/images`)
          .expect(200)
          .then((res) => {
            expect(res.body).to.have.property("id", actors[0].id);
            expect(res.body).to.have.property("profiles");
          });
      });
    });
    describe("when the id is not number", () => {
      it("should return 500 because this resource isn't accessible from TMDB", () => {
        return request(api)
          .get(`/api/actors/abcdefg/images`)
          .expect(500)
      });
    });
  });
});      