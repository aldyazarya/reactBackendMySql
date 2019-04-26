const sgMail = require ('@sendgrid/mail')
const sgAPIKey = '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'
// API keys SENDGRID : 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 //

sgMail.setApiKey(sgAPIKey)

const sendVerify = (username, name, email) => {
    sgMail.send({
        to: email,
        from: 'power.ranger1612@gmail.com', //sendernya harus pake gmail
        subject: 'Verifikasi Email',
        html: `<h1><a href="http://localhost:2010/verify?username=${username}">Klik untuk verifikasi</a></h1>`
    })
    
}

module.exports = {
    sendVerify
}
