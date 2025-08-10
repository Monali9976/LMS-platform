const express = require("express");
const { router: materialRoutes } = require("./routes/materialRoutes");
// const materialRoutes = require('./routes/materialRoutes');
const quizRoutes = require("./routes/quizRoutes");

const app = express();
app.use(express.json());

app.use("/api", materialRoutes);
app.use("/api", quizRoutes);

module.exports = app;
