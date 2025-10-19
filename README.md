# Assignment 2 - Agile Software Practice.
​
## API endpoints.

### Actors
+ /api/actors/ | GET | Gets actors from seedData
+ /api/actors/tmdb/popular | GET | Gets popular actors from tmdb
+ /api/actors/tmdb/actor/:id | GET | Gets detailed information of an actor from tmdb
+ /api/actors/tmdb/actor/:id/movies | GET | Gets movies in which an actor has acted from tmdb
+ /api/actors/tmdb/actor/:id/images | GET | Gets actor images from tmdb
### Genres
+ /api/genres/local | GET | Gets all genres from seedData
+ /api/genres/tmdb | GET | Gets all genres from tmdb
### Movies(Auth)
+ /api/movies/:id | GET | Gets a single movie from tmdb
+ /api/movies/tmdb/upcoming/:page | GET | Get upcoming movies from tmdb based on page number
+ /api/movies/tmdb/topRated/:page | GET | Get top rated movies from tmdb based on page number
+ /api/movies/tmdb/movie/:id/images | GET | Get movie images from tmdb
### Reviews(Auth)
+ /api/reviews/movie/:id/reviews | GET | Gets a movie reviews
+ /api/reviews/movie/:id/reviews/:username | POST | posts or updates a review
### Users
+ /api/users/ | GET | Gets all users information from MongoDB
+ /api/users/ | POST | Registers/authenticates a user
+ /api/users/:id | Put | Updates information about a user
+ /api/users/:userName/favourites | GET | Gets users favourites
+ /api/users/:userName/favourites | POST | Add a favourite movieId to user's favourites
+ /api/users/:username/movie/:id/favourites | POST | Deletes a movieId from a user's favourites


## Test cases.

~~~
  Users endpoint
    GET /api/users
database connected to test on ac-xwzra6c-shard-00-00.cyvp7yv.mongodb.net
      √ should return the 2 users and a status 200 (43ms)
    POST /api/users 
      For a register action
        when the payload is correct
          √ should return a 201 status and the confirmation message (192ms)
      For an authenticate action
        when the payload is correct
          √ should return a 200 status and a generated token (169ms)
    POST /api/users/:username/favourites
      for valid user name
        when the movie is not in favourites
          √ should return user message and a status 201 (139ms)
        when the movie is in favourites
          √ return error message and a status 403 (74ms)
      for invalid user name
        √ return error message and a status 500
    GET /api/users/:username/favourites
      √ should return the favourites list and status 200 (40ms)
    POST /api/users/:username/movie/:id/favourites
      for valid user name
        when the movie is in favourites
          √ should return user message and a status 201 (64ms)
        when the movie is not in favourites
          √ return error message and a status 404
      for invalid user name
        √ return error message and a status 404

  Movies endpoint
    GET /api/movies/:id
      when the user is authenticated
        when the id is valid
          √ should return the matching movie (74ms)
        when the id is invalid
          √ should return 500 because this movie resource isn't accessible from TMDB (77ms)
      when the user is not authenticated
        √ should return a status 401 and Unauthorized message
    GET /api/movies/tmdb/upcoming/:page
      when the page number is valid
        √ should return 20 movies of corresponding page from tmdb and a status 200 (152ms)
      when the page number is invalid
        √ should return a empty result (146ms)
    GET /api/movies/tmdb/topRated/:page
      when the page number is valid
        √ should return 20 movies of corresponding page from tmdb and a status 200 (148ms)
      when the page number is invalid
        √ should return a empty result (144ms)
    GET /api/movies/tmdb/movie/:id/images
      when the user is authenticated
        when the id is valid number
          √ should return an object containing the images and status 200 (81ms)
        when the id is not number
          √ should return 500 because this resource isn't accessible from TMDB (72ms)
      when the user is not authenticated
        √ should return a status 401

  Genres endpoint
    GET /api/genres/local
      √ should return 4 genres and a status 200
    GET /api/genres/tmdb 
      √ should return a list of genres and a status 200 (52ms)

  Actors endpoint
    GET /api/actors
      √ should return 20 people and a status 200 (59ms)
    GET /api/actors/:id
      when the id is valid
        √ should an object of people and a status 200 (53ms)
      when the id is invalid
        √ should return 500 because this actor resource isn't accessible from TMDB (54ms)
    GET /api/actors/popular
      √ should return 20 actors of corresponding page from tmdb and a status 200 (58ms)
    GET /api/actors/:id/movies
      when the id is valid number
        √ should return an object containing all the actor's movies and status 200 (53ms)
      when the id is not number
        √ should return 500 because this resource isn't accessible from TMDB (52ms)
    GET /api/actors/:id/images
      when the id is valid number
        √ should return an object containing all the actor's images and status 200 (52ms)
      when the id is not number
        √ should return 500 because this resource isn't accessible from TMDB (50ms)

  Reviews endpoint
    GET /api/reviews/:id/reviews
      when the id is valid
        √ should a object contains a list of the reviews of the movie and a status 200
      when movie id is invalid
        √ should return a status 404 and the corresponding message
    POST /api/reviews/movie/:id/reviews/:username
      when the id is valid
        The content is not empty
          √ should a object contains a list of the reviews of the movie and a status 200
        The content is invalid
          √ should return a status 403 and the corresponding message
      when movie id is invalid
        √ should return a status 404 and the corresponding message


  35 passing (15s)

