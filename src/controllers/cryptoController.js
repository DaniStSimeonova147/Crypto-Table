const router = require('express').Router();
const cryptoManager = require('../managers/cryptoManager');

const { getErrorMessage } = require('../utils/errorHelpers');

const { isAuth } = require('../middlewares/authMiddleware');

router.get('/cataloge', async (req, res) => {
    const cryptos = await cryptoManager.getAll().lean();

    res.render('cryptos/cataloge',{cryptos});
});

router.get('/create', async (req, res) => {

    res.render('cryptos/create');
});

router.post('/create', isAuth, async (req, res) => {
    const cryptoData = {
        ...req.body,
        owner: req.user._id,
    };
    
    try {
        await cryptoManager.create(cryptoData);

        res.redirect('/cryptos/cataloge');
    } catch (error) {
       res.render('cryptos/create', { error: getErrorMessage(error) });
    }
});

router.get('/:cryptoId/details', async (req, res) => {
    const cryptoId = req.params.cryptoId;
    const crypto = await cryptoManager.getOne(cryptoId).lean();
    //if do not have user: user?
    const isOwner = req.user?._id == crypto.owner._id;

    res.render('cryptos/details', { crypto, isOwner });
});



module.exports = router;

