let jwt = require('jsonwebtoken');
let secret  = "segredoSegredooooos123123123";

module.exports = function(req, res, next){
    const authToken = req.headers['authorization'];
    
    if(authToken != undefined){
        const bearer = authToken.split(' ');
        let token = bearer[1];

        try{
            let decoded = jwt.verify(token, secret);
            console.log(decoded);
            if(decoded.role == 1){
                next();
            }else{
                res.status(403);
                res.json({message : 'Você não tem permisão de administrador'});
                return;
            }
            
        }catch(error){
            res.status(403);
            res.json({message : 'Você não está autorizado'});
            return;
        }

    }else{
        res.status(403);
        res.json({message : 'Você não está autorizado'});
        return;
    }
}