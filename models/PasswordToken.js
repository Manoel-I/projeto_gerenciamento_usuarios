const knex = require('../database/connection');
const User = require('./User');
const { v4: uuidv4 } = require('uuid');

class PasswordToken{

    async create(email){
        let user = await User.find_by_email(email);

        if(user != undefined){
           let token = uuidv4();
           console.log(user[0].id);
           console.log(token);
           try{
                await knex.insert({
                    user_id : user[0].id,
                    used : 0,
                    token : token 
                }).table('password_tokens');
                return {status : 200, message : 'token criado com sucesso', token : token};
           }catch(error){
            return {error : error, status : 500 };
           }
        }else{
            return {status : 404 , message : "email não encontrado"};
        }
    }

    async validate(token){
        try{
            let result = await knex.select().where({token : token}).table('password_tokens');
            
            if(result.length < 0 ){
                let tk = result[0];

                if(tk.used){
                    return {status : false};
                }else{
                    return {status : true, token : tk};
                }
            }else{
                return {status : false};
            }
        }catch(error){
            console.log(error);
            return {status : false};
        }
    }
}

module.exports = new PasswordToken();