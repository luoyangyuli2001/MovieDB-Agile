import chai from "chai";
import request from "supertest";
const mongoose = require("mongoose");
import Movie from "../../../../api/movies/movieModel";
import api from "../../../../index";
import movies from "../../../../seedData/movies";

const expect = chai.expect;
let db;
let token;

describe("Movies endpoint", () => {
  before(() => {
    mongoose.connect(process.env.MONGO_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = mongoose.connection;
  });

  after(async () => {
    try {
      await db.dropDatabase();
    } catch (error) {
      console.log(error);
    }
  });

  beforeEach(async () => {
    try {
      await Movie.deleteMany();
      await Movie.collection.insertMany(movies);
      await request(api).post("/api/users?action=register").send({
        username: "user1",
        password: "test1",
      });
    } catch (err) {
      console.error(`failed to Load user Data: ${err}`);
    }
  });
  afterEach(() => {
    api.close(); // Release PORT 8080
  });
  describe("GET /api/movies/:id", () => {
    describe("when the user is authenticated", () => {
      before(() => {
        token = "BEARER eyJhbGciOiJIUzI1NiJ9.dXNlcjE.FmYria8wq0aFDHnzYWhKQrhF5BkJbFNN1PqNyNQ7V4M"
      })
      describe("when the id is valid", () => {
        it("should return the matching movie", () => {
          return request(api)
            .get(`/api/movies/${movies[0].id}`)
            .set("Authorization", token)
            .expect(200)
            .then((res) => {
              expect(res.body).to.have.property("title", movies[0].title);
            });
        });
      });
      describe("when the id is invalid", () => {
        // TMDB will return 500 if the user send an invalid movie id to it.
        it("should return the NOT found message", () => {
          return request(api)
            .get("/api/movies/9999999999999")
            .set("Authorization", token)
            .expect(500)
        });
      });
    })
    describe("when the user is not authenticated", () => {
      before(() => {
        token = ""
      })
      it("should return a status 401 and Unauthorized message", () => {
        return request(api)
          .get(`/api/movies/${movies[0].id}`)
          .set("Authorization", token)
          .expect(401)
          .expect("Unauthorized");
      });
    })
  });
});
