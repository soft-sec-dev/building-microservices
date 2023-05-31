import express from 'express'
import { Express, Request, Response, RequestHandler } from 'express'
import http from 'node:http'
import morgan from 'morgan'
import { ServerApiVersion, MongoClient } from 'mongodb'

export default class RunApp {
    private app: Express = express()
    private PORT: undefined | number | string = process.env.PORT 
    // private videoPath = path.join(__dirname, "../videos/SampleVideo_1280x720_1mb.mp4")
    private VIDEO_STORAGE_HOST = process.env.VIDEO_STORAGE_HOST
    private VIDEO_STORAGE_PORT = parseInt(process.env.VIDEO_STORAGE_PORT as string)
    private DBHOST = process.env.DBHOST as string
    private DBNAME = process.env.DBNAME
    private cliente = new MongoClient('mongodb://db:27017')

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

    private listen() {
        this.app.listen(this.PORT, () => {
            console.log(`Running on: http://localhost:${this.PORT}/`)
        })
    }
    public async main() {
        try {
            await this.cliente.connect()
            const db = this.cliente.db('vide-streaming')
            await db.createCollection('users')
            console.log('Colleccioens creadas')
        } catch (err) {
            console.error('Error al conectar a mongodb', err)
        }
    }

}
// console.log(this.DBHOST)
// console.log(this.DBNAME)
// return mondodb.MongoClient.connect(this.DBHOST).then(cliente => {
//     const db = cliente.db(this.DBNAME)
//     const videoCollections = db.collection("videos")
//     this.app.get('/video', (req, res) => {
//         const videoID = new mondodb.ObjectId(req.query.id as string)
//         videoCollections.findOne({ _id: videoID }).then(videorecord => {
//             if (!videorecord) {
//                 res.status(404).send({ status: 'failed', msg: 'eror on video-colections_findOne' })
//                 return
//             }
//             const forwardRequest = http.request(
//                 {
//                     host: this.VIDEO_STORAGE_HOST,
//                     port: this.VIDEO_STORAGE_PORT,
//                     path: `/video?path=${videorecord.videoPath}`,
//                     method: "GET",
//                     headers: req.headers
//                 },
//                 forwardResponde => {
//                     res.writeHead(forwardResponde.statusCode as number, forwardResponde.headers)
//                     forwardRequest.pipe(res)
//                 }
//             )
//             req.pipe(forwardRequest)
//         }).catch(err => {
//             console.log('Database query failed')
//             console.log(err && err.stack || err)
//             res.sendStatus(500)
//         })
//     })
//     this.listen()
// })