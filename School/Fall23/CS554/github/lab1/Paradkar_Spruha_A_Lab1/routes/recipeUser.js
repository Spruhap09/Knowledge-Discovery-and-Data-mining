//const express = require('express');
import express from 'express';
const router = express.Router();
//import data from '../data/index.js';
//const data = require('../data');
//const recipe = data.recipes;
//const user = data.users;
import recipe from '../data/recipes.js';
import user from '../data/users.js';
import validation from '../validation.js';
import val from '../validation.js';
//const validation = require('../validation');


//wrong field - 400
//if not found: like wrong id: (if valid) then 404; if invalid (like recipe/foo then 400)
//tried to add a recipe but not logged in: then 401 (not authorized)
//if it fails to add a db then 500!

//TODO: NEED TO DO THE VERIFICATION ON THIS SIDE TOO, AND HAVE THE APP ERROR CODES
//TODO: THE DOC SAYS RESPOND WITH A 400 STATUS CODE, DOES THAT MEAN WE DONT CHANGE 400 TO 404 IN SOME CASES?
//TODO: CHANGE NAME TO BE ALLOW FOR THOSE CHARACTERS AS MENTIONED IN THE SLACK CHANNEL

router.post('/signup', async (req, res) => {
    
    let name = req.body.name;
    let username = req.body.username;
    let password = req.body.password;

    try{
        name = validation.checkName(name, 'Name');
        username = validation.checkUsername(username, 'Username');
        password = validation.checkPassword(password, 'Password');
    }
    catch(e){
        // res.status(400).send(e);
        return res.status(400).json({error: e});
    }

    try{
        const newUser = await user.createUser(name, username, password);    
        return res.json(newUser);
    }
    catch(e){
        //TODO: RIGHT RETURN THING?

        return res.status(500).json({error: e});
    }
});

router.post('/login', async (req, res) => {
    let username = req.body.username; 
    let password = req.body.password;
    try{
        username = validation.checkUsername(username, 'Username'); 
        password = validation.checkPassword(password, 'Password');
    }
    catch(e){
        return res.status(400).json({error: e});
    }

    try{
        const myUser = await user.getUserByUsername(username, password);
        req.session.user = {_id: myUser._id, username: myUser.username};
        //TODO: IF USER NOT FOUND, SHOULD I RESPOND WITH A 404 HERE?
        return res.json(myUser);
    }
    catch(e){
        return res.status(404).json({error: e});
    }
})

router.post('/recipes', async (req, res) => {
    
    let title = req.body.title;
    let ingredients = req.body.ingredients;
    let skillLevel = req.body.skillLevel;
    let steps = req.body.steps;
    
    try{
        
        if (!req.session.user){
            return res.status(401).json({error: "You need to log in first!"});
        }
        title = validation.checkTitle(title, 'Title');
        ingredients = validation.checkIngredients(ingredients);
        steps = validation.checkSteps(steps);
        skillLevel = validation.checkSkill(skillLevel);
        const newRecipe = await recipe.createRecipe(title, ingredients, skillLevel, steps, req.session.user);
        return res.json(newRecipe);
    }
    catch(e){
        console.log(e)
        return res.status(400).json({error: e});
    }
});

router.patch('/recipes/:id', async (req, res) => {
    let recipeInfo = req.body;
    let id = req.params.id;
    try{

        if (!req.session.user){
            return res.status(401).json({error: "You need to log in first!"});
        }

        if (!recipeInfo || Object.keys(recipeInfo).length === 0){
            throw 'There are no fields in the request body';
        }
        
        if (recipeInfo.reviews || recipeInfo.likes || recipeInfo.user){
            throw 'You cannot modify the reviews, likes or the admin of the recipe';
        }
        id = validation.checkId(id);
        const myRecipe = await recipe.getRecipe(id);
        if(myRecipe.user.username !== req.session.user.username || myRecipe.user._id !== req.session.user._id){
            throw "You did not create this recipe!"
        }

        if(recipeInfo.title){
            recipeInfo.title = validation.checkTitle(recipeInfo.title);
            if (recipeInfo.title === myRecipe.title){
                throw "The title cannot be the same!"
            }
        }

        if(recipeInfo.ingredients){
            recipeInfo.ingredients = validation.checkIngredients(recipeInfo.ingredients);
            let count = 0;
            for (let ingredient of recipeInfo.ingredients){
                if (myRecipe.ingredients.includes(ingredient)){
                    count++;
                }
            }
            if(count === myRecipe.ingredients.length){
                throw "The ingredients cannot be the same!"
            }
        }
        if(recipeInfo.skillLevel){
            recipeInfo.skillLevel = validation.checkSkill(recipeInfo.skillLevel);
            if (recipeInfo.skillLevel.toLowerCase() === myRecipe.skillLevel.toLowerCase()){
                throw "The skillLevel cannot be the same!"
            }
        }
        
        if(recipeInfo.steps){
            recipeInfo.steps = validation.checkSteps(recipeInfo.steps);
            let countStep = 0;
            for (let step of recipeInfo.steps){
                if (myRecipe.steps.includes(step)){
                    countStep++;
                }
            }
            if(countStep === myRecipe.steps.length){
                throw "The steps cannot be the same!"
            }
        }
        if (recipeInfo.ingredients || recipeInfo.steps || recipeInfo.title || recipeInfo.skillLevel){
            const newRecipe = await recipe.updateRecipe(id, recipeInfo);
            res.json(newRecipe);
        }
        else{
            throw "Invalid field entry"
        }
    }
    catch(e){
        console.log(e)
        if (e === "Error: This id does not exist" || e === "This recipe id does not exist"){
            return res.status(404).json({error: e});
        }
        return res.status(400).json({error: e});
        
    }
})

