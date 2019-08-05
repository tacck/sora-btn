'use strict'

// Express
const express = require('express')
const app = express()
const http = require('http').createServer(app)
app.use(express.json())

const PORT = process.env.PORT || 5000
const DB = process.env.DB || 'localhost'
const DB_USER = process.env.DB_USER || "mysql"
const DB_PASSWORD = process.env.DB_PASSWORD || null
const DB_NAME = process.env.DB_NAME || "sora-btn-db"
const IMSI = process.env.IMSI || null

if (DB_PASSWORD === null) {
    return 1
}
if (IMSI === null) {
    return 2
}

// Socket.IO
const io = require('socket.io')(http)

// MySQL
const mysql = require('mysql')
const connection = mysql.createConnection({
    host: DB,
    port: 3306,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME
})

// Socket.IO
io.on('connection', function (socket) {
    console.log('a user connected')
    socket.on('disconnect', function () {
        console.log('user disconnected')
    })
})

// Web Path
app.post('/api/button/position', function (req, res) {
    // Check IMSI
    const imsi = req.headers['x-soracom-imsi']
        ? req.headers['x-soracom-imsi']
        : null
    if (!imsi || imsi !== IMSI) {
        res.send('{}')
    }

    const coordinateString = req.headers['x-soracom-geo-position']
        ? req.headers['x-soracom-geo-position'].split(';')
        : []
    if (coordinateString.length === 2) {
        const coordinate = []
        for (const value of coordinateString) {
            coordinate.push(parseFloat(value))
        }
        const sql = "INSERT INTO current_position (latlng, created_at) VALUES (ST_GeomFromText('POINT(? ?)', 4326), now())"

        connection.query(sql, coordinate, (error, results, fields) => {
            if (error) {
                console.log(error)
            } else {
                const data = {
                    latitude: coordinate[0],
                    longitude: coordinate[1],
                    insertId: results.insertId
                }
                io.emit('getButtonPosition', JSON.stringify(data))
            }
        })
    }
    res.send('{}')
})

app.get('/api/distance', async function (req, res) {
    const sql = "SELECT \
        ST_DISTANCE( \
            ( \
                SELECT \
                    latlng \
                FROM \
                    current_position \
                ORDER BY created_at DESC \
                LIMIT 1 \
            ), \
            ST_GEOMFROMTEXT('POINT(? ?)', 4326) \
        ) AS distance \
    "

    const coordinate = [parseFloat(req.query.latitude), parseFloat(req.query.longitude)]
    // console.log(coordinate)

    await connection.query(sql, coordinate, (error, results, fields) => {
        if (error) {
            console.log(error)
        } else {
            // console.log(JSON.stringify(results))
            res.send(`{"distance": ${results[0].distance}}`)
        }
    })
})

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/check-soracom-button/dist/index.html')
})

app.get('/:fileName', function (req, res) {
    res.sendFile(__dirname + '/check-soracom-button/dist/' + req.params.fileName)
})
app.get('/css/:fileName', function (req, res) {
    res.sendFile(__dirname + '/check-soracom-button/dist/css/' + req.params.fileName)
})
app.get('/js/:fileName', function (req, res) {
    res.sendFile(__dirname + '/check-soracom-button/dist/js/' + req.params.fileName)
})

// Web Listen
http.listen(PORT, function () {
    console.log(`listening on *:${PORT}`)
})
