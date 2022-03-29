require('dotenv').config()
const mysql = require('mysql2')

const host = process.env.DB_HOST || 'localhost'
const user = process.env.DB_USER || 'hyun'
const password = process.env.DB_PASSWORD || 'hyun'
const database = process.env.DB_DATABASES || 'project8'

const config = {host,user,password,database}
const pool = mysql.createPool(config)
const promisepool = pool.promise()

exports.pool = promisepool