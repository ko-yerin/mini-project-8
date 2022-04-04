const express = require('express')
const router = express.Router()
const {pool} = require('../../db')

router.get('/list', async(req,res) => {
    const sql = `SELECT * FROM board order by idx DESC;`
    const prepare = []
    const [result] = await pool.execute(sql,prepare)

    let list = result
    console.log(list)
    
    
    res.render('board/board_list', { content : list }) 
})

router.get('/write',(req,res) => {
    const {nickname} = req.body
    res.render('board/board_write', {nickname})
})

router.post('/write',async(req,res) => {
    const {subject,story,nickname} = req.body
    const conn = await pool.getConnection()
    try {
        const [result] = await conn.query(
        `INSERT INTO board(subject, story, nickname)
        values('${subject}', '${story}', '${nickname}')`
        )
        console.log(result)
        res.redirect('/board/list')

    } catch(error){
        console.log(error)

    } finally{
        conn.release()
    }
})

router.get('/view',async(req,res) => {
    const idx = req.query.idx
    console.log(req.query)

    const conn = await pool.getConnection()
    try {
        const sql = `SELECT * FROM board WHERE idx = '${idx}'`
        const [view_db] = await conn.query(sql)
        res.render('board/board_view.html', {view_db:view_db[0]})
    } catch(error){
        console.log(error)
    } finally{
        conn.release()
    }
})

router.get('/update',async(req,res) => {
    const idx = req.query.idx
    const conn = await pool.getConnection()
    try {
        const [result] = await conn.query(
            `SELECT * FROM board WHERE idx = '${idx}'`
        )
        res.render('board/board_update', {update_db:result[0]})
    } catch(error){
        console.log(error)
    } finally{
        conn.release()
    }
})

router.post('/update',async(req,res) => {
    let idx = req.body.idx
    let subject = req.body.subject
    let nickname = req.body.nickname
    let story = req.body.story

    const conn = await pool.getConnection()
    try {
        const sql = `UPDATE board
        set subject = '${subject}', nickname = '${nickname}', story = '${story}'
        WHERE idx = '${idx}'`
        await conn.query(sql)
        res.redirect('/board/list')
    } catch(error){
        console.log(error)
    } finally{
        conn.release()
    }
})

router.get('/delete',async(req,res) => {
    const {idx} = req.query
    const conn = await pool.getConnection()
    try {
        const sql = `DELETE FROM board WHERE idx = '${idx}'`
        const [result] = await conn.query(sql)
        res.redirect('/board/list')
    } catch(error){
        console(error)
    } finally{
        conn.release()
    }
})




module.exports = router