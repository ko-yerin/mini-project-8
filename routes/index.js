const express = require('express')
const router = express.Router()
const { pool } = require('../db')
const { alertmove } = require('../util/alertmove')
const boardRouter = require('./board')
const userRouter = require('./user')

router.get('/',async(req,res) => {
    const sql = `SELECT * FROM board;`
    const prepare = []
    const [result] = await pool.execute(sql,prepare)
    // console.log(result)

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


