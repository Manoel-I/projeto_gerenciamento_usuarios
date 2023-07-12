let User = require("../models/User");

class UserController{
    async index(req, res);

    async create(req, res){
        console.log(req.body);
        let {name, email, password} = req.body;

        if(email == '' || email == undefined){
            res.status(400);
            res.json({ erro : "email é invalido"});
            return;
        }

        await User.new_user(name, email, password); //pelo codigo ser assincrono, se não colocar o await irá passar direto sem esperar terminar

        res.status(200);
        res.json({ message : "usuario criado com sucesso"});
    }


}


module.exports = new UserController(); 