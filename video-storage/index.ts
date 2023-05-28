import express, { Express } from 'express'
import morgan from 'morgan'

class VideoStorage {
    private app: Express = express()
    constructor() {
        this.initializeMiddlewares()
    }

    private initializeMiddlewares() {
        this.app.use(express.json())
        this.app.use(morgan('dev'))
    }
    private initializeRoutes() {
        this.app.get('/', (req, res) => {
            res.status(200).json({ status: 'ok', msg: 'hello from video-storage' })
        })
        this.app.get('/video', (req, res) => {

        })
    }
}