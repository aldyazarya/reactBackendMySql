const Handlebars = require('handlebars')
const pdf = require('html-pdf')
const fs = require('fs')

var source = `
<!DOCTYPE html>
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" crossorigin="anonymous">
</head>
<body>
    <div class="container">
        <p class="display-4 d-flex justify-content-between border-bottom">
            <span class="text-left">Invoice</span>
            <span class="text-right">#{{invoice}}</span>
        </p>
        <img src={{imgSrc}} alt="">
        <h1>Account Details</h1>
        <p>
            Username    : {{username}} <br>
            Name        : {{name}} <br>
            Email       : {{email}} <br>
            Plan        : <strong>Free</strong>
        </p>
    </div>
</body>
</html>
`

var data = {
    "imgSrc" : "http://icons.iconarchive.com/icons/iconka/meow/256/cat-clean-icon.png",
    "username" : "masako",
    "name" : "masako",
    "email" : "aldy1612@gmail.com"
}

var template = Handlebars.compile(source) // compile teks html
var result = template(data) // gabungkan object data dg template html

fs.writeFileSync('./src/upload/result.html', result)

var htmls = fs.readFileSync('./src/upload/result.html', 'utf8')

var options = {format: 'Letter'}

pdf.create(htmls, options).toFile('./src/upload/result.pdf', (err, result) => {
    if (err) return console.log(err.message);
    
    console.log("PDF berhasil dibuat");
    
})