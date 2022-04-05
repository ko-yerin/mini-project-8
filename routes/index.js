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

//로그인사용자 세션 삭제
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        req.session
    });
    res.send(alertmove('/','로그아웃 완료'))
})
//destroy method는 연결된 세션을 다 삭제하는 역할 !! 형태를 기억하자
//main에 있는 로그아웃버튼을 누르면 /logout으로 링크가 이동하며 세션이 삭제되고
//경고창이 뜨고 다시 메인으로 이동한다
//user  index에 넣어놔도 똑같이 작동되지만  그럼 링크가 /user/logout가게된다
//그래서 여기로 옮겨줌

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


