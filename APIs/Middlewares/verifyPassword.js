
const bcryptjs = require('bcryptjs')

const verifyPassword = async (request,response,next) => {
    let password = request.body.password;
    let originalPassword = request.body.originalPassword;
    let isMatch = await bcryptjs.compare(password, originalPassword);
    if (isMatch == false) {
        response.send({ message: 'Incorrect Password' })
    }
    else {
        next();
    }
}
module.exports = verifyPassword