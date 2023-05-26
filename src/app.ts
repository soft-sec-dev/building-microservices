import express from 'express'
import { Express, Request, Response, RequestHandler } from 'express'
import fs from 'node:fs'
import morgan from 'morgan'
import path from 'node:path'

export default class RunApp {
    private app: Express = express()
    private PORT: undefined | number | string = process.env.PORT || 3000
    private videoPath = path.join(__dirname, "../videos/SampleVideo_1280x720_1mb.mp4")

    constructor() {
        this.initializeMiddlewares()
        this.initializeRoutes()
    }

    private initializeMiddlewares() {
        this.app.use(morgan('dev'))
        this.app.use(express.json())
    }

    private initializeRoutes() {
        this.app.get('/', (req, res) => {
            res.json({ status: 'succes' })
        })
        this.app.get('/videos', (req, res) => {
            fs.stat(this.videoPath, (err, stats) => {
                if (err) {
                    console.log(err)
                    res.status(500).send('Error on load video')
                    return
                }
                res.writeHead(200, {
                    "Content-Length": stats.size,
                    "Content-Type": "video/mp4",
                })
                fs.createReadStream(this.videoPath).pipe(res)
            })
        })  
    }

    public listen() {
        this.app.listen(this.PORT, () => {
            console.log(`Running on: http://localhost:${this.PORT}/`)
        })
    }
}