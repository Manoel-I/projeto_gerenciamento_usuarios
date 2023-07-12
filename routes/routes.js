let express = require("express")
let app = express();
let router = express.Router();
let HomeController = require("../controllers/HomeController");
let UserController = require("../controllers/UserController");


router.get('/', HomeController.index);
router.post('/user', UserController.create); // como segue a extrutura rest, a rota só precisa ter um nome simples
module.exports = router;