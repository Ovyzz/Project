const checkLogin = require("../helper/user/user").checkLogin;
const pool = require("../database");
const router = require("express").Router();

router.post("/addbooking", checkLogin, async (req, res) => {
    try {
        const creator = req.user.email;
        const booking = await pool.query("SELECT date, time FROM bookings WHERE creator = $1", [creator]);
        const { firstName, lastName, phoneNumber, email, date, time, message } = req.body;
        if (firstName.length === 0 || lastName.length === 0 || phoneNumber.length === 0 || email.length === 0
            || message.length === 0) {
            res.json(false);
            return;
        }
        const dataReceived = new Date(date).toLocaleDateString() + " " + time + ":00";
        for (let i = 0; i < booking.rows.length; ++i) {
            const newDate = booking.rows[i].date.toLocaleDateString() + " " + booking.rows[i].time;
            if (dataReceived === newDate) {
                res.json(false);
                return;
            }
        }
        await pool.query("INSERT INTO bookings (firstName, lastName, phoneNumber, email, date, time, message, creator) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
            [firstName, lastName, phoneNumber, email, date, time, message, creator]);
        res.json(true);
    } catch (error) {
        console.error(error.message);
        res.status(400).json(false);
    }
});

router.post("/deletebooking", checkLogin, async (req, res) => {
    try {
        const creator = req.user.email;
        const id = req.body.id;
        await pool.query("DELETE FROM bookings WHERE creator = $1 and id = $2", [creator, id]);
    } catch (error) {
        console.error(error.message);
        res.status(400).send("Server Error");
    }
});

router.get("/appointment-list", checkLogin, async (req, res) => {
    try {
        const creator = req.user.email;
        const booking = await pool.query("SELECT * FROM bookings WHERE creator = $1", [creator]);
        res.json(booking.rows);
    } catch (error) {
        console.error(error.message);
        res.status(400).send("Server Error");
    }
});

module.exports = router;
