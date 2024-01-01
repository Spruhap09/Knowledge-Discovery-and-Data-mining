export const isEmailValid = (email: string): boolean => {

    try{
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{1,50}$/;

        if (!email){
            throw "Email cannot be empty!"
        }

        if (email.length > 50){
            throw "Email too long!"
        }

        if (!(emailRegex.test(email))){
            throw "Invalid email!"
        }
        return true;
    }
    catch(error){
        throw error;
    }
    
}