const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.status(201).json(repository);
});

function checkIfRepositoryExists(request, response, next) {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if(repoIndex === -1) {
    return response.status(404).json({
      error: 'Repository not found!'
    });
  }

  response.repoIndex = repoIndex;
  next();
}

app.put("/repositories/:id", checkIfRepositoryExists, (request, response) => {
  const { title, url, techs } = request.body;

  const repoIndex = response.repoIndex;

  repositories[repoIndex].title = title;
  repositories[repoIndex].url = url;
  repositories[repoIndex].techs = techs;

  return response.json(repositories[repoIndex]);
});

app.delete("/repositories/:id", checkIfRepositoryExists, (request, response) => {
  const repoIndex = response.repoIndex;

  repositories.splice(repoIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", checkIfRepositoryExists, (request, response) => {
  const repoIndex = response.repoIndex;

  ++repositories[repoIndex].likes;

  return response.json('likes');
});

module.exports = app;