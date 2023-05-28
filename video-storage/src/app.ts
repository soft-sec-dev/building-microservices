import express, { Express } from 'express'
import morgan from 'morgan'
import azure from 'azure-storage'

export default class VideoStorage {
    private app: Express = express()
    private PORT = process.env.PORT
    private STORAGE_ACCOUNT_NAME = process.env.STORAGE_ACCOUNT_NAME as string
    private STORAGE_ACCESS_KEY = process.env.STORAGE_ACCESS_KEY as string
    constructor() {
        this.initializeMiddlewares()
        this.initializeRoutes()
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
            const videoPath = 'SampleVideo_1280x720_1mb.mp4'
            const blodService = this.createBlobService()
            const containerName = 'videos'
            blodService.getBlobProperties(containerName, videoPath, (err, properties) => {
                if (err) {
                    res.sendStatus(500);
                    return;
                }
                res.writeHead(200, {
                    "Content-Length": properties.contentLength,
                    "Content-Type": "video/mp4",
                });
                blodService.getBlobToStream(containerName, videoPath, res, err => {
                    if (err) {
                        // ... error handling ...
                        res.sendStatus(500);
                        return;
                    }
                })
            })
        })
    }

    private createBlobService(): azure.BlobService {
        const blodService = azure.createBlobService(this.STORAGE_ACCOUNT_NAME, this.STORAGE_ACCESS_KEY)
        return blodService
    }
    public listen() {
        this.app.listen(this.PORT, () => {
            console.log(`http://localhost:${this.PORT}/`)
        })
    }
}