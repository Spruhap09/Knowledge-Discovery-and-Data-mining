//const routes = require('./recipeUser');
import routes from './recipeUser.js'

const constructorMethod = (app) => {
  app.use('/', routes);

  app.use('*', (req, res) => {
    res.sendStatus(404);
  });
};

//module.exports = constructorMethod;
export default constructorMethod;