const router = require('express').Router();
const cryptoManager = require('../managers/cryptoManager');

const { getErrorMessage } = require('../utils/errorHelpers');

const { isAuth } = require('../middlewares/authMiddleware');

router.get('/cataloge', async (req, res) => {
    const cryptos = await cryptoManager.getAll().lean();

    res.render('cryptos/cataloge', { cryptos });
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
    const cryptoId = req.params.cryptoId
    const crypto = await cryptoManager.getOne(cryptoId).lean();
    //if do not have user: user?
    const isOwner = req.user?._id == crypto.owner._id;

    res.render('cryptos/details', { crypto, isOwner });
});

router.get('/:cryptoId/buy', isAuth, async (req, res) => {
    await cryptoManager.buy(req.user._id, req.params.cryptoId);

    res.redirect(`/cryptos/${req.params.cryptoId}/details`);
});

router.get('/:cryptoId/delete', isAuth, async (req, res) => {
    const cryptoId = req.params.cryptoId;
    try {
        await cryptoManager.delete(cryptoId);

        res.redirect('/cryptos/cataloge');
    } catch (err) {
        res.render(`/cryptos/${cryptoId}/details`, { error: 'Unsuccessful photo delete!' });
    }
});

router.get('/:cryptoId/edit', isAuth, async (req, res) => {
    const crypto = await cryptoManager.getOne(req.params.cryptoId).lean();
    res.render('cryptos/edit', { crypto });
});

router.post('/:cryptoId/edit', isAuth, async (req, res) => {
    const cryptoId = req.params.cryptoId;
    const cryptoData = req.body;
1
    try {
        await cryptoManager.edit(cryptoId, cryptoData);

        res.redirect(`/cryptos/${cryptoId}/details`);
    } catch (error) {
        res.render('cryptos/edit', { error: 'Unable to update crypto!', ...cryptoData });
    }
});




module.exports = router;

