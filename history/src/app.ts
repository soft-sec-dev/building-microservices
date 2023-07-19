import express, { Express, Request, Response } from 'express'
import morgan from 'morgan'
import mongodb,{Db, MongoClient} from 'mongodb'
export class HistoryApp {
    private app: Express = express()
    private port = process.env.PORT || 4003
    private DBHOST = process.env.DBHOST as string
    private DBNAME = process.env.DBNAME
    // private client = new MongoClient(`${this.DBHOST}`)
    // private collections:any
    constructor() {
        this.initilizeMiddelwares()
    }

    private initilizeMiddelwares(): void {
        this.app.use(express.json())
        this.app.use(morgan('dev'))
    }

    private setupHandlers(app: Express, db:Db) {
        const videosCollectios = db.collection("videos")

        this.app.get('/', (req,res)=>{
            res.status(200).json({data:'nothing for now', msg:'ok'})
        })
    
        this.app.post('/viewed', (req,res)=>{
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
        this.app.get('/history', (req,res)=>{
            const skip = parseInt(req.query.skip as string)
            const limit = parseInt(req.query.limit as string)
            videosCollectios.find()
                .skip(skip)
                .limit(limit)
                .toArray()
                .then(documentos => {
                    res.json({history: documentos})
                }).catch(err =>{
                    console.error(`Error retrieving from database`)
                    console.error(err && err.stack || err)
                    res.status(500)
                })
        }) 
    }
    private async conectDB(){
        try{
            const db = new MongoClient(this.DBHOST)
            return db.db()
        } catch(err){
            console.error('Error al conectarse a la base de datps')
            process.exit(1)
        }
    }

    private startHttpServer(db:Db) {
        this.setupHandlers(this.app, db)
        this.app.listen(this.port, () => {
            console.log(`History runnin on: http://localhost:${this.port}/`)
        })
    }
    
    public async main() {
        return this.conectDB()
        .then(db =>{
            this.startHttpServer(db)
        }).catch(err =>{
            console.error("Microservice failed to start.");
            console.error(err && err.stack || err);
        })
    }
}