const express = require('express')
const router = express.Router()
const {pool} =require('../../db')

router.get('/',(req,res)=>{ 
    // localhost:4000/admin
    res.render('admin/admin.html')
})

router.post('/', async(req,res)=>{
    const {userid,userpw} = req.body
    console.log(req.body)
    const conn = await pool.getConnection()
    try {
        const sql = `SELECT * FROM user WHERE userid = '${userid}' AND userpw= '${userpw}' AND level='1'`
        const [result] = await conn.query(sql);
        if (result.length !==0) {
            req.session.userid = result[0].userid
            res.redirect('admin/list')
        } else {
            res.send(alertmove('admin','Check your ID or Password'))
        }
    } catch (error) {
        console.log(error)
    } finally {
        conn.release()
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

router.get('/userList',(req,res)=>{
    res.render('admin/user_list')
})

router.get('/userUpdate',(req,res)=>{
    res.render('admin/user_update')
})

router.get('/userView',(req,res)=>{
    res.render('admin/user_view')
})

router.post('/userUpdate',(req,res)=>{
    res.redirect('admin/user_list')
})




module.exports = router