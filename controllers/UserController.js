let User = require("../models/User");
let PasswordToken = require('../models/PasswordToken');
let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');
let secret = "segredoSegredooooos123123123";

class UserController{
    async index(req, res){
        let response = await User.find_all();
        res.json(response);
    }

    async findById(req, res){
        let id = req.params.id;
        let user = await User.find_by_id(id);
        if(user == undefined || user.length < 1){
            res.status(404);
            res.json({message : "usuario não encontrado!"});
        }else{
            res.json(user);
        }
    }

    async create(req, res){
        console.log(req.body);
        let {name, email, password} = req.body;

        if(email == '' || email == undefined){
            res.status(400);
            res.json({ erro : "email é invalido"});
            return;
        }
        
        let email_exists = await User.find_email(email);
        if(email_exists){
            res.status(406);
            res.json({
                message : "email já existe"
            });
            return;
        }
        
        await User.new_user(name, email, password); //pelo codigo ser assincrono, se não colocar o await irá passar direto sem esperar terminar

        res.status(200);
        res.json({ message : "usuario criado com sucesso"});
    }

    async delete(req, res){
        let {email , password} = req.body;
        let response_validation = await User.delete(email, password);
        console.log(response_validation);
        switch(response_validation.status){
            case 200:
                res.status(200);
                res.json({message : 'usuario deletado com sucesso!'});
                break;
            case 400:
                res.status(400);
                res.json({message : "email ou senha incorreto(s)!"});
                break;
        }
    }

    async update(req, res){
        let {id, email, role, name} = req.body;
        let result = await User.update(id, email, name, role);
        res.status(result.status);
        res.json(result.message);
            
    }

    async recovery_password(req , res){
        let email = req.body.email;
        let result = await PasswordToken.create(email);
        res.status(result.status);
        res.json(result);
    }

    async changePassword(req, res){
        let token = req.body.token;
        let password = req.body.password;
        let isTokenValid = await PasswordToken.validate(token);
        console.log(isTokenValid);

        if(isTokenValid.status){
            await User.changePassword(password, isTokenValid.token.user_id);
            await PasswordToken.setUsedToken(token);
            res.status(200);
            res.json({message : 'senha alterada com sucesso'});
        }else{
            res.status(406);
            res.json({message : "token invalido"});
        }
    }

    async login(req, res){
        console.log("entrou aqui");
        let {password, email} = req.body;

        let user  = await User.find_by_email(email);
        console.log(user);
        if(user != undefined){
            let result = await bcrypt.compare(password.toString(), user[0].password);
            if(result){
                let token = jwt.sign({email : user[0].email, role : user[0].role}, secret);
                res.status(200);
                res.json({message : "login feito com sucesso", token : token});
            }else{
                res.status(406);
                res.json({message : "senha incorreta"});
            }
        }else{
            return {status : 400, message : "email incorreto"};
        }
    }


}


module.exports = new UserController(); 