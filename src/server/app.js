const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const path = require('path')

const app = express()

// setup logger
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
// Serve static assets
app.use(cors())
// app.use(express.static(path.resolve(__dirname, '..', '..', 'build')))

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
        data: [
            {
                "date": "2015-01-01",
                "amount": 19203.12
            },
            {
                "date": "2016-01-01",
                "amount": 23107.34
            },
            {
                "date": "2017-01-01",
                "amount": 22357.43
            }
        ]
    })
})

// app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, '..', '..', 'build', 'index.html'))
// })

module.exports = app