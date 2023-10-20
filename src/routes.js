const router = require('express').Router();
//add controller routes
const homeController = require('./controllers/homeController');
const userController = require('./controllers/userController');
const cryptoController = require('./controllers/cryptoController');

router.use(homeController);
router.use('/users', userController);
router.use('/cryptos', cryptoController);

router.get('*', (req, res) => {
    res.redirect('/404');
})

module.exports = router;