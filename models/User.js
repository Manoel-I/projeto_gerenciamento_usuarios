const knex = require('knex');
const bcrypt = require('bcrypt');

class User{
    async new_user(name, email, password){
        try{
            await knex.insert({name, email, password}).table('users');
        }catch(error){
            console.log(error);
        }
    }
}

module.exports = new User();