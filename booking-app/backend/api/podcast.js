const checkLogin = require("../helper/user/user").checkLogin;
const pool = require("../database");
const { getUserName } = require("../validator/podcast");
const router = require("express").Router();

router.post("/addpodcast", checkLogin, async (req, res) => {
    try {
        const creator = req.user.email;
        const { title, url, type } = req.body;
        if (url.length === 0 || title.length === 0) {
            res.json(false);
            return;
        }
        const newUrl = url.replace("watch?v=", "embed/");
        const createAt = new Date().toLocaleString();
        await pool.query("INSERT INTO podcasts (title, url, type, createAt, creator) VALUES ($1, $2, $3, $4, $5)",
            [title, newUrl, type, createAt, creator]);
        res.json(true);
    } catch (error) {
        console.error(error.message);
        res.status(400).json(false);
    }
});

router.get("/podcast-list", checkLogin, async (req, res) => {
    try {
        const creator = req.user.email;
        const podcast = await pool.query("SELECT * FROM podcasts WHERE creator = $1 or type = 'subscribe' or type = 'public'", [creator]);
        const filteredPodcast = [];
        for (let i = 0; i < podcast.rows.length; ++i) {
            if (podcast.rows[i].type === "public") {
                podcast.rows[i].name = await getUserName(podcast.rows[i].creator);
                filteredPodcast.push(podcast.rows[i]);
            } else if (podcast.rows[i].type === "subscribe") {
                const checkSubscribe = await pool.query("SELECT * FROM subscriptions where creator = $1 and subscriber = $2", [creator, podcast.rows[i].creator]);
                if (checkSubscribe.rows.length !== 0) {
                    podcast.rows[i].name = await getUserName(podcast.rows[i].creator);
                    filteredPodcast.push(podcast.rows[i]);
                } else if (podcast.rows[i].creator === creator) {
                    podcast.rows[i].name = await getUserName(podcast.rows[i].creator);
                    filteredPodcast.push(podcast.rows[i]);
                }
            } else if (podcast.rows[i].type === "private" && podcast.rows[i].creator === creator) {
                podcast.rows[i].name = await getUserName(podcast.rows[i].creator);
                filteredPodcast.push(podcast.rows[i]);
            }
        }
        res.json(filteredPodcast);
    } catch (error) {
        console.error(error.message);
        res.status(400).send("Server Error");
    }
});

module.exports = router;
