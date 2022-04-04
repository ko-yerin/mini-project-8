const express = require('express')
const nunjucks = require('nunjucks')
const app = express()
const router = require('./routes')
const session = require('express-session')
const MemoryStore = require('memorystore')(session)
//session사용하기위해서는 npm install express-session,  memorystore해줘야됨
//그리고 5,6,11~19,28번쨰줄을 써줘야됨
//그리고 로그인 성공부분에 req.session.user = session_user 써주면됨


const sessionObj = {
    secret: 'yerin',
    resave: false,
    saveUninitialized: true,
    stroe: new MemoryStore({ checkPeriod:1000 * 60 * 10 }),
    cookie: {
        maxAge: 1000 * 60 * 10,
    },
}

app.set('view engine','html')
nunjucks.configure('views',{
    express:app,
    watch:true
})

app.use(express.static('public')) 
app.use(express.urlencoded({extended:true}))
app.use(session(sessionObj))

app.use (router)

app.listen (4000,() => {
    console.log('server 4000')
})