--------------------------|---------|----------|---------|---------|--------------------------
File                      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s        
--------------------------|---------|----------|---------|---------|--------------------------
All files                 |   82.27 |     71.5 |   82.35 |   84.06 | 
 assignment2              |   96.55 |       50 |     100 |   96.55 | 
  index.js                |   96.55 |       50 |     100 |   96.55 | 20
 assignment2/api/actors   |    98.3 |      100 |   95.23 |   96.87 | 
  actorModel.js           |   85.71 |      100 |       0 |   83.33 | 42
  index.js                |     100 |      100 |     100 |     100 | 
 assignment2/api/genres   |     100 |      100 |     100 |     100 | 
  genreModel.js           |     100 |      100 |     100 |     100 | 
  genresData.js           |     100 |      100 |     100 |     100 | 
  index.js                |     100 |      100 |     100 |     100 | 
 assignment2/api/movies   |   95.16 |    83.33 |     100 |   95.12 | 
  index.js                |   93.75 |    83.33 |     100 |   92.85 | 15,27
  movieModel.js           |     100 |      100 |     100 |     100 | 
  moviesData.js           |     100 |      100 |     100 |     100 | 
 assignment2/api/reviews  |     100 |      100 |     100 |     100 | 
  index.js                |     100 |      100 |     100 |     100 | 
 assignment2/api/tmdb     |   86.48 |    73.91 |   84.37 |   85.91 | 
  tmdb-api.js             |   86.48 |    73.91 |   84.37 |   85.91 | 24,46-55,107,112,136,141
 assignment2/api/users    |   86.46 |    77.61 |   90.32 |    86.2 | 
  index.js                |   86.11 |    78.94 |      88 |   85.71 | 17-25,68,74,88
  userModel.js            |      88 |       70 |     100 |    87.5 | 20,31,35
 assignment2/authenticate |   95.83 |    83.33 |     100 |   94.73 | 
  index.js                |   95.83 |    83.33 |     100 |   94.73 | 19
 assignment2/db           |   81.81 |      100 |   33.33 |   81.81 | 
  index.js                |   81.81 |      100 |   33.33 |   81.81 | 11,14
 assignment2/seedData     |   28.04 |     3.84 |       0 |   36.53 | 
  actors.js               |     100 |      100 |     100 |     100 | 
  genres.js               |     100 |      100 |     100 |     100 | 
  index.js                |   15.71 |     3.84 |       0 |      25 | 14-60,63-66
  movies.js               |     100 |      100 |     100 |     100 | 
  users.js                |     100 |      100 |     100 |     100 | 
--------------------------|---------|----------|---------|---------|--------------------------
~~~
​
## Independent Learning (if relevant)

Code coverage report and Coveralls web service:
+ https://coveralls.io/gitlab/luoyangyuli2001/agile-assignment2
+ [![Coverage Status](https://coveralls.io/repos/gitlab/luoyangyuli2001/agile-assignment2/badge.svg?branch=main)](https://coveralls.io/gitlab/luoyangyuli2001/agile-assignment2?branch=main)

## Other related links
+ gitlab: https://gitlab.com/luoyangyuli2001/agile-assignment2
+ github: https://github.com/luoyangyuli2001/Agile-assignment2
+ HEROKU Staging App: https://dashboard.heroku.com/apps/agile-assignment2-yl-cicd
+ HEROKU Production App: https://dashboard.heroku.com/apps/agile-ca2-yl-production
+ Coverall: https://coveralls.io/gitlab/luoyangyuli2001/agile-assignment2
