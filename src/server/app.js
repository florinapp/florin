const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const path = require('path')
const {Account} = require('./database')

const app = express()

// setup logger
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
// Serve static assets
app.use(cors())
// app.use(express.static(path.resolve(__dirname, '..', '..', 'build')))

// app.get('/test', (req, res) => {
//     Account.findAll().then((users) => {
//         console.log(users)
//     })
// })

app.get('/api/accounts', (req, res) => {
    res.json({
        accounts: [
            {
                name: 'Tangerine Investment Fund',
                type: 'TFSA',
                currentValue: 40325.93
            },
            {
                name: 'WealthSimple TFSA',
                type: 'TFSA',
                currentValue: 15699.35
            },
            {
                name: 'WealthBar RRSP',
                type: 'RRSP',
                currentValue: 16773.56
            }
        ]
    })
})

app.get('/api/charts/assets', (req, res) => {
    res.json({
        accounts: {
            'tif': 'Tangerine Investment Fund',
            'wb': 'WealthBar',
            'ws': 'WealthSimple'
        },
        data: [
            {
                date: "2015-01-01",
                tif: 10000
            },
            {
                date: "2015-01-10",
                tif: 10010,
                wb: 15000
            },
            {
                date: "2015-02-10",
                tif: 10030,
                wb: 15010,
                ws: 10010
            },
        ]
    })
})

// app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, '..', '..', 'build', 'index.html'))
// })

module.exports = app