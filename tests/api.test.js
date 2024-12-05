const request = require('supertest');
const { app } = require('../index.js');
const { getAllMovies, getMovieById } = require('../Controllers/index.js');
const http = require('http');
const { describe, beforeEach } = require('node:test');

jest.mock('../Controllers/index.js', () => ({
  ...jest.requireActual('../Controllers/index.js'),
  getAllMovies: jest.fn(),
  getMovieById: jest.fn(),
}));

let server;

beforeAll(async () => {
  server = http.createServer(app);
  server.listen(3001);
});

afterAll(async () => {
  server.close();
});

describe('Controller functions test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return all movies', () => {
    let mockMovies = [
      {
        movieId: 1,
        title: 'Inception',
        genre: 'Sci-Fi',
        director: 'Christopher Nolan',
      },
      {
        movieId: 2,
        title: 'The Shawshank Redemption',
        genre: 'Drama',
        director: 'Frank Darabont',
      },
      {
        movieId: 3,
        title: 'The Godfather',
        genre: 'Crime',
        director: 'Francis Ford Coppola',
      },
    ];
    getAllMovies.mockReturnValue(mockMovies);
    let result = getAllMovies();

    expect(result).toEqual(mockMovies);
    expect(result.length).toBe(3);
  });
  it('should return movie by id', () => {
    let mockMovie = {
      movieId: 2,
      title: 'The Shawshank Redemption',
      genre: 'Drama',
      director: 'Frank Darabont',
    };
    getMovieById.mockReturnValue(mockMovie);
    let result = getMovieById(2);
    expect(result).toEqual(mockMovie);
  });
});

describe('Api endpoints testing', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('/movies should return all movies', async () => {
    let res = await request(server).get('/movies');
    expect(res.status).toBe(200);
    expect(res.body.movies.length).toBe(3);
    expect(res.body).toEqual({
      movies: [
        {
          movieId: 1,
          title: 'Inception',
          genre: 'Sci-Fi',
          director: 'Christopher Nolan',
        },
        {
          movieId: 2,
          title: 'The Shawshank Redemption',
          genre: 'Drama',
          director: 'Frank Darabont',
        },
        {
          movieId: 3,
          title: 'The Godfather',
          genre: 'Crime',
          director: 'Francis Ford Coppola',
        },
      ],
    });
  });

  it('/movies/details/:id should return movie by id', async () => {
    getMovieById.mockReturnValue({
      movieId: 1,
      title: 'Inception',
      genre: 'Sci-Fi',
      director: 'Christopher Nolan',
    });
    let res = await request(server).get('/movies/details/1');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      movie: {
        movieId: 1,
        title: 'Inception',
        genre: 'Sci-Fi',
        director: 'Christopher Nolan',
      },
    });
  });
});
