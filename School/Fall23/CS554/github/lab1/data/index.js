//const userData = require('./users');
import user from './users.js';
import recipes from './recipes.js';
//const recipeData = require('./recipes');

const module = {
    users: user,
    recipes: recipes
};

export default module;