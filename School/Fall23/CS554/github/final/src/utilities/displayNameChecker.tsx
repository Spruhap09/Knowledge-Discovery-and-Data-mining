export const isDisplayNameValid = (displayName: string): boolean => {

    try{
        const displayNameRegex = /^(?=.*[a-zA-Z])[a-zA-Z0-9_]{5,50}$/;

        if (!displayName){
            throw 'Display Name cannot be empty!'
        }

        if (displayName.length > 50){
            throw "Display Name too long!"
        }

        if (displayName.trim().length === 0){
            throw 'Display Name cannot be just spaces!'
        }

        if (!(displayNameRegex.test(displayName))){
            throw 'Display Name must contain one letter and may contain numbers and underscores and must be at least 5 characters long!'
        }
        return true;
    }
    catch(error){
        throw error;
    }
    
}