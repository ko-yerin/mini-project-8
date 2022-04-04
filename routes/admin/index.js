const express = require('express')
const router = express.Router()

const {pool} =require('../../db')



// router.get('/',(req,res)=>{ 
//     res.render('admin/admin.html')
// })

// router.post('/', async(req,res)=>{
//     const {userid,userpw} = req.body
//     console.log(req.body)
//     const conn = await pool.getConnection()
//     try {
//         const sql = `SELECT * FROM user WHERE userid = '${userid}' AND userpw= '${userpw}' AND level='1'`
//         const [result] = await conn.query(sql);
//         if (result.length !==0) {
//             req.session.userid = result[0].userid
//             res.redirect('admin/list')
//         } else {
//             res.send(alertmove('admin','Check your ID or Password'))
//         }
//     } catch (error) {
//         console.log(error)
//     } finally {
//         conn.release()
//     }
// })

router.get('/',(req,res)=>{
    const { user } = req.session
    if (user !== undefined) {
        res.send(alertmove('/', '접근할 수 없습니다.'))
    } else {
        res.render('admin/admin.html')
    }
})

// router.post('/',async(req,res)=>{
//     const { userid, userpw } = req.body;
//     const conn = await pool.getConnection();
//     try {
//         const sql = `SELECT * FROM user WHERE userid = "${userid}" AND userpw = "${userpw}"`
//         const [result] = await conn.query(sql)
//         if (result.length !== 0) {
//             if (result[0].level > 2) {
//                 res.send(alertmove('/admin', '접근권한이 없습니다.'));
//             } else {
//                 req.session.admin = result[0];
//                 res.redirect('/')
//             }
//         } else {
//             res.send(alertmove('/admin', '존재하지 않는 계정입니다.'));
//         }

//     } catch(error){
//         console.log(error)
//     } finally {
//         conn.release()
//     }
    
// })   

router.get('/userList',async(req,res)=>{
    const conn = await pool.getConnection();
    try {
        const[content] = await conn.query(
            `SELECT level, userid, username, nickname,
                    birth, address, gender, tell,
                    email
                    FROM user`
        )
        res.render('admin/user_list',{content})
    } catch (error){
        console.log(error)
    } finally {
        conn.release();
    }
})

router.get('/userUpdate',(req,res)=>{
    res.render('admin/user_update')
})

router.post('/userUpdate',(req,res)=>{
    res.redirect('admin/user_list')
})

router.get('/userView',(req,res)=>{

    res.render('admin/user_view')
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