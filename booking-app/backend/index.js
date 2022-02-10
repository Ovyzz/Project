const cors = require("cors");
const express = require("express");
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.use("/api", require("./api/user"));
app.use("/api", require("./api/booking"));
app.use("/api", require("./api/payment"));
app.use("/api", require("./api/podcast"));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})