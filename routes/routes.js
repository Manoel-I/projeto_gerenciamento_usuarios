let express = require("express")
let app = express();
let router = express.Router();
let HomeController = require("../controllers/HomeController");
let UserController = require("../controllers/UserController");
let AdminAuth = require('../middleware/AdminAuth');


router.get('/', HomeController.index);
router.post('/user', UserController.create); // como segue a extrutura rest, a rota só precisa ter um nome simples
router.get('/users', AdminAuth ,UserController.index); 
router.get('/user/:id', UserController.findById);
router.delete('/user',AdminAuth, UserController.delete);
router.put('/user', UserController.update); 
router.post('/recoverypassword', UserController.recovery_password);
router.post('/changepassword', UserController.changePassword);
router.post('/login', UserController.login);

module.exports = router;