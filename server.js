var express = require('express');
var mongoose = require ('mongoose');
var bodyparser = require ('body-parser');

var url = 'mongodb://localhost/el4';
mongoose.connect(url, function(error){
    if(error){
        console.log('Error during trying connect to database: '+error);
    }else{
        console.log('Database connect successfull');
    }
});

var UsuarioSchema = mongoose.Schema({
    nombre: String,
    apellido: String,
    email: String,
    clave: String
});

var Usuario = mongoose.model('usuarios',UsuarioSchema);

var server = express();
server.use(bodyparser.urlencoded({extended:false}));
server.use(bodyparser.json());

var router = express.Router();

router.route('/usuarios')
.post(function(req,res){
    var usuario = new Usuario({
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        email: req.body.email,
        clave: req.body.clave
    });
    usuario.save(function(error, result){
        if(error){
            res.status(500).json({
                success: false,
                mensaje: 'Error interno en el servidor'
            });
        }else{
            res.status(200).json({
                success: true,
                mensaje: 'Nuevo usuario registrado'
            });
        }
    });
});

router.route('/usuarios/login')
.post(function(req,res){
    var usuario = new Usuario({
        email: req.body.email,
        clave: req.body.clave
    });

    Usuario.findOne({email: usuario.email, clave: usuario.clave}, function(error, result){
        if(error){
            res.status(500).json({
                success: false,
                mensaje: 'Error interno en el servidor'
            });
        }else{
            if(result != null){
                res.status(200).json({
                    success: true,
                    usuario: result,
                });
            }else{
                res.status(500).json({
                    success: false,
                    mensaje: 'Credenciales incorrectas'
                });
            }
        }
    })
});

server.use('/api',router);
server.listen(3546, function(){
    console.log('Express server running on port '+3546);
});