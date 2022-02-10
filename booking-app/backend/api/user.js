const bcrypt = require("bcrypt");
const { checkEmailAlreadyUse } = require("../validator/user");
const checkLogin = require("../helper/user/user").checkLogin;
const generateUserAccessToken = require("../helper/user/user").generateUserAccessToken;
const pool = require("../database");
const router = require("express").Router();

router.post("/register", async (req, res) => {
    try {
        const { email, firstName, lastName, password } = req.body;
        const emailInUse = await checkEmailAlreadyUse(email);
        if (emailInUse) {
            return res.status(400).json("This email is already used");
        }
        if (firstName.length === 0 || lastName.length === 0 || password.length === 0 || email.length === 0) {
            return res.status(400).json("Try again, complete all fields or select another email");
        }
        const salt = await bcrypt.genSalt(10);
        const cryptPassword = await bcrypt.hash(password, salt);
        const newUser = await pool.query("INSERT INTO users (email, firstName, lastName, password) VALUES ($1, $2, $3, $4)", [email, firstName, lastName, cryptPassword]);
        return res.status(200).json("Account has been successfully registered");
    } catch (error) {
        console.error(error.message);
        res.status(400).send("Server Error");
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (user.rows.length === 0) {
            return res.status(403).json({ message: "The email address you entered is invalid" });
        }
        const bcryptPassword = await bcrypt.compare(password, user.rows[0].password);
        if (bcryptPassword) {
            const token = generateUserAccessToken({ email: email });
            res.json(token);
        } else {
            return res.status(403).json({ message: "The password you entered is invalid" });
        }
    } catch (error) {
        console.error(error.message);
        res.status(400).send("Server Error");
    }
});

router.get("/authorization", checkLogin, async (req, res) => {
    try {
        res.json(true);
    } catch (error) {
        console.error(error.message);
        res.status(400).send("Server Error");
    }
});

router.get("/getusers", checkLogin, async (req, res) => {
    try {
        const email = req.user.email;
        const username = await pool.query("SELECT email, firstname, lastname FROM users where email != $1", [email]);
        const subscribe = await pool.query("SELECT id, subscriber FROM subscriptions where creator = $1", [email]);
        for (let i = 0; i < username.rows.length; ++i) {
            for (let j = 0; j < subscribe.rows.length; ++j) {
                if (username.rows[i].email == subscribe.rows[j].subscriber) {
                    username.rows[i].subscriptionStatus = true;
                    username.rows[i].idSubscription = subscribe.rows[j].id;
                    break;
                } else {
                    username.rows[i].subscriptionStatus = false;
                }
            }
        }
        res.json(username.rows);
    } catch (error) {
        console.error(error.message);
        res.status(400).send("Server Error");
    }
});

router.post("/unsubscribe", checkLogin, async (req, res) => {
    try {
        const creator = req.user.email;
        const id = req.body.id;
        await pool.query("DELETE FROM subscriptions WHERE creator = $1 and id = $2", [creator, id]);
    } catch (error) {
        console.error(error.message);
        res.status(400).send("Server Error");
    }
});

router.post("/subscribe", checkLogin, async (req, res) => {
    try {
        const creator = req.user.email;
        const email = req.body.email;
        await pool.query("INSERT INTO subscriptions (subscriber, creator) VALUES ($1, $2)", [email, creator]);
    } catch (error) {
        console.error(error.message);
        res.status(400).send("Server Error");
    }
});

router.get("/getuserdata", checkLogin, async (req, res) => {
    try {
        const email = req.user.email;
        const name = await pool.query("SELECT lastName FROM users WHERE email = $1", [email]);
        const peopleRegistered = await pool.query("SELECT * FROM users");
        const publishedPodcast = await pool.query("SELECT creator FROM podcasts WHERE creator = $1", [email]);
        const subscribers = await pool.query("SELECT * FROM subscriptions WHERE subscriber = $1", [email]);
        const payments = await pool.query("SELECT * FROM payments WHERE creator = $1", [email]);
        const totalPodcasts = await pool.query("SELECT * FROM podcasts");
        const totalBookings = await pool.query("SELECT * FROM bookings  WHERE creator = $1", [email]);
        const userData = {
            name: name.rows[0].lastname,
            peopleRegistered: peopleRegistered.rows.length,
            publishedPodcast: publishedPodcast.rows.length,
            subscribers: subscribers.rows.length,
            payments: payments.rows.length,
            totalPodcasts: totalPodcasts.rows.length,
            totalBookings: totalBookings.rows.length
        }
        res.json(userData);
    } catch (error) {
        console.error(error.message);
        res.status(400).send("Server Error");
    }
});

module.exports = router;
