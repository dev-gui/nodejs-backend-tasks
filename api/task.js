const moment = require('moment')

module.exports = app => {
    const getTasks = (req, resp) => {
        const date = req.query.date ? req.query.date : moment().endOf('day').toDate()

        app.db('tasks')
            .where({ userId: req.user.id })
            .where('estimatedAt', '<=', date)
            .orderBy('estimateAt')
            .then(tasks => resp.json(tasks))
            .catch(error => resp.status(500).json(error))
    }

    const save = (req, resp) => {
        if (!req.body.desc.trim()) {
            return resp.status(400).send('Descrição é um campo obrigatório.')
        }

        req.body.userId = req.user.id

        app.db('tasks')
            .insert(req.body)
            .then(_ => resp.status(204).send())
            .catch(error => resp.status(400).json(error))
    }

    const remove = (req, resp) => {
        app.db('tasks')
            .where({ id: req.params.id, userId: req.user.id })
            .del()
            .then(rowsDeleted => {
                if (rowsDeleted > 0) {
                    resp.status(204).send()
                }
                else {
                    const msg = `Não foi encontrada task com id ${req.params.id}.`
                    resp.status(400).send(msg)
                }
            })
            .catch(error => resp.status(400).json(error))
    }

    const updateTaskDoneAt = (req, resp, doneAt) => {
        app.db('tasks')
            .where({ id: req.params.id, userId: req.user.id })
            .update({ doneAt })
            .then(_ => resp.status(204).send())
            .catch(error => resp.status(400).json(error))
    }

    const toggleTask = (req, resp) => {
        app.db('tasks')
            .where({ id: req.params.id, userId: req.user.id })
            .first()
            .then(task => {
                if (!task) {
                    msg = `Task com id ${req.params.id} não encontrada.`
                    return resp.status(400).send(msg)
                }

                const doneAt = tasks.doneAt ? null : new Date()
                updateTaskDoneAt(req, resp, doneAt)
            })
            .catch(error => resp.status(400).json(error))
    }

    return { getTasks, save, remove, toggleTask }
}