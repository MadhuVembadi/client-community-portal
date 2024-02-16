const connectDB = require('./db');
connectDB();
const exp = require('express');
const app = exp();
const path = require('path');
const cors = require('cors')
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
const userApp = require('./APIs/userAPI');
const postApp = require('./APIs/postAPI');
const notificationApp = require('./APIs/notificationAPI');
const searchApp = require('./APIs/searchAPI');
const authorize = require('./APIs/Middlewares/authorize').authorize

require('dotenv').config();

app.use(exp.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())

// connect build of react app with node.js
app.use(exp.static(path.join(__dirname, './build')))


app.use('/user',userApp);
app.use('/post',authorize,postApp);
app.use('/notification',authorize,notificationApp);
app.use('/search',authorize,searchApp);


//dealing with page refresh
app.use('*',(request, response) => {
    response.sendFile(`${__dirname}/build/index.html`)
})

//exception handling
app.use((request, response, next) => {
    response.send({ message: `${request.url} is invalid path` })
})


//error handling
app.use((error, request, response, next) => {
    response.send({ message: `Error occurred`, reason: `${error.message}` })
})

//assign port number
const port = process.env.PORT
app.listen(port, () => {
    console.log(`server listening on port ${port}...`);
})

module.exports = app;