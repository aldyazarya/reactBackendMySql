const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: 'aldy1612@gmail.com',
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN
    }
})


const sendVerify= (username, name, email) => {
    const mail = {
        from: 'Aldy Azarya <aldy1612@gmail.com>',
        to: email,
        subject: 'Verifikasi Email',
        html: `<h1><a href="http://localhost:2010/verify?username=${username}">Klik untuk verifikasi</a></h1>`
    }
    transporter.sendMail(mail, (err, res) => {
        if(err) return console.log(err.message);
        
        console.log("email berhasil terkirim");
        
    })
    
}

module.exports = {
    sendVerify
}