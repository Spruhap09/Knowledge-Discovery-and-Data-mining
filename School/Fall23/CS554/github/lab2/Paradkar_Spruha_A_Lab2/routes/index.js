import marvelRoutes from './marvel.js';

const constructorMethod = (app) => {
  app.use('/', marvelRoutes);

  app.use('*', (req, res) => {
    res.sendStatus(404);
  });
};

export default constructorMethod;