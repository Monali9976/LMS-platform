const app = require('./app');
const { connect } = require('./config/db');
const dotenv = require('dotenv');

dotenv.config();
const PORT = process.env.PORT || 4000;

(async ()=>{
  await connect();
  app.listen(PORT, ()=> console.log('Server running on', PORT));
})();
