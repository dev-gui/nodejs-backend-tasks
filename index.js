const app = require('express')()
const db = require('./config/db')
const consign = require('consign')

app.db = db

consign()
    .then('./config/middlewares.js')
    .then('./api')
    .then('./config/routes.js')
    .into(app)

app.listen(8080, () => console.log('Backend rodando...'))