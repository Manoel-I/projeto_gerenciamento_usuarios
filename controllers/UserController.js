let User = require("../models/User");

class UserController{
    async index(req, res){
        let response = await User.find_all();
        res.json(response);
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

        console.log("password ---->", password);
        await User.new_user(name, email, password); //pelo codigo ser assincrono, se não colocar o await irá passar direto sem esperar terminar

        res.status(200);
        res.json({ message : "usuario criado com sucesso"});
    }


}


module.exports = new UserController(); 