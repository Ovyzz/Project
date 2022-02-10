const checkLogin = require("../helper/user/user").checkLogin;
const pool = require("../database");
const router = require("express").Router();

router.post("/addpayment", checkLogin, async (req, res) => {
    try {
        const creator = req.user.email;
        const { firstName, lastName, phoneNumber, email, date, amount, cashing, message } = req.body;
        if (firstName.length === 0 || lastName.length === 0 || phoneNumber.length === 0 || email.length === 0
            || message.length === 0 || amount.length === 0) {
            res.json(false);
            return;
        }
        await pool.query("INSERT INTO payments (firstName, lastName, phoneNumber, email, date, amount, cashing, message, creator) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
            [firstName, lastName, phoneNumber, email, date, amount, cashing, message, creator]);
        res.json(true);
    } catch (error) {
        console.error(error.message);
        res.status(400).json(false);
    }
});

router.get("/payment-list", checkLogin, async (req, res) => {
    try {
        const creator = req.user.email;
        const payment = await pool.query("SELECT * FROM payments WHERE creator = $1", [creator]);
        res.json(payment.rows);
    } catch (error) {
        console.error(error.message);
        res.status(400).send("Server Error");
    }
});

router.get("/payment-statistics", checkLogin, async (req, res) => {
    try {
        const creator = req.user.email;
        const payment = await pool.query("SELECT amount, cashing FROM payments WHERE creator = $1", [creator]);
        let amountPaid = 0, amountReceived = 0;
        for (let i = 0; i < payment.rows.length; ++i) {
            if (payment.rows[i].cashing === "true") {
                amountReceived += parseInt(payment.rows[i].amount);
            } else {
                amountPaid += parseInt(payment.rows[i].amount);
            }
        }
        const paymentsMade = {
            amountPaid: amountPaid,
            amountReceived: amountReceived,
            totalAmount: amountReceived - amountPaid
        };
        res.json(paymentsMade);
    } catch (error) {
        console.error(error.message);
        res.status(400).send("Server Error");
    }
});

module.exports = router;
