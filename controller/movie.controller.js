/**
 * @swagger
 * tags:
 *    name: Movies
 *    description: The movies managing API
 * /api/movies:
 *   post:
 *      summary: Create a new movie
 *      tags: [Movies]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movies'
 *      responses:
 *        200:
 *          description: The created movie.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Movies'
 *        500:
 *          description: Some server error
 * /api/movies/{id}:
 *   get:
 *      summary: Get the movie by id
 *      tags: [Movies]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: The movie by id
 *      responses:
 *        200:
 *          description: The movie created by id
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Movies'
 *        404:
 *          description: The movie was not found
 *   put:
 *      summary: Update the movie by id
 *      tags: [Movies]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: The movie by id
 *      requestBody:
 *          required: true
 *          content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Movies'
 *      responses:
 *        200:
 *          description: The movie was updated
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Movies'
 *        404:
 *          description: The movie was not found
 *        505:
 *          description: Some error happened
 *   delete:
 *      summary: Remove the movie by id
 *      tags: [Movies]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: The movie by id
 *
 *      responses:
 *        200:
 *          description: The movie created by id
 *        404:
 *          description: The movie was not found
 */

const express = require("express");
const router = express.Router();
const db = require("./../models");
const Movie = db.Movie;
const authenticateTokenMiddleware = require("../middleware/authentication");

// Inject middleware as global middleware
router.use(authenticateTokenMiddleware);

// GET /movies
router.get("/api/movies", async (request, response) => {
  const movies = await Movie.findAll({
    offset: request.query.page,
    limit: request.query.size,
  });
  const movieCount = await Movie.count();

  return response.status(200).json({
    data: movies,
    meta: {
      page: request.query.page,
      count: movieCount,
      size: movies.length,
    },
  });
});

// GET /movies/:id
router.get("/api/movies/:id", async (request, response) => {
  const movie = await Movie.findByPk(request.params.id);

  if (!movie) return response.status(404).json({ message: "Movies not found" });

  return response.status(200).json({ data: movie });
});

// POST /movies
router.post("/api/movies", async (request, response) => {
  const movie = await Movie.create(request.body);

  if (!movie)
    return response
      .status(422)
      .json({ message: "Failed create movie. Please try again" });

  return response.status(200).json({ data: movie });
});

// PUT /movies/:id
router.put("/api/movies/:id", async (request, response) => {
  const movie = await Movie.findByPk(request.params.id);

  if (!movie) return response.status(404).json({ message: "Movies not found" });

  Movie.update(request.body, { where: { id: request.params.id } });

  return response.status(200).json({ message: "Movie updated" });
});

// DELETE /movies/:id
router.delete("/api/movies/:id", async (request, response) => {
  const movie = await Movie.findByPk(request.params.id);

  if (!movie) return response.status(404).json({ message: "Movies not found" });

  Movie.destroy({ where: { id: request.params.id } });

  return response.status(200).json({ data: movie });
});

module.exports = router;
