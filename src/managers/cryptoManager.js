const Crypto = require('../models/Crypto');

exports.getAll = () => Crypto.find().populate('owner');

exports.getOne = (cryptoId) => Crypto.findById(cryptoId).populate('owner');

exports.create = (cryptoData) => Crypto.create(cryptoData);