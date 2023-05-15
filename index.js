const express = require("express");
(swaggerJSDoc = require("swagger-jsdoc")),
  (swaggerUi = require("swagger-ui-express"));
const morgan = require("morgan");

const app = express();
const PORT = 8081 || process.env.PORT;
const userController = require("./controller/user.controller");
const movieController = require("./controller/movie.controller");
const authenticationController = require("./controller/authentication.controller");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Express API with Swagger",
      version: "0.1.0",
      description: "sample untuk API hw 9",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          in: "header",
          name: "Authorization",
          description: "Bearer token to access these api endpoints",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    server: [
      {
        url: "http://localhost:8081",
      },
    ],
  },
  apis: ["./controller/*.js"],
};
const specs = swaggerJSDoc(options);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
);

app.use(express.json());
app.use(morgan("combined"));
app.use(authenticationController);
app.use(userController);
app.use(movieController);

app.get("/ping", (req, res) => {
  res.json({ ping: true });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
