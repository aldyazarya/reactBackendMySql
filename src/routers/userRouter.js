const router = require('express').Router()
const bcrypt = require('bcryptjs')
const isEmail = require('validator/lib/isEmail')
const {sendVerify} = require ('../emails/nodemailer')
const conn = require ('../connection/connection')
const multer = require('multer')
const path = require('path') //library nodeJS // untuk menentukan folder uploadnya
const fs = require('fs') //library nodeJS // menghapus file gambar

const uploadFolder = path.join(__dirname + '/../upload') // untuk mengarahkan ke folder yang ingin dituju
console.log(uploadFolder);

const storagE = multer.diskStorage({
    //destination 
    destination : function(req, file, cb){
        cb(null,uploadFolder)
    },
    //filename
    filename : function(req, file, cb) {
        cb(null, Date.now() + file.fieldname + path.extname(file.originalname))
    }
})

const upstore = multer({
    storage: storagE,
    limits: {
        fileSize: 10000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb (new Error('Please Upload Image File(jpg, jpeg, png)'))
        }
        cb(undefined, true)
    }
})

//upload avatar
router.post('/upstore', upstore.single('avatar'), (req, res) => {
    const sql = `SELECT * FROM users WHERE username = ?`
    const sql2 = `UPDATE users SET avatar = '${req.file.filename}' where username = '${req.body.uname}'`
    const data = req.body.uname

    conn.query(sql, data, (err, result) => {
        if (err) return res.send(err)

        conn.query(sql2, (err , result) => {
            if (err) return res.send(err)

            res.send({filename: req.file.filename})
        })
    })
})

//delete avatar
router.get('/deleteavatar', (req, res)=>{
    const data = req.query.username
   const sql = `select * from users where username = '${data}'`
   const sql2 = `update users set avatar = null where username = '${data}'`
   
   conn.query(sql, data, (err,  result) => {
       if (err) return res.send(err.sqlMessage)
       

       fs.unlink(`${uploadFolder}/${result[0].avatar}`, (err) => {
           if (err) throw Error
           res.send('avatar successfully deleted');
           
       })
       conn.query(sql2, (err, result) => {
           if(err) return res.send(err)

           res.send(result)

       })
   })
   
})

//show avatar
router.get('/getavatar', (req, res) => {
    const username = req.query.username
    const sql = `select avatar from users where username = '${username}'`

    conn.query (sql, (err, result) => {
        if(err) return res.send(err.sqlMessage)

        res.send({user: result, photo: `http://localhost:2010/avatar/${result[0].avatar}`} )
    })
})
//show avatar in browser
//ini akan jalan ketika link diatas dimasukkan di browser
router.get('/avatar/:photo', (req, res) => {
    res.sendFile(`${uploadFolder}/${req.params.photo}`)
})


//create user
router.post('/users', async (req, res) => {
    var sql = `INSERT INTO users SET ?;` // ? akan selalu ditimpah oleh var data
    var sql2 = `SELECT * FROM users;`
    var data = req.body

    if(!isEmail(req.body.email)) return res.send("Email is not valid")

    req.body.password = await bcrypt.hash(req.body.password, 8)

    conn.query(sql, data, (err, result) => {
        if(err) return res.send(err)

        sendVerify(req.body.username, req.body.name, req.body.email)

        conn.query(sql2, (err, result) => {
            if(err) return res.send(err)

            res.send(result)
        })
    })
})

//verify email
router.get('/verify', (req, res) =>{
    const username = req.query.username
    const sql = `UPDATE users SET verified = true WHERE username = '${username}'`
    const sql2 = `SELECT * FROM users WHERE username = '${username}'`

    conn.query ( sql, (err, result) => {
        if(err) return res.send(err.sqlMessage)
        if(err) return res.send(err.sqlMessage)

        conn.query(sql2, (err, result) => {
            if(err) return res.send(err.sqlMessage)

            res.send('<h1>Verifikasi berhasil</h1>')
        })
    })
})

router.post('/users/login', (req, res) => {
    const {username, password} = req.body
    const sql = `SELECT * FROM users WHERE username = '${username}'`

    conn.query(sql, async (err, result) => {
        if (err) return res.send (err.sqlMessage)

        const user = result[0]

        if(!user) return res.send("User Not Found")

        if(!user.verified) return res.send("Please, Verify your Account") //untuk mengecek apakah sudah verifikasi apa belum

        const hash = await bcrypt.compare(password, user.password) //password adalah apa yang ditulis saat login, user.password adalaah yang ada di database
        if(!hash) return res.send("Wrong Password")

        res.send(user)
    })
})

//read profile
//photo nya pakai yang show avatar
router.get('/users/username', (req, res) => {
    const sql = `SELECT * FROM users WHERE username = ?`
    const data = req.query.uname

    conn.query(sql, data, (err, result) => {
        if (err) return res.send(err.sqlMessage)

        const user = result[0]

        if(!user) return res.send("User Not Found")

        res.send({
            user,
            photo: `http://localhost:2010/avatar/${user.avatar}`
        })
    })
})

//update user
router.patch('/users/:username', (req, res) => {
    const sql = `UPDATE users SET ? WHERE username = ?` //SET ? adalah data baru yang akan di post
    const data = [req.body, req.params.username] //req.body akan gntikan 'SET ?'

    conn.query(sql, data, (err, result) => {
        if (err) return res.send(err.sqlMessage)


        res.send(result)
    })
})

//delete user
//all task will deleted too
router.delete('/users/delete', (req, res) => {
    const sql = `DELETE FROM users WHERE username = ?`
    const data = req.body.username

    conn.query(sql, data, (err, result) => {
        if(err) return res.send(err.sqlMessage)

        res.send(result)
    })
})

module.exports = router