router.post('/recipes/:id/reviews', async (req, res) => {

    let rating = req.body.rating;
    let review = req.body.review;
    let id = req.params.id;
    try{
        
        if (!req.session.user){
            return res.status(401).json({error: "You need to log in first!"});
        }

        rating = validation.checkRating(rating);
        review = validation.checkReview(review);
        id = validation.checkId(id);
    }
    catch(e){
        return res.status(400).json({error: e});
    }
    try{
        const newRecipe = await recipe.createReview(id, rating, review, req.session.user); 
        res.json(newRecipe);
    }
    catch(e){
        if (!e.databaseError){
            return res.status(401).json({error: e.error});
        }
        return res.status(500).json({error: e.error});
    }
})

router.post('/recipes/:id/likes', async(req,res) => {

    let id = req.params.id;
    try{
        if (!req.session.user){
            return res.status(401).json({error: "You need to log in first!"});
        }
        id = validation.checkId(id);
    }
    catch(e){
        return res.status(400).json({error: e});
    }

    try{
        const newRecipe = await recipe.createLike(id, req.session.user);
        res.json(newRecipe);
    }
    catch(e){
        return res.status(500).json({error: e});
    }

})
router.delete('/recipes/:recipeId/:reviewId', async (req, res) => {
    console.log("here1")
    let recipeId = req.params.recipeId;
    let reviewId = req.params.reviewId;
    try{
        console.log("here2")
        if (!req.session.user){
            return res.status(401).json({error: "You need to log in first!"});
        }
        console.log("here3")
        recipeId = validation.checkId(recipeId);
        reviewId = validation.checkId(reviewId);
        console.log("here4")
    }
    catch(e){
        return res.status(400).json({error: e});
    }

    try{
        console.log("here5")
        const newRecipe = await recipe.deleteReview(reviewId, recipeId, req.session.user);
        console.log("here6")
        res.json(newRecipe);
    }
    catch(e){
        console.log(e)
        if (e.error === "Error: This id does not exist" || e.error === "This recipe id does not exist"){
            return res.status(404).json({error: e.error});
        }
        return res.status(401).json({error: e.error});
        
    }
})

router.get('/recipes', async(req, res) => {
    let page = req.query.page; 
    try{
        if (page){
            page = validation.checkPage(page);
        }
    }
    catch(e){
        return res.status(400).json({error: e});
    }
    
    const limit = 50; 
    let skip = 0;
    if (!page){
        page = 1;
    }
    let counter = 1;
    while(counter < page){
        skip = skip + limit;
        counter++;
    }
    let empty = false;
    try{
        
        const recipeList = await recipe.getRecipes(limit, skip);
        if (recipeList.length === 0){
            empty = true;
            throw "No more recipes!"
        }
        res.json(recipeList);
    }
    catch(e){
        if (empty){
            return res.status(404).json({error: e});
        }
        return res.status(500).json({error: e});
        
    }
})

router.get('/recipes/:id', async (req, res) => {
    let id = req.params.id;
    try{
        id = validation.checkId(id);
    }
    catch(e){
        return res.status(400).json({error: e});
    }
    try{
        const idRecipe = await recipe.getRecipe(id);
        return res.json(idRecipe);
    }
    catch(e){
        if (e.error === "Error: This id does not exist" || e.error === "This recipe id does not exist"){
            return res.status(404).json({error: e});
        }
        return res.status(500).json({error: e});
    }
})

router.get('/logout', async (req, res) => {
    //TODO: ADD CHECKS FOR IF THEY ARE LOGGED IN, OR NOT HERE BUT AFTER YOU ENSURE THE MIDDLEWARE WORKS!
    req.session.destroy();
    return res.json("Successfully logged out")
})



export default router;