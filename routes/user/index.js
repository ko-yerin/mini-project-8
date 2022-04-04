const express = require('express')
const router = express.Router()
const { pool } = require('../../db')
const { alertmove } = require('../../util/alertmove')

router.get('/join',(req,res) => {
    try{
        res.render('user/user_join')

    }catch(error){
        res.send(alertmove('/','오류가 발생했습니다 회원가입을 다시 진행해 주세요'))
    }
})

// router.post('/join',async (req,res) => {
//     let user = { ...req.body } 
//     const { userid, userpw, username, nickname, birth, gender, tell, email, address } = user
//     console.log(user)
    
//     const sql = `INSERT INTO user(userid, userpw, username, nickname, birth, gender, tell, email, address) values('${userid}' , '${userpw}' , '${username}' , '${nickname}' , '${birth}' , '${gender}' , '${tell}' , '${email}' , '${address}');`
//     const prepare = []

//     const [result] = await pool.execute(sql,prepare)
//     console.log(result)

//     res.redirect('/')
// })

router.post('/join',async(req,res) => {
    // let user = { ...req.body }   // let user = (req.body)     let user = req.body   다 결과는 똑같았다
    // const { userid, userpw, username, nickname, birth, gender, tell, email, address } = user

    //위2줄과 아랫줄은 똑같음

    const { userid, userpw, username, nickname, birth, gender, tell, email, address } = { ...req.body }
    console.log(userid)
    console.log(req.body.userid)
    try{
        if(tell.length!=11){
            return res.send(alertmove('/user/join', '핸드폰번호를 다시입력해주세요'))
        } else if( userid.length===0 || userpw.length===0 || nickname.length===0 || gender.length===0 || tell.length===0 || email.length===0 || address.length===0 ){
            return res.send(alertmove('/user/join', '빠진정보없이 전부다 기입해주세요'))   
        } else if( username.length===0 || username.length===1 ){
            return res.send(alertmove('/user/join', '이름을 다시 입력해주세요')) 
        } else if ( birth.length!=6 ){
            return res.send(alertmove('/user/join', '예시대로 생년월일을 다시 입력해주세요')) 
        } else {
        const sql = `INSERT INTO user(userid, userpw, username, nickname, birth, gender, tell, email, address) values('${userid}' , '${userpw}' , '${username}' , '${nickname}' , '${birth}' , '${gender}' , '${tell}' , '${email}' , '${address}');`
        const prepare = []
    
        const [result] = await pool.execute(sql,prepare)
        // res.redirect('/user/welcome')
        }
    } catch(error){
        if(error.errno===1062){
            return res.send(alertmove('/user/join', '이미 존재하는 아이디입니다'))
        }
        console.log(error)
        // res.send(alertmove('/user/join', '입력한 정보를 확인해주세요.'))
    }
    return res.send(alertmove(`/user/welcome?userid=${userid}`,'환영합니다'))
})

router.get('/welcome',async(req,res) => {
    let userid = req.query.userid
    console.log('userid : ',userid)
    const sql = `SELECT * FROM user WHERE userid = '${userid}';`
    const prepare = []
    const [result] = await pool.execute(sql,prepare)
    console.log('result : ',result)

    res.render('user/user_welcome',{
        content:result,
    })
    
})

router.get('/login',(req,res) => {
    res.render('user/user_login')
})

router.post('/login',(req,res) => [
    res.redirect('/')
])

router.post('/logout',(req,res) => {
    res.redirect('/')
})

router.get('/profile',(req,res) => {
    res.render('user/user_profile')
})
//profile은 view처럼 회원가입시 정보를 보여주기만 하는거라 post필요없다
//profile은 로그인성공했을 시 보이게 

router.get('/update',(req,res) => {
    res.render('user/user_update')
})

router.post('/update',(req,res) => {
    res.redirect('/')
})

router.post('/resign',(req,res) => {
    res.redirect('/')
})

module.exports = router