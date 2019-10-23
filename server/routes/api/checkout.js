var express = require("express");
var router = express.Router();
var checkoutCtrl = require("../../controllers/checkout");

/* GET home page. */
router.get("/all", checkoutCtrl.getAll);
router.get("/payments", checkoutCtrl.getPayments);
router.post("/", checkoutCtrl.checkout);
router.post("/test2", checkoutCtrl.test2);
router.post("/customer", checkoutCtrl.customer);
router.post("/exCustomer", checkoutCtrl.exCustomer);

module.exports = router;
