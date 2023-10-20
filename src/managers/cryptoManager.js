const Crypto = require('../models/Crypto');

exports.getAll = () => Crypto.find().populate('owner');

exports.getOne = (cryptoId) => Crypto.findById(cryptoId).populate('owner');

exports.create = (cryptoData) => Crypto.create(cryptoData);

exports.buy = async (userId, cryptoId) => {
    const crypto = await Crypto.findById(cryptoId);

    crypto.buyers.push(userId);
    return crypto.save();
};

// exports.buy = async (userId, cryptoId) => {
//     Crypto.findByIdAndUpdate(cryptoId, { $push: { buyers: userId } });
// };

exports.delete = (cryptoId) => Crypto.findByIdAndDelete(cryptoId);

exports.edit = (cryptoId, cryptoData) => Crypto.findByIdAndUpdate(cryptoId, cryptoData);

exports.search = async (name, payment) => {
    let crypto = await Crypto.find().lean();
    //let crypto = this.getAll();

    if (name) {
        crypto = crypto.filter(x => x.name.toLowerCase() == name.toLowerCase());
    }

    if (payment) {
        crypto = crypto.filter(x => x.payment == payment);
    }
    return crypto;
}