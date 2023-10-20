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
    const isBuyer = crypto.buyers?.some(id => id == req.user?._id);

    res.render('cryptos/details', { crypto, isOwner, isBuyer });
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

    const paymentMethods = {
        "crypto-wallet": "Crypto Wallet",
        "credit-card": "Credit Card",
        "debit-card": "Debit Card",
        "paypal": "PayPal",
    }

    const payment = Object.keys(paymentMethods).map(key => ({
        value: key,
        label: paymentMethods[key],
        isSelected: crypto.payment == key,
    }));

    res.render('cryptos/edit', { crypto, payment });
});

router.post('/:cryptoId/edit', isAuth, async (req, res) => {
    const cryptoId = req.params.cryptoId;
    const cryptoData = req.body;

    try {
        await cryptoManager.edit(cryptoId, cryptoData);

        res.redirect(`/cryptos/${cryptoId}/details`);
    } catch (error) {
        res.render('cryptos/edit', { error: 'Unable to update crypto!', ...cryptoData });
    }
});

router.get('/search', async (req, res) => {
    const { name, payment } = req.query;
    const cryptos = await cryptoManager.search(name, payment);

    res.render('cryptos/search', { cryptos });
});

module.exports = router;

