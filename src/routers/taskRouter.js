const router = require ('express').Router()
const conn = require ('../connection/connection')

//create tasks
router.post('/tasks', (req, res) => {
    const sql = `INSERT INTO tasks SET ?`
    const data = req.body

    conn.query(sql, data, (err, result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})

//get tasks by userid
router.get('/owntasks/:userid', (req, res) => {
    const sql = `SELECT * FROM tasks WHERE user_id = ?`
    const data = req.params.userid

    conn.query(sql, data, (err, result) =>{
        if (err) return res.send(err.sqlMessage)

        res.send(result)
    })
})

//update task by task id
router.patch('/tasks/:taskid', (req, res) => {
    const sql = `UPDATE tasks SET ? WHERE id = ?`
    const data = [req.body, req.params.taskid]

    conn.query(sql, data, (err, result) => {
        if (err) return res.send(err)

        res.send(result)
    })
})

//delete task

module.exports= router