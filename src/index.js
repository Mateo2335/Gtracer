// Imports
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');
const passport = require('passport');
require('./lib/passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const MySQLStore = require('express-mysql-session');
const { database } = require('./keys');
const flash = require('connect-flash')
const fileUpload = require('express-fileupload')
const pool = require('./database');

// Initialitzations
const app = express();


// Settings
app.set('port', process.env.PORT || 4000);
let corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Access-Control-Allow-Origin', 'Access-Control-Request-Headers'],
    exposedHeaders: ['Content-Type', 'Access-Control-Allow-Origin', 'Access-Control-Request-Headers']
}

// Middlewares

app.use(express.json());
app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(session({
    secret: 'keyboardcat',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(flash());
app.use(fileUpload())


// Globar Variables

/*app.use((req, res, next) => {
    app.locals.user = req.user;
    console.log
    next();
})*/

// Routes
app.use(require('./routes'))

app.post('/login',
    passport.authenticate('local.signin'),
    function(req, res) {
        res.json({message: "Success"})
    })

app.post('/register/',
passport.authenticate('local.signup'),
function(req, res) {
    res.json({message: "Success"})
}
)

app.get('/username',
function(req, res) {
    res.json({ username: req.user.nomUser })
    console.log(req.user.nomUser)
}
)

app.get('/getprofilepic',
function(req, res) {
    if (req.user) {
        pool.query('SELECT image.rutaImatge FROM image WHERE image.idImage = ?', [req.user.profileImg], (erro, respo) => {
            if (erro){
                console.log(erro)
            } else{
                res.json({ data: respo[0].rutaImatge, userId: req.user.idUser })
                console.log('Imatge de lusuari enviat')
            }
        }) 
    }
}
)

app.post('/uploadpostimage', (req, res)=>{
    if (req.files === null){
        return res.status(400).json({ msg: 'No file uploaded '})
    }
    const file = req.files.file;

    let newName = path.parse(file.name).name
    let extencion = String(Math.random()) + path.parse(file.name).ext 
    file.mv(`C:/Users/Matthew/Desktop/Proyectos/AnotherProject/project2/public/media/pictures/${newName}` + extencion, err=>{
        if(err){
            console.log(err);
            return res.status(500).send(err)
        }
        res.json(`../media/pictures/${newName}` + extencion)
    })
})

app.post('/postimage', async (req, res)=>{

    let userId
    let imageId

    if (req.user){

        userId = req.user.idUser

        const { rutaImatge, titolPost } = req.body

        console.log( rutaImatge, titolPost)

        await pool.query('UPDATE image SET (rutaImatge) VALUES (?)', [rutaImatge], (err, resp) =>{
            if (err) {
                console.log(err)
            } else{
                console.log('Ruta de la imatge inserida')
                imageId = resp.insertId

                pool.query('INSERT INTO post(titolPost, idUser, idImage) VALUES (?, ?, ?)', [titolPost, parseInt(userId), imageId ], (erro, respo) => {
                    if (err){
                        console.log(erro)
                    } else{
                        console.log('Post inserit a la bdd')
                    }
                }) 
            }
        })

        return res.json({msg: "Posted!"})

    } else {
        return res.json({msg: "No user was logged"})
    }
})

app.post('/postimageuser', async (req, res)=>{

    let userId
    let imageId

    if (req.user){

        userId = req.user.idUser

        const { rutaImatge } = req.body

        console.log( req.user )

        await pool.query('INSERT INTO image(rutaImatge) VALUES (?)', [rutaImatge], (err, resp) =>{
            if (err) {
                console.log(err)
            } else{
                console.log('Ruta de la imatge inserida')
                imageId = resp.insertId

                pool.query('UPDATE dades_user SET dades_user.profileImg = ? WHERE dades_user.emailUser = ?', [imageId, req.user.emailUser], (erro, respo) => {
                    if (err){
                        console.log(erro)
                    } else{
                        console.log('Imatge del usuari inserida a la bdd')
                    }
                }) 
            }
        })

        return res.json({msg: "Posted!"})

    } else {
        return res.json({msg: "No user was logged"})
    }
})

app.get('/logout',
function(req, res) {
    req.logOut();
    req.session.destroy(function (err) {
        if (!err) {
            res.status(200).clearCookie('connect.sid', {path: '/'}).json({status: "Success"});
        } else {
            res.json(err)
        }

    });
}
)

app.get('/getpostdata', async (req, res)=>{
    await pool.query('SELECT post.idPost AS postId, post.titolPost, post.idImage AS imageId, post.idUser AS userId, ( SELECT image.rutaImatge FROM image WHERE image.idImage = imageId ) AS rutaImatge, ( SELECT dades_user.nomUser FROM dades_user WHERE dades_user.emailUser = ( SELECT usuari.emailUser FROM usuari WHERE usuari.idUser = userId ) ) AS userName, ( SELECT image.rutaImatge FROM image WHERE image.idImage = ( SELECT dades_user.profileImg FROM dades_user WHERE dades_user.emailUser = ( SELECT usuari.emailUser FROM usuari WHERE usuari.idUser = userID) ) ) AS rutaImatgeUsuari, ( SELECT COUNT(comentari.idComment) FROM comentari WHERE comentari.idPost = postId ) AS numComment FROM post ORDER BY idPost DESC', (erro, respo)=>{
        if (erro){
            console.log(erro)
        } else{
            res.json(respo)
        }
    })
})

app.post('/getpostplusdata', async (req, res)=>{
    await pool.query('SELECT post.titolPost, post.idUser AS userId, (SELECT dades_user.nomUser FROM dades_user WHERE dades_user.emailUser = (SELECT usuari.emailUser FROM usuari WHERE usuari.idUser = userId) ) AS nomUser, (SELECT COUNT(megusta.idLike) FROM megusta WHERE megusta.idPost = ? ) AS numLikes, (SELECT COUNT(repost.idRepost) FROM repost WHERE repost.idPost = ?) AS numRepost, (SELECT COUNT(comentari.idComment) FROM comentari WHERE comentari.idPost = ?) AS numComentaris, (SELECT image.rutaImatge FROM image WHERE image.idImage = (SELECT dades_user.profileImg FROM dades_user WHERE dades_user.emailUser = (SELECT usuari.emailUser FROM usuari WHERE usuari.idUser = userId))) AS rutaPostPicUser, (SELECT image.rutaImatge FROM image WHERE idImage = (SELECT post.idImage FROM post WHERE post.idPost = ?)) AS mainPostPic FROM post WHERE post.idPost = ?', [req.body.postId, req.body.postId, req.body.postId, req.body.postId, req.body.postId] , (erro, respo)=>{
        if (erro){
            console.log(erro)
        } else{
            res.json(respo)
        }
    })
})

app.post('/getpostpluscomments', async (req, res)=>{
    await pool.query('SELECT comentari.idComment AS commentId, comentari.textComment, comentari.idUser as userId, (SELECT dades_user.nomUser FROM dades_user WHERE dades_user.emailUser = (SELECT usuari.emailUser FROM usuari WHERE usuari.idUser = userId)) AS nomUsuari, (SELECT image.rutaImatge FROM image WHERE image.idImage = (SELECT dades_user.profileImg FROM dades_user WHERE dades_user.emailUser = (SELECT usuari.emailUser FROM usuari WHERE usuari.idUser = userId))) AS profileCommentPic FROM comentari WHERE comentari.idPost = ?', [req.body.postId] , (erro, respo)=>{
        if (erro){
            console.log(erro)
        } else{
            res.json(respo)
            console.log(respo)
            console.log(req.body.postId)
        }
    })
})

app.post('/sendcomment', async (req, res)=>{

    let userId
    let imageId

    if (req.body.comment == '' || ""){
        return res.json({msg: 'text buit'})
    }

    if (req.user){

        userId = req.user.idUser

        console.log( req.user )

        await pool.query('INSERT INTO comentari(textComment, idPost, idUser) VALUES (?, ?, ?)', [req.body.comment, req.body.postId, userId], (err, resp) =>{
            if (err) {
                console.log(err)
            } else{
                console.log('Comentari inserit')
                imageId = resp.insertId
            }
        })

        return res.json({msg: "Posted!"})

    } else {
        return res.json({msg: "No user was logged"})
    }
})

app.post('/getprofiledata', async (req, res)=>{
    await pool.query('SELECT ( SELECT dades_user.nomUser FROM dades_user WHERE dades_user.emailUser = ( SELECT usuari.emailUser FROM usuari WHERE usuari.idUser = ? )) AS userName, ( SELECT dades_user.descUsuari FROM dades_user WHERE dades_user.emailUser = ( SELECT usuari.emailUser FROM usuari WHERE usuari.idUser = ? )) AS descUser,( SELECT image.rutaImatge FROM image WHERE image.idImage = ( SELECT dades_user.profileImg FROM dades_user WHERE dades_user.emailUser = ( SELECT usuari.emailUser FROM usuari WHERE usuari.idUser = ? ))) AS profileImg, ( SELECT image.rutaImatge FROM image WHERE image.idImage = ( SELECT dades_user.bannerImg FROM dades_user WHERE dades_user.emailUser = ( SELECT usuari.emailUser FROM usuari WHERE usuari.idUser = ?))) AS bannerImg', [req.body.profileId, req.body.profileId, req.body.profileId, req.body.profileId] , (erro, respo)=>{
        if (erro){
            console.log(erro)
        } else{
            res.json(respo)
            console.log(req.body.profileId)
        }
    })
})

app.post('/getprofileposts', async (req, res)=>{
    await pool.query('SELECT post.idPost AS postId, post.titolPost, post.idImage AS imageId, post.idUser AS userId, ( SELECT image.rutaImatge FROM image WHERE image.idImage = imageId ) AS rutaImatge, ( SELECT dades_user.nomUser FROM dades_user WHERE dades_user.emailUser = ( SELECT usuari.emailUser FROM usuari WHERE usuari.idUser = userId ) ) AS userName, ( SELECT image.rutaImatge FROM image WHERE image.idImage = ( SELECT dades_user.profileImg FROM dades_user WHERE dades_user.emailUser = ( SELECT usuari.emailUser FROM usuari WHERE usuari.idUser = userID) ) ) AS rutaImatgeUsuari, ( SELECT COUNT(comentari.idComment) FROM comentari WHERE comentari.idPost = postId ) AS numComment FROM post WHERE post.idUser = ? ORDER BY idPost DESC', [req.body.profileId] , (erro, respo)=>{
        if (erro){
            console.log(erro)
        } else{
            res.json(respo)
            console.log(req.body.profileId)
        }
    })
})

// Public
app.use(express.static(path.join(__dirname, 'public')))

// Starting the server
const server = app.listen(app.get('port'), () =>
    console.log('Server on port', app.get('port'))
)