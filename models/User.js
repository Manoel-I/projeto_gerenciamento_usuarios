const knex = require('../database/connection');
const bcrypt = require('bcrypt');

class User{

    async new_user(name, email, password){
        try{
            let hash = await bcrypt.hash(password.toString(), 10);
            await knex.insert({name, email, password: hash}).table('users');
        }catch(error){
            console.log(error);
        }
    }

    async find_email(email){
        try{
            let result;
            result = await knex.select().from('users').where({email : email});
            if(result.length > 0){
                return true;
            }else{
                return false;
            }
        }catch(error){
            console.log(error);
        }
    }
    
    async find_all(){
        try{
            let result = await knex.select(['id', 'name', 'role', 'email']).table('users');
            return result;
        }catch(error){
            console.log(error);
        }
    }

    
}

module.exports = new User();