//TODO: CHECK FOR THE MIX RANGE OF CHARACTERS
import {ObjectId} from 'mongodb';
const val = {
    checkPage(page){
        if ((/^[A-Za-z`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]*$/.test(page))){
            throw "Error: Page number must be a number";
        }
        page = +page;
        if (typeof page !== 'number'){
            throw "Error: Page number must be a number"
        }
        if(isNaN(page)){
            throw "Error: Page number must be a number"
        }
        if (!Number.isInteger(page)){
            throw "Error: Page number must be a whole number"
        }
        if(page < 1){
            throw "Error: Page number must be greater than 0"
        }
        return page;
    },
    checkRating(rating){
        if (!rating){
            throw "Error: You must provide a rating"
        }
        if (typeof rating !== 'number'){
            throw "Error: Rating must be a number"
        }
        if (!Number.isInteger(rating)){
            throw "Error: Rating must be a whole number"
        }
        if(rating < 1 || rating > 5){
            throw "Error: Rating must be between 1-5"
        }
        return rating;
    },
    checkReview(review){
        if(!review){
            throw "Error: Review must be provided"
        }
        if(typeof review !== 'string'){
            throw "Error: Review must be a string"
        }
        review = review.trim();
        if (review.length === 0){
            throw "Error: Review must not be an empty string"
        }
        if (!(/^[A-Za-z0-9!',#<>=+-|\s]*$/.test(review))){
            throw "Error: Review can only contain space, alphanumeric character or !',#<>=+-|";
        }
        if(review.length < 25){
            throw "Error: Review must be at least 25 characters long!"
        }
        return review;

    },
    checkTitle(strVal, valName){
        if (!strVal) throw `Error: You must supply a ${valName}!`;
        if (typeof strVal !== 'string') throw `Error: ${valName} must be a string!`;
        strVal = strVal.trim();
        if (strVal.length === 0){
            throw `Error: ${valName} cannot be an empty string or string with just spaces`;
        }
        if (!(/^[A-Za-z0-9!\s]*$/.test(strVal))){
            throw `Error: ${valName} can only contain alphanumeric or ! characters`;
        }
        if (strVal.length < 5){
            throw `Error: The ${valName} is less than five characters`
        }
        return strVal;
    },
    checkSkill(skilllevel){

        if (!skilllevel){
            throw "Need to provide a skill level"
        }
        if (skilllevel.toLowerCase() !== 'novice' && skilllevel.toLowerCase() !== 'intermediate' && skilllevel.toLowerCase() !== 'advanced'){

            throw "Invalid skill level"
        }
        
        return skilllevel;
    },
    checkId(id){
        if (!id){
            throw "Error: You must provide an id"
        }
        if (typeof id !== 'string'){
            throw "Error: id must be a string"
        }
        id = id.trim();
        if (id.length === 0){
            throw "Error: id cannot be an empty string or just spaces";
        }
        if (!ObjectId.isValid(id)) throw "Error: id is invalid object ID";
        return id;
    },
    checkSteps(steps){
        if(!steps){
            throw "You must provide steps for the recipe!"
        }
        if (steps.length < 5){
            throw "Need more steps for the recipe!"
        }
        for (let step of steps){
            if (!step) throw "Error: You must supply a step!";
            if (typeof step !== 'string') throw "Error: step must be a string!";
            step = step.trim();
            if (step.length === 0){
                throw "Error: step cannot be an empty string or string with just spaces";
            }
            if (!(/^[A-Za-z0-9!,'#\s]*$/.test(step))){
                throw "Error: step can only contain alphanumeric and other certain characters";
            }
            if (step.length < 20){
                throw "Error: This step should have at least 20 characters!"
            }
        }
        return steps;
    },
    checkIngredients(ingredients){
        
        if(!ingredients){
            throw "You must supply ingredients for the recipe!"
        }
        if (ingredients.length < 4){
            throw "Need more ingredients for the recipe!"
        }
        for (let ingredient of ingredients){
            if (!ingredient) throw "Error: You must supply an ingredient!";

            if (typeof ingredient !== 'string') {
                throw "Error: ingredient must be a string!";
            }
            ingredient = ingredient.trim();
            if (ingredient.length === 0){
                throw "Error: ingredient cannot be an empty string or string with just spaces";
            }
            if (ingredient.length < 4 || ingredient.length > 50){
                throw "The ingredient does not meet the required length parameters";
            }
            if (!(/^[A-Za-z0-9\s]*$/.test(ingredient))){
                throw `Error: ingredient can only contain alphanumeric characters`;
            }
        }
        return ingredients;
    },
    checkString(strVal, valName){
        if (!strVal) throw `Error: You must supply a ${valName}!`;
        if (typeof strVal !== 'string') throw `Error: ${valName} must be a string!`;
        strVal = strVal.trim();
        if (strVal.length === 0){
            throw `Error: ${valName} cannot be an empty string or string with just spaces`;
        }
        if (!(/^[A-Za-z0-9]*$/.test(strVal))){
            throw `Error: ${valName} can only contain alphanumeric characters`;
        }
        return strVal;
    },
    checkName(strVal, valName){
        if (!strVal) throw `Error: You must supply a ${valName}!`;
        if (typeof strVal !== 'string') throw `Error: ${valName} must be a string!`;

        strVal = strVal.trim();

        if (strVal.length === 0){
            throw `Error: ${valName} cannot be an empty string or string with just spaces`;
        }

        if (!(/^[A-Za-z-'\s]*$/.test(strVal))){
            throw `Error: ${valName} can only contain letters, hyphens and apostrophes characters`;
        }

        return strVal;
    },

    checkUsername(strVal, valName){
        if (!strVal) throw `Error: You must supply a ${valName}!`;
        if (typeof strVal !== 'string') throw `Error: ${valName} must be a string!`;
        strVal = strVal.trim();
        if (strVal.length === 0){
            throw `Error: ${valName} cannot be an empty string or string with just spaces`;
        }
        if (!(/^[A-Za-z0-9]*$/.test(strVal))){
            throw `Error: ${valName} can only contain alphanumeric characters`;
        }
        if (strVal.length < 5){
            throw `Error: ${valName} should be at least 5 characters long`;
        }
        strVal = strVal.toLowerCase();

        return strVal;
    }, 

    checkPassword (strVal, valName){
        let lower = false;
        let upper = false;
        let special = false; 
        let number = false;
        if (!strVal) throw `Error: You must supply a ${valName}!`;
        if (typeof strVal !== 'string') throw `Error: ${valName} must be a string!`;
        strVal = strVal.trim();
        if (strVal.length === 0){
            throw `Error: ${valName} cannot be an empty string or string with just spaces`;
        }

        if (!(/^[A-Za-z0-9`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]*$/.test(strVal))){
            throw "Error: Password can only contain alphanumeric characters";
        }
        for (let char of strVal){
            if (char === ' '){
                throw `Error: ${valName} cannot contain spaces in between`;
            }
            if (/^[A-Z]+$/.test(char)) {
                upper = true;
            }
            if (/^[a-z]+$/.test(char)) {
                lower = true;
            }
            if (/^\d$/.test(char)){
                number = true;
            }
            if (/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(char)){
                special = true;
            }
        }
        if (!upper){
            throw `Error: ${valName} must contain an uppercase letter`;
        }
        if (!lower){
            throw `Error: ${valName} must contain a lowercase letter`;
        }
        if (!special){
            throw `Error: ${valName} must contain a special character`;
        }
        if (!number){
            throw `Error: ${valName} must contain a number`;
        }

        if (strVal.length < 8){
            throw `Error: ${valName} should be at least 8 characters long`;
        }
        return strVal;
    }
}

export default val;