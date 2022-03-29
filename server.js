const express = require('express')
const nunjucks = require('nunjucks')
const app = express()
const router = require('./routes')

app.set('view engine','html')
nunjucks.configure('views',{
    express:app,
    watch:true
})

app.use(express.static('public')) 
app.use(express.urlencoded({extended:true}))

app.use (router)

app.listen (4000,() => {
    console.log('server 4000')
})