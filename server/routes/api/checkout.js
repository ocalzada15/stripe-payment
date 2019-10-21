var express = require('express');
var router = express.Router();
var checkoutCtrl = require('../../controllers/checkout')

/* GET home page. */
router.post('/', checkoutCtrl.checkout)

module.exports = router;