const multer  = require('multer')
const upload = multer({ dest: `${__dirname}/tmp/` })
 
const addItemMiddleware = upload.single('image')
 
module.exports = { addItemMiddleware }