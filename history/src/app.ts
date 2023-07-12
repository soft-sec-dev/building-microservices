import express, { Express, Request, Response } from 'express'
import morgan from 'morgan'
import { Db } from 'mongodb'
export class HistoryApp {
    private app: Express = express()
    constructor() {
        this.initilizeMiddelwares()
    }

    private initilizeMiddelwares(): void {
        this.app.use(express.json())
        this.app.use(morgan('dev'))
    }

    private setupHandlers(app: Express, db:Db) {
        const videosCollectios = db.collection("videos")
        this.app.post('viewed', (req,res)=>{
            const videoPath = req.body.videoPath
            videosCollectios
                .insertOne({videoPath:videoPath})
                    .then(()=>{
                        console.log(`Added video ${videoPath} to history`)
                        res.status(200).json({data:videoPath, status:'succes'})
                    })
                    .catch(err=>{
                        console.log(`Error adding video ${videoPath} to history`)
                        console.error(err && err.stack || err)
                        res.sendStatus(500)
                    })
        })
    }
    private startHttpServer(): Promise<unknown> {
        return new Promise<void>((resolve, reject) => {
            this.setupHandlers(this.app)
            const port = process.env.PORT || 4003
            this.app.listen(port, () => {
                resolve()
            })
        })
    }

    public main(): Promise<unknown> {
        console.log("Hello Wolrd 2")
        return this.startHttpServer()
    }
}