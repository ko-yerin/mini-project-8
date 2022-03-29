const express = require('express')
const router = express.Router()
const {pool} = require('../../db')

router.get('/list', async(req,res) => {
    const sql = `SELECT * FROM board order by idx DESC;`
    const prepare = []
    const [result] = await pool.execute(sql,prepare)

    let list = result
    console.log(list)

    res.render('board/board_list',{ 
        content:list
    })
    
})








module.exports = router