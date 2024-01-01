import {GraphQLError, parseValue} from 'graphql';
const validation = {
    checkUUID (uuid, varName) {
        if (!uuid){
            throw new GraphQLError(`Error: ${varName} must be provided!`, {
                extensions: {code: 'BAD_USER_INPUT'}
            });
        }
        if (typeof uuid !== 'string'){
            throw new GraphQLError(`Error: ${varName} must be a string!`, {
                extensions: {code: 'BAD_USER_INPUT'}
            });
        }

        uuid = uuid.trim();
        if (uuid.length === 0){
            throw new GraphQLError(`Error: ${varName} cannot be an empty string or string with just spaces`, {
                extensions: {code: 'BAD_USER_INPUT'}
            });
        }
        return uuid;
    }, 
    checkString (strVal, valName){

        if (!strVal){
            throw new GraphQLError(`Error: ${valName} must be provided!`, {
                extensions: {code: 'BAD_USER_INPUT'}
            });
        }

        if (typeof strVal !== 'string'){
            throw new GraphQLError(`Error: ${valName} must be a string!`, {
                extensions: {code: 'BAD_USER_INPUT'}
            });
        }

        strVal = strVal.trim();
        if (strVal.length === 0){
            throw new GraphQLError(`Error: ${valName} cannot be an empty string or string with just spaces`, {
                extensions: {code: 'BAD_USER_INPUT'}
            });
        }
        return strVal;
    }, 
    checkName (strVal, valName){

        if (!strVal){
            throw new GraphQLError(`Error: ${valName} must be provided!`, {
                extensions: {code: 'BAD_USER_INPUT'}
            });
        }

        if (typeof strVal !== 'string'){
            throw new GraphQLError(`Error: ${valName} must be a string!`, {
                extensions: {code: 'BAD_USER_INPUT'}
            });
        }
        strVal = strVal.trim();
        if (strVal.length === 0){
            throw new GraphQLError(`Error: ${valName} cannot be an empty string or string with just spaces`, {
                extensions: {code: 'BAD_USER_INPUT'}
            });
        }
        if (!(/^[A-Za-z\s]+$/).test(strVal)){
            throw new GraphQLError(`Error: ${valName} must only contain letters A-Z case insensitive`, {
                extensions: {code: 'BAD_USER_INPUT'}
            });
        }
        return strVal;
    },
    checkState(state){
        if (!state){
            throw new GraphQLError(`Error: a state must be provided!`, {
                extensions: {code: 'BAD_USER_INPUT'}
            });
        }
        if (typeof state !== 'string') {
            throw new GraphQLError(`Error: state must be a string!`, {
                extensions: {code: 'BAD_USER_INPUT'}
            });
        }
        if (state.length !== 2){
            throw new GraphQLError(`Error: state must only have two letters!`, {
                extensions: {code: 'BAD_USER_INPUT'}
            });
        }
        const states = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA',
        'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN',
        'MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK',
        'OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY']

        if (!states.includes(state.toUpperCase())){
            throw new GraphQLError(`Error: the state should be a valid us state!`, {
                extensions: {code: 'BAD_USER_INPUT'}
            });
        }

        return state;
    }, 
    checkDate(date){
        if (!date){
            throw new GraphQLError(`Error: date must be provided!`, {
                extensions: {code: 'BAD_USER_INPUT'}
            });
        }

        if (typeof date !== 'string') {
            throw new GraphQLError(`Error: date must be a string!`, {
                extensions: {code: 'BAD_USER_INPUT'}
            });
        }

        date = date.trim();

        if (date.length === 0){
            throw new GraphQLError(`Error: date cannot be an empty string or string with just spaces`, {
                extensions: {code: 'BAD_USER_INPUT'}
            });
        }
        // if ((isNaN(new Date(date)))){
        //     throw new GraphQLError(`Error: invalid date input`, {
        //         extensions: {code: 'BAD_USER_INPUT'}
        //     });
        // }
        if (!(/^(0?[1-9]|1[0-2])\/(0?[1-9]|[12]\d|3[01])\/\d{4}$/).test(date)){
            throw new GraphQLError(`Error: Invalid date format`, {
                extensions: {code: 'BAD_USER_INPUT'}
            });
        }
        
        const newDate = date.split('/');
        let month = parseInt(newDate[0]);
        let day = parseInt(newDate[1]);
        let year = parseInt(newDate[2]);

        let newDatedate = new Date (year, month-1, day);
        if (newDatedate.getFullYear() !== year || newDatedate.getMonth() !== month-1 || newDatedate.getDate() !== day){
            throw new GraphQLError(`Error: invalid date`, {
                extensions: {code: 'BAD_USER_INPUT'}
            });
        }
        return date;
    },
    checkIsbn(isbn){

        let newIsbn = isbn;
        isbn = isbn.trim().replace(/[-\s]/g, '');
        if (isbn.length !== 10 && isbn.length !== 13){
            throw new GraphQLError(`Error: invalid isbn`, {
                extensions: {code: 'BAD_USER_INPUT'}
            });
        }

        if (isbn.length === 10){
            if (isbn[9].toUpperCase() === 'X'){
                isbn = isbn.slice(0,9) + '10'
            }

            let sum = 0;
            for (let i=0; i<=9; i++){
                let digit = parseInt(isbn[i], 10);
                if (isNaN(digit)){
                    throw new GraphQLError(`Error: invalid isbn`, {
                        extensions: {code: 'BAD_USER_INPUT'}
                    })
                }
                sum = sum + digit * (10-i);
            }
            if (sum % 11 !== 0){
                throw new GraphQLError(`Error: invalid isbn`, {
                    extensions: {code: 'BAD_USER_INPUT'}
                })
            }
        }
        else if (isbn.length === 13){
            let digit = parseInt(isbn[12], 10);
            if (isNaN(digit)){
                throw new GraphQLError(`Error: invalid isbn`, {
                    extensions: {code: 'BAD_USER_INPUT'}
                })
            }
            let sum = 0;
            for (let i=0; i<= 11; i++){
                let digit = parseInt(isbn[i]);
                if (isNaN(digit)){
                    throw new GraphQLError(`Error: invalid isbn`, {
                        extensions: {code: 'BAD_USER_INPUT'}
                    })
                }
                sum += i % 2 === 0 ? digit : digit * 3;
            }

            if ((sum + digit)%10 !== 0){
                throw new GraphQLError(`Error: invalid isbn`, {
                    extensions: {code: 'BAD_USER_INPUT'}
                })
            }
        }
        return newIsbn;
    }
    // checkIsbn(isbn){

    //     if (!isbn){
    //         throw new GraphQLError(`Error: you need to provide an isbn`, {
    //             extensions: {code: 'BAD_USER_INPUT'}
    //         });
    //     }

    //     if (typeof isbn !== 'string') {
    //         throw new GraphQLError(`Error: isbn must be a string!`, {
    //             extensions: {code: 'BAD_USER_INPUT'}
    //         });
    //     }
    //     let finIsbn = isbn;
    //     isbn = isbn.replace(/[^0-9X]/g, '');
    //     if (isbn.length !== 10 || isbn.length !== 13){
    //         throw new GraphQLError(`Error: you need to provide a valid isbn`, {
    //             extensions: {code: 'BAD_USER_INPUT'}
    //         });
    //     }
    //     let isIsbn = false;

    //     if (isbn.length === 10){

    //         //let weight = 10;
    //         let sum = 0;

    //         for (let i = 0; i < 9; i++) {
    //             sum = sum + (10 - i) * parseInt(isbn[i]);
    //         }
    //         //const checksum = sum % 11;
    //         let checksum = (11 - (sum % 11)) % 11;

    //         if (checksum === 10){
    //             checksum = 'X'
    //         }
    //         else{
    //             checksum = checksum.toString()
    //         }


    //         // let lastDigit = undefined;
    //         // if (isbn[9].toUpperCase() === 'X'){
    //         //     lastDigit = 10;
    //         // }
    //         // else{
    //         //     lastDigit = parseInt(isbn[9]);
    //         // }
    //         isIsbn = (checksum === isbn[isbn.length - 1].toUpperCase());
    //     }

    //     if (isbn.length === 13){
    //         let sum = 0;
    //         for (let i = 0; i <= 11; i++) {
    //             let digit = parseInt(isbn[i]);
    //             if (i%2 === 0){
    //                 sum = sum + digit;
    //             }
    //             else{
    //                 sum = sum + 3*digit;
    //             }
    //         }
    //         //const checksum = 10 - (sum % 10);
    //         let checksum = (10 - (sum % 10)) % 10;

    //         const lastDigit = parseInt(isbn[12]);
    //         isIsbn = (checksum === isbn[isbn.length-1]);
    //     }

    //     if (!isIsbn){
    //         throw new GraphQLError(`Error: you need to provide a valid isbn`, {
    //             extensions: {code: 'BAD_USER_INPUT'}
    //         });
    //     }
    //     return finIsbn;
    // }
    // checkIsbn(isbn){
    //     if (!isbn){
    //         throw new GraphQLError(`Error: you need to provide an isbn`, {
    //             extensions: {code: 'BAD_USER_INPUT'}
    //         });
    //     }

    //     if (typeof isbn !== 'string') {
    //         throw new GraphQLError(`Error: isbn must be a string!`, {
    //             extensions: {code: 'BAD_USER_INPUT'}
    //         });
    //     }
    //     if (!(/^(?:\d{9}[\dXx]|\d{13})$/).test(isbn)){
    //         throw new GraphQLError(`Error: not a valid isbn`, {
    //             extensions: {code: 'BAD_USER_INPUT'}
    //         });
    //     }
    //     return isbn;
    // }
}
export default validation;