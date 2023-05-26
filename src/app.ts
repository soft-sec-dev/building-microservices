import express from 'express'
import { Express, Request, Response, RequestHandler } from 'express'

export default class RunApp {
    private app: Express = express()
    private PORT: undefined | number | string = process.env.PORT || 3000

    constructor() {
        this.initializeMiddlewares()
        this.initializeRoutes()
    }

    private initializeMiddlewares() {
        this.app.use(express.json())
    }

    private initializeRoutes() {
        this.app.get('/', (req, res) => {
            res.json({ status: 'succes' })
        })
    }

    public listen() {
        this.app.listen(this.PORT, () => {
            console.log(`Running on: http://localhost:${this.PORT}/`)
        })
    }
}