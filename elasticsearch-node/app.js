const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const apiRoutes = require('./routes');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/api/v1', apiRoutes);

app.listen(port, () => console.log(`Server listening on port:${port}.`));