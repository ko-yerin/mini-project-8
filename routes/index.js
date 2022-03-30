const express = require('express')
const router = express.Router()
const { pool } = require('../db')
const boardRouter = require('./board')
const adminRouter = require('./admin')

router.get('/',async(req,res) => {
    const sql = `SELECT * FROM board;`
    const prepare = []
    const [result] = await pool.execute(sql,prepare)
    // console.log(result)

    res.render('main.html')    
})


router.use('/board',boardRouter)
router.use('/admin',adminRouter)


module.exports = router


