// const express = require('express');
// const cors = require('cors');
// const { connect } = require('./config/db');
// const materialRoutes = require('./routes/materialRoutes');
// const quizRoutes = require('./routes/quizRoutes');
// const dotenv = require('dotenv');

// dotenv.config();
// const app = express();
// app.use(cors());
// app.use(express.json());
// app.use('/api', materialRoutes);
// app.use('/api', quizRoutes);

// // health
// app.get('/health', (req, res) => res.json({ ok: true }));

// module.exports = app;


const express = require("express");
const { router: materialRoutes } = require("./routes/materialRoutes");
// const materialRoutes = require('./routes/materialRoutes');
const quizRoutes = require("./routes/quizRoutes");

const app = express();
app.use(express.json());

app.use("/api", materialRoutes);
app.use("/api", quizRoutes);

module.exports = app;
