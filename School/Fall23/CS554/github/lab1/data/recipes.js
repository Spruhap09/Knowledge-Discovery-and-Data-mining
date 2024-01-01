//const mongoCollections = require('../config/mongoCollections.js');
//import mongoCollections from '../config/mongoCollections.js';
//onst recipes = mongoCollections.recipes;
import {recipes} from '../config/mongoCollections.js';
// const {ObjectId} = require('mongodb');
// const bcrypt = require('bcryptjs');
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs'
import validation from '../validation.js'
const saltRounds = 8;

const module = {
    
    async createRecipe(title, ingredients, skillLevel, steps, user){
        //TODO: WDYM that the data must make sense for the data you are storing in terms of the title?

        try{
            title = validation.checkTitle(title, 'title'); 
            ingredients = validation.checkIngredients(ingredients);
            steps = validation.checkSteps(steps);
            skillLevel = validation.checkSkill(skillLevel);
            const recipe = {
                title: title, 
                ingredients: ingredients,
                skillLevel: skillLevel,
                steps: steps,
                user: user, 
                reviews: [], 
                likes: []
            }
            const recipeCollection = await recipes();
            const id = await recipeCollection.insertOne(recipe);
            if (!id.insertedId) throw 'Insert failed!';
            return {
                _id: id.insertedId, 
                title: title, 
                ingredients: ingredients, 
                skillLevel: skillLevel, 
                steps: steps, 
                user: user, 
                reviews: [], 
                likes: []
            };
        }
        catch(e){
            throw e;
        }
    },
    async getRecipe (id){
        let found = true;
        try{
           
            id = validation.checkId(id);
            const recipeCollection = await recipes();
            const myRecipe = await recipeCollection.findOne({_id: new ObjectId(id)});
            if (!myRecipe){
                found = false;
                throw "Error: This id does not exist"
            }
            return myRecipe;
        }
        catch(e){
            throw{
                error: e
            }
        }
    },
    async updateRecipe (id, recipeInfo){
        
        try{
            id = validation.checkId(id);
           
            if(recipeInfo.title){
                recipeInfo.title = validation.checkTitle(recipeInfo.title);
            }
            if(recipeInfo.ingredients){
                recipeInfo.ingredients = validation.checkIngredients(recipeInfo.ingredients);
            }
            if(recipeInfo.skillLevel){
                recipeInfo.skillLevel = validation.checkSkill(recipeInfo.skillLevel);
            }
            if(recipeInfo.steps){
                recipeInfo.steps = validation.checkSteps(recipeInfo.steps);
            }

            const recipeCollection = await recipes();
            const newRecipe = await recipeCollection.findOneAndUpdate(
                {_id: new ObjectId(id)},
                {$set: recipeInfo},
                {returnDocument: 'after'}
              );
            //const newRecipe = await recipeCollection.updateOne({_id: ObjectId(id)}, {$set:{ title: title, ingredients: ingredients, skillLevel: skilllevel, steps: steps}});
            if (!newRecipe) { throw "Failed to update the recipe" };
            return newRecipe;
        }
        catch(e){
            throw {error: e};
        }
    },
    async createReview(id, rating, review, user){
        let databaseError = false;
        try{
            id = validation.checkId(id);
            
            rating = validation.checkRating(rating);
            
            review = validation.checkReview(review);
            
            const oldRecipe = await this.getRecipe(id); 
            
            for (let oldReview of oldRecipe.reviews){
                if (user._id === oldReview.user._id && user.username === oldReview.user.username){
                    throw "Error: You already have reviewed this recipe. If you wish to update your review delete your old review first"
                }
            }
            const recipeCollection = await recipes();
            const newReviews = [...oldRecipe.reviews];
            
            const newReview = {
                _id: new ObjectId(),
                user: user,
                rating: rating,
                review: review
            }
            newReviews.push(newReview);
            const updatedReviews = {
                reviews: newReviews
            }
            const newRecipe = await recipeCollection.findOneAndUpdate(
                {_id: new ObjectId(id)},
                {$set: updatedReviews},
                {returnDocument: 'after'}
            );

            if (!newRecipe) {
                databaseError = true;
                throw "Failed to update the recipe" 
            };
            return newRecipe;
        }
        catch(e){
            throw {error: e, databaseError: databaseError};
        }
    }, 
    
    async deleteReview(reviewId, recipeId, user){
        let found = false;
        try{
            reviewId = validation.checkId(reviewId);
            recipeId = validation.checkId(recipeId);
            const oldRecipe = await this.getRecipe(recipeId); 
            
            const oldReviews = [...oldRecipe.reviews];
            for (let review of oldReviews){
                
                if (reviewId === review._id.toString()){
                    found = true;
                    if (user._id !== review.user._id || user.username !== review.user.username){
                        throw {error: "You cannot edit this review because you did not create it"}
                    }
                }
            }
            if (!found){
                throw {error: "This recipe id does not exist"}
            }
            
            const newReview = oldReviews.filter(function (rev) {
                return rev._id.toString() !== reviewId;
            }); 
            
            const updatedReviews = {
                reviews: newReview
            }
            const recipeCollection = await recipes();
            const newRecipe = await recipeCollection.findOneAndUpdate(
                {_id: new ObjectId(recipeId)},
                {$set: updatedReviews},
                {returnDocument: 'after'}
            );
            if (!newRecipe) throw {error: "Failed to update the recipe" };
            return newRecipe;
        }
        catch(e){
            throw e;
        }
    }, 

    async createLike(id, user){
        try{
            id = validation.checkId(id);
            const oldRecipe = await this.getRecipe(id); 

            let oldLikes = [...oldRecipe.likes];

            if (oldLikes.includes(user._id)){
                
                oldLikes = oldLikes.filter(function (userId) {
                    return userId !== user._id;
                })
            }
            else{
                oldLikes.push(user._id);
            }
            
            const updatedLikes = {
                likes: oldLikes
            }
            const recipeCollection = await recipes();
            const newRecipe = await recipeCollection.findOneAndUpdate(
                {_id: new ObjectId(id)},
                {$set: updatedLikes},
                {returnDocument: 'after'}
            );
            if (!newRecipe) { throw "Failed to update the recipe" };
            return newRecipe;
        }
        catch(e){
            throw e;
        }
    }, 

    async getRecipes (limit, skip){
        try{
            const recipeCollection = await recipes();
            const recipeList = await recipeCollection.find({}).skip(skip).limit(limit).toArray();
            return recipeList;
        }
        catch(e){
            throw e;
        }
        
    }
}


export default module;