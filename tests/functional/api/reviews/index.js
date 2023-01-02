import chai from "chai";
import request from "supertest";
const mongoose = require("mongoose");
import Movie from "../../../../api/movies/movieModel";
import api from "../../../../index";
import movies from "../../../../seedData/movies";
import User from "../../../../api/users/userModel";
import { movieReviews } from '../../../../api/movies/moviesData'

// set up seed data for datastore
let seedData = {
  movieReviews: []
}
movieReviews.results.forEach(review => seedData.movieReviews.push(review))
const expect = chai.expect;
let db;
let token;
let date;
let reviewsLength;
let reviewContent;
let reviewRating;
let username = "user1";

describe("Reviews endpoint", () => {
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
    // Clean out datastore
    while (movieReviews.results.length > 0) {
      movieReviews.results.pop()
    }
    // Repopulate datastore
    seedData.movieReviews.forEach(review => movieReviews.results.push(review))
    try {
      await Movie.deleteMany();
      await Movie.collection.insertMany(movies);
      await User.deleteMany();
      // Register a user
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
  describe("GET /api/reviews/:id/reviews", () => {
    before(() => {
      token = "BEARER eyJhbGciOiJIUzI1NiJ9.dXNlcjE.FmYria8wq0aFDHnzYWhKQrhF5BkJbFNN1PqNyNQ7V4M"
    })
    describe("when the id is valid", () => {
      it("should a object contains a list of the reviews of the movie and a status 200", () => {
        return request(api)
          .get(`/api/reviews/${movieReviews.id}/reviews`)
          .set("Accept", "application/json")
          .set("Authorization", token)
          .then((res) => {
            expect(res.body).to.have.property("id", 527774);
            expect(res.body.results).to.be.a("array");
          });
      });
    });
    describe("when movie id is invalid", () => {
      it("should return a status 404 and the corresponding message", () => {
        return request(api)
          .get(`/api/reviews/999999999/reviews`)
          .set("Accept", "application/json")
          .set("Authorization", token)
          .expect(404)
          .expect({
            message: 'The resource you requested could not be found.',
            status_code: 404
          });
      });
    });
  });

  describe("POST /api/reviews/movie/:id/reviews/:username", () => {
    before(() => {
      token = "BEARER eyJhbGciOiJIUzI1NiJ9.dXNlcjE.FmYria8wq0aFDHnzYWhKQrhF5BkJbFNN1PqNyNQ7V4M"
    })
    describe("when the id is valid", () => {
      before(() => {
        reviewContent = "Nice movie."
      })
      describe("The content is not empty", () => {
        it("should a object contains a list of the reviews of the movie and a status 200", () => {
          return request(api)
            .post(`/api/reviews/movie/${movieReviews.id}/reviews/${username}`)
            .send({
              content: reviewContent
            })
            .set("Accept", "application/json")
            .set("Authorization", token)
            .expect(201)
            .then((res) => {
              expect(res.body).to.have.property("author", username)
              expect(res.body).to.have.property("content", reviewContent)
            });
        });
      });
      describe("The content is invalid", () => {
        it("should return a status 403 and the corresponding message", () => {
          return request(api)
            .post(`/api/reviews/movie/${movieReviews.id}/reviews/${username}`)
            .send({
              content: ""
            })
            .set("Accept", "application/json")
            .set("Authorization", token)
            .expect(403)
            .expect({ message: 'Invalid content.', status_code: 403 });
        })
      })
    });
    describe("when movie id is invalid", () => {
      it("should return a status 404 and the corresponding message", () => {
        return request(api)
          .post(`/api/reviews/movie/999999/reviews/user1`)
          .send({
            content: "Bad movie."
          })
          .set("Accept", "application/json")
          .set("Authorization", token)
          .expect(404)
          .expect({
            message: 'The resource you requested could not be found.',
            status_code: 404
          });
      });
    });
  });
});