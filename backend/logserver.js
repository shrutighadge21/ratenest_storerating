const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
app.post('/log', (req, res) => {
  console.log('[FRONTEND LOG]', req.body.message);
  res.send('ok');
});
app.listen(5001, () => console.log('Log server running on port 5001'));
