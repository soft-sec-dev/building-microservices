import express from 'express'
import { Express, Request, Response, RequestHandler } from 'express'
import http from 'node:http'
import morgan from 'morgan'
import { MongoClient, ObjectId, Collection, Document } from 'mongodb'

export default class RunApp {
    private app: Express = express()
    private PORT: undefined | number | string = process.env.PORT
    // private videoPath = path.join(__dirname, "../videos/SampleVideo_1280x720_1mb.mp4")
    private VIDEO_STORAGE_HOST = process.env.VIDEO_STORAGE_HOST
    private VIDEO_STORAGE_PORT = parseInt(process.env.VIDEO_STORAGE_PORT as string)
    private DBHOST = process.env.DBHOST as string
    private DBNAME = process.env.DBNAME
    private cliente = new MongoClient(`${this.DBHOST}`)
    private collections: any

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
            console.log(req.query.id)
            const videoId = new ObjectId('64789cb59125d1364a520a76')
            console.log(`Video id has been created: ${videoId}`)
            this.collections.findOne({ _id: videoId }).then((videoRecord: any) => {
                if (!videoRecord) {
                    res.status(500).send({ status: 'failed', msg: 'error on findone collectios' })
                    return
                }
                const forwardRequest = http.request({
                    host: this.VIDEO_STORAGE_HOST,
                    port: this.VIDEO_STORAGE_PORT,
                    path: `/video?path${videoRecord.videoPath}=`,
                    method: 'GET',
                    headers: req.headers
                },
                    forwardResponse => {
                        res.writeHead(forwardResponse.statusCode as number, forwardResponse.headers)
                        forwardResponse.pipe(res)
                    }
                )
                req.pipe(forwardRequest)
            })

        })
    }
    public sendViewedMessage(videoPath: any) {
        const postOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            }
        }
        const requestBody = {
            videoPath: videoPath
        }
        const req = http.request(  //? Request like {axios, fetch - just a way to comunicate miceroservices}
            "http://history/viewed",
            postOptions
        )
        req.on("close", () => { })
        req.on("error", (err) => { })
        req.write(JSON.stringify(requestBody)) //? Enviar el video, por medio del req.body
        req.end()
    }

    private listen() {
        this.app.listen(this.PORT, () => {
            console.log(`Running on: http://localhost:${this.PORT}/`)
        })
    }
    public async main() {
        try {
            await this.cliente.connect()
            const db = this.cliente.db(`${this.DBNAME}`)
            this.collections = db.collection('videos')

            this.listen()
            console.log('Colleccioens creadas')
        } catch (err) {
            console.error('Error al conectar a mongodb', err)
        }
    }

}