const express = require('express')
const { alertmove } = require('../../util/alertmove')
const router = express.Router()
const {pool} =require('../../db')

router.get('/',(req,res)=>{
    const { user } = req.session
    if (user !== undefined) {
        res.send(alertmove('/', '접근할 수 없습니다.'))
    } else {
        res.render('admin/admin.html')
    }
})

// router.post('/',async(req,res)=>{
//     const {userid, userpw} = req.body;
//     const sql = `SELECT userid, userpw FROM user WHERE userid=? AND userpw=? AND level=1`;
//     const prepare = [userid, userpw];
//     const [result] = await pool.execute(sql, prepare);
//     let result2;
//     if (result.length === 1){
//         req.session.user = result[0].userid;
//         result2 = {user:req.session.user};
//         res.send(result2);

//     } else {
//         req.session.destroy(()=>{
//             req.session
//         })
//         res.send('Login Fail');
//     }
// })
   

router.post('/',async(req,res)=>{
    const { userid, userpw } = req.body;
    const conn = await pool.getConnection();
    try {
        const sql = `SELECT * FROM user WHERE userid = "${userid}" AND userpw = "${userpw}"`
        const [result] = await conn.query(sql)
        if (result.length !== 0) {
            if (result[0].level > 1) {
                res.send(alertmove('/admin', '접근권한이 없습니다.'));
            } else {
                req.session.admin = result[0];
                res.redirect('/admin/userList')
            }
        } else {
            res.send(alertmove('/admin', '존재하지 않는 계정입니다.'));
        }
    } catch(error){
        console.log(error)
    } finally {
        conn.release()
    }
})   

router.get('/userList',async(req,res)=>{
    console.log("userlist session: " ,req.session)
    if(!req.session.admin) {
        res.send("로그인을 하세요")
        return
    }
    const conn = await pool.getConnection();
    try {
        const[content] = await conn.query(
            `SELECT level, userid, username, nickname,
                    birth, address, gender, tell,
                    email, active
                    FROM user`
        )
        res.render('admin/user_list',{content})
    } catch (error){
        console.log(error)
    } finally {
        conn.release();
    }
})


router.get('/userUpdate',async(req,res)=>{
    const userid = req.query.userid
    console.log(userid)
    const conn = await pool.getConnection();
    try {
       
        const content = await conn.query(
    
            `SELECT * FROM user where userid=?`,[userid]
        )
        console.log(content[0])
        res.render('admin/user_update',{content:content[0][0]})
    } catch (error){
        console.log(error)
    } finally {
        conn.release();
    }
})

router.post('/userUpdate',async(req,res)=>{
    const {userid,username,nickname,tell,gender,address,birth,email} = req.body
    console.log("username : ", username)
    const conn = await pool.getConnection();
    try {     
        const content = await conn.query( 
            `UPDATE user 
            set username = '${username}', nickname= '${nickname}',
                tell = '${tell}',address = '${address}',
                birth = '${birth}', email = '${email}'
            where userid=?`,[userid]
        )
        console.log(content)
        res.redirect('/admin/userList')
    } catch (error){
        console.log(error)
    } finally {
        conn.release();
    }
})


router.post('/userLevelUpdate',async(req,res)=>{
    const {level,userid,active} = req.body
    console.log("level : ", level,userid)
    const conn = await pool.getConnection();
    try {     
        const content = await conn.query( 
            `UPDATE user set level=?,active=? where userid=?`,[level,active,userid]
        )
        console.log(content)
        res.redirect('/admin/userList')
    } catch (error){
        console.log(error)
    } finally {
        conn.release();
    }
})

router.post('/userActiveUpdate',async(req,res)=>{
    const {userid,active} = req.body
    const conn = await pool.getConnection();
    try {     
        const content = await conn.query( 
            `UPDATE user set active=0 where userid=?`,[userid]
        )
        console.log(content)
        res.redirect('/admin/userList')
    } catch (error){
        console.log(error)
    } finally {
        conn.release();
    }
})


router.get('/userView',async (req,res)=>{
    const userid = req.query.userid
    console.log(userid)
    const conn = await pool.getConnection();
    try {
       
        const content = await conn.query(
    
            `SELECT * FROM user where userid=?`,[userid]
        )
        console.log(content[0])
        res.render('admin/user_view',{content:content[0][0]})
    } catch (error){
        console.log(error)
    } finally {
        conn.release();
    }
})



router.get('/boardView',(req,res)=>{

    res.render('admin/board_view')
})

router.get('/boardList',(req,res)=>{
    
    res.render('admin/board_list')

})

router.get('/boardUpdate',(req,res)=>{
    res.render('admin/board_update')

})

router.post('/boardDelete',(req,res)=>{
    res.redirect('admin/board_list')
})

module.exports = router