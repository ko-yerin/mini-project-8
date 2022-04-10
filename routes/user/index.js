const express = require('express')
const router = express.Router()
const { pool } = require('../../db')
const { alertmove } = require('../../util/alertmove')

router.get('/join', (req, res) => {
    try {
        res.render('user/user_join')
    } catch (error) {
        res.send(alertmove('/', '오류가 발생했습니다 회원가입을 다시 진행해 주세요'))
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

router.post('/join', async (req, res) => {
    // let user = { ...req.body }   // let user = (req.body)     let user = req.body   다 결과는 똑같았다
    // const { userid, userpw, username, nickname, birth, gender, tell, email, address } = user

    //위2줄과 아랫줄은 똑같음
    //구조분해할당
    const { userid, userpw, username, nickname, birth, gender, tell, email, address } = { ...req.body }
    console.log(userid)
    // console.log(req.body.userid)
    try {
        const sql = `INSERT INTO user(userid, userpw, username, nickname, birth, gender, tell, email, address) values('${userid}' , '${userpw}' , '${username}' , '${nickname}' , '${birth}' , '${gender}' , '${tell}' , '${email}' , '${address}');`
        const prepare = []
        const [result] = await pool.execute(sql, prepare)
        // res.redirect('/user/welcome')
        //이걸원래 try문 맨밑에 55번째 줄에 입력해주었다 그랬더니 동일아이디입력, 폰번호 11자리 노입력 했을때  
        //이미 존재하는 아이디라고 뜨는게 아니라 핸드폰번호를 다시입력해달라고떳다 나는 에러코드 경고창을 먼저띄우고싶다
        //그래서 에러를 먼저읽어서 먼저 처리될수있게  맨위로 올려주었다

        if (tell.length != 11) {
            return res.send(alertmove('/user/join', '핸드폰번호를 다시입력해주세요'))
        } else if (userid.length === 0 || userpw.length === 0 || nickname.length === 0 || gender.length === 0 || tell.length === 0 || email.length === 0 || address.length === 0) {
            return res.send(alertmove('/user/join', '빠진정보없이 전부다 기입해주세요'))
        } else if (username.length === 0 || username.length === 1) {
            return res.send(alertmove('/user/join', '이름을 다시 입력해주세요'))
        } else if (birth.length != 6) {
            return res.send(alertmove('/user/join', '예시대로 생년월일을 다시 입력해주세요'))
        }

    } catch (error) {
        if (error.errno === 1062) {
            return res.send(alertmove('/user/join', '이미 존재하는 아이디입니다'))
        }
        console.log(error)
        // res.send(alertmove('/user/join', '입력한 정보를 확인해주세요.'))
    }
    return res.send(alertmove(`/user/welcome?userid=${userid}`, '환영합니다'))
})

router.get('/welcome', async (req, res) => {
    let userid = req.query.userid
    // console.log('userid : ',userid)
    const sql = `SELECT * FROM user WHERE userid = '${userid}';`
    const prepare = []
    const [result] = await pool.execute(sql, prepare)
    const [arr_out] = result
    // console.log('result : ',result)

    res.render('user/user_welcome', {
        content: arr_out,
    })
})

router.get('/login', (req, res) => {
    res.render('user/user_login')
})

router.post('/login', async (req, res) => {
    const { userid, userpw } = { ...req.body }
    console.log('userid:', userid)

    try {
        const sql = `SELECT * FROM user WHERE userid = '${userid}';`
        const prepare = []
        const [result] = await pool.execute(sql, prepare)
        // console.log('로그인한값: ', userid, userpw)
        const [arrout] = result //result를 못찾아서 콘솔에 찍어보니 []에 감싸져있어서 뺴주었다 
        // console.log(res)
        // result= result.userid 
        // console.log(result)
        // console.log('result :', res.userid, res.userpw)

        if (userid === '' || userpw === '') { 
            //처음엔 undefined라고 적어줬더니 안됬다 
            //그래서 브라우저에서 빈값으로 로그인해보니 undefined가 찍히지않고 빈값(userid: )이 찍혀서 빈값을 넣어주었다
            //그리고 나는 빈값과 로그인정보를 잘못적은건  catch로 가야된다고 생각했는데 아니였다
            //mysql에 SELECT * FROM user WHERE userid = ''; 이렇게 쳐주니까 Empty set (0.01 sec) 이렇게 떳고
            //SELECT * FROM user WHERE userid = undefined; 이렇게 쳐주니  ERROR 1054 (42S22) 이렇게 떳다
            //즉 빈값은  오류가 아니기때문에  try로 가야된다
            //그리고 아디,비번 확인후 입력(아디,비번틀렷을경우) 밑에 아디,비번입력해주세요(빈값일경우)를 적어주었더니 실행이 되지않아서 맨위로 옮겨주었다
            // console.log('아이디 비번을 적어주세요')
            res.send(alertmove('/user/login', '아이디와 비번을 입력해주세요'))   //비번또는 아이디를 빈값으로 적은경우
        } else if (arrout.userid === userid && arrout.userpw === userpw) {
            // console.log('로그인 적은게 db랑같아요.')
            // console.log(arrout)
            // const session_user = {
            //     userid: arrout.userid, 
            //     username: arrout.username, 
            //     nickname: arrout.nickname
            // }//세션에 넣을걸 userid, username, nickname을 정했고    
            //req.session.user = arrout.userid, arrout.username 이런식으로 
            //넣었는데 계속 전부다 나와서 이런식으로 따로 변수안에 넣어주었고
            //객체안에 넣어줘야 나중에 꺼내쓰기 쉬워서 객체안에 넣어주었고
            //arrout.userid 단순 이렇게가아닌   userid: arrout.userid 이렇게 써준이유는
            //key:value형태로 적어줘야 되서 이다


            // console.log('세션유저:',session_user)
            // req.session.user = session_user
            // req.session.user = arrout
            //분명히 맞게 적은거 같은데 
            //TypeError: Cannot set properties of undefined (setting 'user')
            //이런오류가 계속떳다
            //그래서 뒤에 result를  arrout으로 바까보았는데 그래도 안됬다...
            //알고보니 server.js에서 
            //app.use(session(sessionObj)) 이걸
            //app.use (router) 이거 밑에 적어서... 위로 올려주었다...
            
            // 한번더 sql에 접속해서 해당 id의 active를 확인.
            // 그 액티브가 1이면은 로그인 성공
            // 2면은 회원 정지됨

            if (arrout.active === 1) {
                const session_user = {
                    userid: arrout.userid, 
                    username: arrout.username, 
                    nickname: arrout.nickname
                }
                
                req.session.user = session_user
                res.send(alertmove('/', '로그인 성공'))
            } else if (arrout.active === 0) {
                res.send(alertmove('/','이용 정지된 회원입니다. 관리자에게 문의하세요.'))
            }
            //active를  쓰기위해서 139~150번째 코드를 작성해주었다
            //우선 로그인시 아디와 비번은 일치+active가 1이어야 로그인성공이 되므로
            //아디와 비번은 일치하는 곳에 코드를 작성해야된다
            //그곳에 active에 관한 조건을 추가해주기위해 안에 if 조건문을 써주었다
            //그리고 아디비번만 일치하면안되고 active도 1이어야 세션이 작동하도록 active코드안으로 session_user변수를 옮겨주었다
            
        } else if (userid === arrout.userid && userpw !== arrout.userpw){
            res.send(alertmove('/user/login', '비번을 다시입력해 주세요'))            //아디는 제대로, 비번을 틀리게
            //catch문에서는  아디, 비번둘다 또는 아디만 틀렸을경우는 작동을 하는데
            //비번만 틀린건 undefined가 아닌건지 작동이 안되서 여기에 코드를 입력해주었다
        }
        
        // else if (arrout.userid !== userid && arrout.userpw !== userpw) {
        //     // console.log('아이디 비번 둘 다 틀림')
        //     res.send(alertmove('/user/login', '아이디 또는 비번을 확인후 다시 입력해주세요'))
        // }
    } catch (error) {
        res.send(alertmove('/user/login', '아이디 또는 비번을 확인후 다시 입력해주세요'))           //아디랑 비번둘다틀리게, 비번은 제대로 아디만 틀리게
        
        //분명 try에서 작동이 되었었는데 오류가 뜨면서  undefined가 떳다...그래서 catch로 옮겨주니 잘됨
        console.log('뭐야:', error)
    }
    // res.redirect('/')
})

router.get('/profile', async (req, res) => {
    let userid = req.query.userid
    console.log(userid)
    const sql = `SELECT * FROM user WHERE userid = '${userid}';`
    const prepare = []
    const [result] = await pool.execute(sql,prepare)
    const [arr_out] = result
    console.log('result:',result)


    res.render('user/user_profile',{
        content:arr_out,
    })
})
//profile은 view처럼 회원가입시 정보를 보여주기만 하는거라 post필요없다
//profile은 로그인성공했을 시 보이게 

router.get('/update', async (req, res) => {
    let userid = req.query.userid

    // console.log('userid:',userid)
    const sql = `SELECT * FROM user WHERE userid = '${userid}';`
    const prepare = []
    const [result] = await pool.execute(sql,prepare)
    const [arr_out] = result
    console.log('result:',result)

    res.render('user/user_update',{
        content:arr_out,
        userid:userid
    })
})

router.post('/update', async (req, res) => {
    // let nickname = req.body.nickname
    // let address = req.body.address
    // let email = req.body.email
    // let tell = req.body.tell
    // let password = req.body.password
    // console.log(req.session.user.userid)
    const userid = req.session.user.userid
    //수정을 하고 수정하기 버튼을 눌렀을때  프로필에 아무값도 뜨지 않았다.  변경을 되었다
    //userid를 갖고오지 못하는 것같다 
    //html에서 쿼리에 유저아디를 넣어줬지만 안됬다..
    //그래서 session의 유저아디를 넣어줬더니 성공
    //근데 왜 전부다 수정되는거지...
    //그래서 update문뒤에  WHERE userid = '${userid}' 추가해줬더니 하나만 수정됨
    const {nickname, address, email, tell, userpw} = {...req.body}
    try{
    const sql = `UPDATE user set nickname = '${nickname}', address = '${address}', email = '${email}', tell = '${tell}', userpw = '${userpw}' WHERE userid = '${userid}';`
    const prepare = []
    const [result] = await pool.execute(sql,prepare)
    // console.log('result:',result)


    res.redirect(`/user/profile?userid=${userid}`)
    } catch (error){
        console.log(error)
    }
})


router.post('/member_secession', async (req, res) => {
    let userid = req.session.user.userid
    console.log('userid 있니:',userid)
    const sql = `DELETE FROM user WHERE userid = '${userid}';`
    const prepare =[]
    const [result] = await pool.execute(sql,prepare)
    console.log('result 있니:',result)

    req.session.destroy(() => {
        req.session
    });
    res.send(alertmove('/', '회원탈퇴가 완료되었습니다'))
})
//delete문으로 db에서 없애는것 성공
//근데 메인으로 돌아왔을때  로그아웃으로 떠서 세션도 없애주는 코드입력

module.exports = router