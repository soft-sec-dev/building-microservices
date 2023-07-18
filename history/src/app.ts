import express, { Express, Request, Response } from 'express'
import morgan from 'morgan'
import { Db, MongoClient, ReturnDocument } from 'mongodb'
import mongodb from 'mongodb'
export class HistoryApp {
    private app: Express = express()
    private DBHOST = process.env.DBHOST as string
    private DBNAME = process.env.DBNAME
    private client = new MongoClient(`${this.DBHOST}`)
    private collections:any
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

    private startHttpServer(db:Db): Promise<unknown> {
        return new Promise<void>((resolve, reject) => {
            this.setupHandlers(this.app, db)
            const port = process.env.PORT || 4003
            this.app.listen(port, () => {
                resolve()
            })
        })
    }

    public async main() {
        try{
            await this.client.connect()
            const db = this.client.db(`${this.DBNAME}`)
            this.collections = db.collection('videos')
        }catch(err){
            console.log('Error al conectarse a mondodb en HISTORY', err)
        }
    }
}