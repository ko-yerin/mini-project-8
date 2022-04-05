const express = require('express')
const router = express.Router()
const { pool } = require('../db')
const { alertmove } = require('../util/alertmove') //자기자신을 담고 있는 부모폴더
const boardRouter = require('./board')
const userRouter = require('./user')
const adminRouter = require('./admin') //자기자신의 폴더(디렉토리)

router.get('/',async(req,res) => {
    console.log('session 확인', req.session)
    // console.log('session 확인', req.session.user)
    try{
        if (req.session.user !== undefined) {
        const sql = `SELECT * FROM board;`
        const prepare = []
        const [result] = await pool.execute(sql,prepare)
        // console.log(result)
        res.render('main.html',{
            userid:req.session.user.userid
        })    
        } else if (req.session.user === undefined) {
            console.log('session이 없네')
            res.render('main.html')
        }
        // session에 아무것도 없는 상태에서 userid를 담으려고 하면 오류가 났다
        // 이걸 해결 하기 위해 session이 있을때와 없을때를 구분했다.
    } catch(e) {
        console.log(e)
    }
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
router.use('/admin',adminRouter)


module.exports = router


