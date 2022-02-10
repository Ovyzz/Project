const pool = require("../database");

async function getUserName(user) {
    try {
        const name = await pool.query("SELECT firstname, lastname FROM users where email = $1", [user]);
        return name.rows[0].firstname + " " + name.rows[0].lastname;
    } catch (error) {
        console.log(error);
    }
}

module.exports = { getUserName };
