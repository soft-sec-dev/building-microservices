import express from 'express'
import { Express, Request, Response, RequestHandler } from 'express'
import http from 'node:http'
import morgan from 'morgan'
import path from 'node:path'

export default class RunApp {
    private app: Express = express()
    private PORT: undefined | number | string = process.env.PORT 
    // private videoPath = path.join(__dirname, "../videos/SampleVideo_1280x720_1mb.mp4")
    private VIDEO_STORAGE_HOST = process.env.VIDEO_STORAGE_HOST
    private VIDEO_STORAGE_PORT = parseInt(process.env.VIDEO_STORAGE_PORT as string)

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
        this.app.get('/video', (req, res) => {
            const forwardRequest = http.request({
                host: this.VIDEO_STORAGE_HOST,
                port: this.VIDEO_STORAGE_PORT,
                path: '/video?path=SampleVideo_1280x720_1mb.mp4',
                method: 'GET',
                headers: req.headers
            },
                forwardResponse => {
                    res.writeHead(forwardResponse.statusCode as number, forwardResponse.headers)
                    forwardResponse.pipe(res)
                })
            req.pipe(forwardRequest)
        })  
    }

    public listen() {
        this.app.listen(this.PORT, () => {
            console.log(`Running on: http://localhost:${this.PORT}/`)
        })
    }
}