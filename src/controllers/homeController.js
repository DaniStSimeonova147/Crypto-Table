const router = require('express').Router();

const cryptoManager = require('../managers/cryptoManager');

router.get('/', async (req, res) =>{
    const cryptos = await cryptoManager.getAll().lean();
    res.render('home', {cryptos});

});

router.get('/404', (req, res) =>{
    res.render('404');
});


module.exports = router;