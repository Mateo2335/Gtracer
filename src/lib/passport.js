const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../database')
const helpers = require('../lib/helpers')

let definitiveId;

passport.use('local.signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {

    await pool.query('SELECT * FROM dades_user WHERE emailUser = ?', [email], async (err, res) => {
        if (err){
            console.log(err)
        } else {
            if (res.length > 0) {
                const user = res[0]
                const validPassword = await helpers.matchPassword(password, user.passwordUser);
                if (validPassword){
                    await pool.query('SELECT idUser FROM usuari WHERE emailUser = ?', [email], (erro, resp) => {
                        if (erro){
                            console.log(erro)
                        } else {
                            definitiveId = resp[0].idUser
                            done(null, definitiveId)
                            console.log('Usuari logejat satisfactoriament')
                        }
                    })
                } else {
                    done(null, false)
                    console.log('contrassenya incorrecta')
                }
            } else {
                done(null, false)
                console.log('No sha trobat lusuari')
            }
        }
    });
}))

passport.use('local.signup', new LocalStrategy({
    usernameField: 'emailUser',
    passwordField: 'passwordUser',
    passReqToCallback: true
}, async (req, emailUser, passwordUser, done) => {
    const { nomUser } = req.body
    const newUser = {
        emailUser,
        passwordUser,
        nomUser
    };
    newUser.passwordUser = await helpers.encryptPassword(passwordUser)
    await pool.query('INSERT INTO dades_user SET ?', [newUser], (err, res) => {
        if (err){
            console.log(err)
        } else {
            console.log('Dades de lusuari inserides')
        }
    })
    await pool.query('INSERT INTO usuari(emailUser) VALUES(?)', [newUser.emailUser], (err, res) => {
        if (err){
            console.log(err)
        } else {
            console.log('Id de lusuari inserit en la bdd juntament amb email')
            definitiveId = res.insertId
        }
    })
    return done(null, definitiveId);

}));

passport.serializeUser((usr, done) => {
    console.log('Serielized')
    done(null, usr);
})

passport.deserializeUser( async (id, done) => {
    console.log('Deserialized')
    await pool.query('SELECT * FROM usuari INNER JOIN dades_user ON usuari.emailUser = dades_user.emailUser WHERE idUser = ?', [id], (err, res) => {
        if (err){
            console.log('Unable to deserialize')
            console.log(err)
        } else{
            console.log('Deserialized')
            done(null, res[0])
        }
    });
})