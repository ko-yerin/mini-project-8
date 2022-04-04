const express = require('express')
const router = express.Router()
const { pool } = require('../db')
const { alertmove } = require('../util/alertmove')
const boardRouter = require('./board')
const userRouter = require('./user')
const adminRouter = require('./admin')

router.get('/',async(req,res) => {
    console.log('session 확인', req.session)
    // console.log('session 확인', req.session.user)
    if (req.session.user !== undefined) {
    const sql = `SELECT * FROM board;`
    const prepare = []
    const [result] = await pool.execute(sql,prepare)
    // console.log(result)
    } else if (req.session.user === undefined) {
        console.log('session이 없네')
    }

    res.render('main.html')    
})

// router.get('/',async(req,res) => {
//     const sql = `SELECT * FROM user;`
//     const prepare = []
//     const [result] = await pool.execute(sql,prepare)
//     console.log(result)

//     res.render('main.html')    
// })

router.use('/board',boardRouter)
router.use('/user',userRouter)
router.use('/admin',boardRouter)


module.exports = router


