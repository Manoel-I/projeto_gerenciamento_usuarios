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

    async find_by_id(id){
        try{
            let result = await knex.select(['id', 'name', 'role', 'email']).table('users').where({id : id});
            return result;
        }catch(error){
            console.log(error);
        }
    }

    async find_by_email(email){
        try{
            let result = await knex.select(['id', 'name', 'role', 'email']).table('users').where({email : email});
            return result;
        }catch(error){
            console.log(error);
        }
    }
    
    async delete(email, password){
        let hash;
        let password_validation;
        try{
            hash = await knex.select(["password"]).from('users').where({email : email});  
            if(hash.length < 1){
                return {status : 400};
            }  
            password_validation = await bcrypt.compare(password.toString(), hash[0].password);
            if(!password_validation){
                return {status : 400};
            }
        }catch(error){
            console.log(error);
        }

        try{
            let response = await knex.from('users').where({email : email}).del();
            if(response >= 1 ){
                return {status : 200};
            }
        }catch(error){
            console.log(error);
        }
    }

    async update(id, email, name, role){
        let user = await this.find_by_id(id);

        if(user != undefined){
            let editUser = {};
            if(email != undefined){

                if(email != user.email){ 
                    let result_email = await this.find_email(email);

                    if(!result_email){
                        editUser.email = email;
                        
                    }else{
                        return {message : "email já cadastrado!", status : 400};
                    }
                }
            }
            
            if(name != undefined){
                editUser.name = name;
            }

            if(role != undefined){
                editUser.role = role;
            }
            
            try {
                await knex.update(editUser).where({id : id}).table('users');
                return {message : "Usuario editado com sucesso!", status : 200} 
            } catch (error) {
                console.log(error);
                return {message : "erro" ,status : 404, error : error};
            }
        }else{
            return {message : "ID não encontrado", status : 400};
            
        }
    }

    async changePassword(newPassword, id ,token){
        let hash = await bcrypt.hash(newPassword.toString(), 10);
        await knex.update({password : hash}).where({id : id}).table('users');
    }
}

module.exports = new User();