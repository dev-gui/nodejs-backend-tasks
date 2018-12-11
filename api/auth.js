const { authSecret } = require('../.env')
const jwt = require('jwt-simple')
const bcrypt = require('bcrypt-nodejs')

module.exports = app => {
    const signin = async (req, resp) => {
        //Verifica se 
        if(!req.body.email || !req.body.password) {
            return resp.status(400).send('Dados incompletos.')
        }

        //Informaçoes do usuário na const user
        //Usa-se 'await' para esperar carregar as informações (necessário 'async')
        const user = await app.db('users').where({ email: req.body.email })

        if(user) {
            //Compara a senha digitada pelo usuário com a senha no DB
            bcrypt.compare(req.body.password, user.password, (error, isMatch) => {
                if(error || !isMatch) {
                    return resp.status(401).send()
                }

                const payload = { id: user.id }
                resp.json({
                    name: user.name,
                    email: user.email,
                    token: jwt.encode(payload, authSecret)
                })
            })
        }
        else {
            resp.status(400).send('Usuário não encontrado.')
        }
    }
    return { signin }
}