const bcrypt = require('bcryptjs')
const helpers = {};

helpers.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = bcrypt.hash(password, salt)
    return hash;
}

helpers.matchPassword = async (password /*contraseña talcual*/, hashPassword) => {
    try{
        return await bcrypt.compare(password, hashPassword);
    } catch(e) {
        console.log(e)
    }
}

module.exports = helpers