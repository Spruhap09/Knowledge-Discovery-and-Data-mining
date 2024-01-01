export const isPasswordValid = (password: string, passwordConfirmation: string): boolean => {

    try{

        if (!passwordConfirmation){
            throw 'Password cannot be empty!'
          }
    
        if (passwordConfirmation.trim().length === 0){
            throw 'Password cannot be be just spaces!'
        }
      
        if (passwordConfirmation.length > 60){
            throw "Password too long!"
        }
    
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^_#()-])[A-Za-z\d@$!%*?&^_#()-]{8,60}$/;
          
        if (!(passwordRegex.test(passwordConfirmation))){
            throw "Password must contain one uppercase letter, one lowercase letter, one digit and a special character and must be at least 8 characters long!"
        }
    
        return true;
    }
    catch(error){
        throw error;
    }
    
}