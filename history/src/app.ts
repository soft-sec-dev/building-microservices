import express, { Express, Request, Response } from 'express'
import morgan from 'morgan'

export class HistoryApp {
    private app: Express = express()
    constructor() {
        this.initilizeMiddelwares()
    }

    private initilizeMiddelwares(): void {
        this.app.use(express.json())
        this.app.use(morgan('dev'))
    }

    private setupHandlers(app: Express) {

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