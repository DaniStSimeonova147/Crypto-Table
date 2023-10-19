//setup express
const express = require('express');
const routes = require('./routes');
const handlebars = require('express-handlebars');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const { auth } = require('./middlewares/authMiddleware');
const {errorHandler} = require('./middlewares/errorHandlerMiddleware');
const app = express();

//mongoose
mongoose.connect(`mongodb://127.0.0.1:27017/petstagram`)
    .then(() => console.log('DB Connected'))
    .catch(err => console.log('DB Error', err.message));

app.engine('hbs', handlebars.engine({
    extname: 'hbs'
}));
app.set('view engine', 'hbs');
app.set('views', 'src/views');

//static route
app.use('/static', express.static(path.resolve(__dirname, 'public')));
//body parser
app.use(express.urlencoded({ extended: false }));
//cookie-parser
app.use(cookieParser());
//auth middleware
app.use(auth);
//routes
app.use(routes);
//global error
app.use(errorHandler);

app.listen(5000, console.log(`Server is listening on port 5000...`));