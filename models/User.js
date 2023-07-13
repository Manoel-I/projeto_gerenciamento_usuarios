const knex = require('knex');
const bcrypt = require('bcrypt');

class User{
    async new_user(name, email, password){
        try{
            let hash = bcrypt.hash(password, 10);
            await knex.insert({name, email, password: hash}).table('users');
        }catch(error){
            console.log(error);
        }
    }

    async find_email(email){
        try{
            let result;
            await knex.select().table('users').where({email : email});
            if(result.length > 0){
                return true;
            }else{
                return false;
            }
        }catch(error){
            console.log(error);
        }
        
        
    }
}

module.exports = new User();