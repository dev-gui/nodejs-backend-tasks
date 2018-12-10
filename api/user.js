const bcrypt = require('bcrypt-nodejs')

module.exports = app => {
    const obterHash = (password, callback) => {
        bcrypt.genSalt(10, (error, salt) => {
            bcrypt.hash(password, salt, null, (error, hash) => callback(hash))
        })
    }

    const save = (req, resp) => {
        obterHash(req.body.password, hash => {
            const password = hash

            app.db('users')
                .insert({ name: req.body.name, email: req.body.email, password })
                .then(_ => resp.status(204).send())
                .catch(error => resp.status(400).json(error))
        })
    }

    return { save }
}