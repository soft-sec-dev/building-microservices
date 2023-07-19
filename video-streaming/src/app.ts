import express from 'express'
import { Express, Request, Response, RequestHandler } from 'express'
import http from 'node:http'
import morgan from 'morgan'
import { MongoClient, ObjectId, Collection, Document } from 'mongodb'
import fs from 'node:fs'

export default class RunApp {
    private app: Express = express()
    private PORT: undefined | number | string = process.env.PORT || 3000
    // private videoPath = path.join(__dirname, "../videos/SampleVideo_1280x720_1mb.mp4")
    private VIDEO_STORAGE_HOST = process.env.VIDEO_STORAGE_HOST
    private VIDEO_STORAGE_PORT = parseInt(process.env.VIDEO_STORAGE_PORT as string)
    private DBHOST = process.env.DBHOST as string
    private DBNAME = process.env.DBNAME
    // private cliente = new MongoClient(`${this.DBHOST}`)
    private collections: any

    private videoPath = "./videos/SampleVideo_1280x720_1mb.mp4";

    constructor() {
        this.initializeMiddlewares()
    }

    private initializeMiddlewares() {
        this.app.use(morgan('dev'))
        this.app.use(express.json())
    }
   
    private sendViewedMessage(videoPath:string){
        const postOptions = { // Options to the HTTP POST request.
            method: "POST", // Sets the request method as POST.
            headers: {
                "Content-Type": "application/json", // Sets the content type for the request's body.
            },
        };
    
        const requestBody = { // Body of the HTTP POST request.
            videoPath: videoPath 
        };
    
        const req = http.request( // Send the "viewed" message to the history microservice.
            "http://history:4002/viewed",
            postOptions
        );
    
        req.on("close", () => {
            console.log("Sent 'viewed' message to history microservice.");
        });
    
        req.on("error", (err) => {
            console.error("Failed to send 'viewed' message!");
            console.error(err && err.stack || err);
        });
    
        req.write(JSON.stringify(requestBody)); // Write the body to the request.
        req.end(); // End the request.
    }

    private setupHandlers(app:Express){
        app.get('/', (req,res)=>{
            res.send({data:'nothing for now', msg:'ok'})
        })
        app.get("/video", (req, res) => { // Route for streaming video.

            const videoPath = "./videos/SampleVideo_1280x720_1mb.mp4";
            fs.stat(videoPath, (err, stats) => {
                if (err) {
                    console.error("An error occurred ");
                    res.sendStatus(500);
                    return;
                }
        
                res.writeHead(200, {
                    "Content-Length": stats.size,
                    "Content-Type": "video/mp4",
                });
        
                fs.createReadStream(videoPath).pipe(res);
    
                this.sendViewedMessage(videoPath); // Send message to "history" microservice that this video has been "viewed".
            });
        });
    }

    public startHttpServer(){
        return new Promise(resolve => { // Wrap in a promise so we can be notified when the server has started.
            const app = express();
            this.setupHandlers(app);
            
            const port = process.env.PORT && parseInt(process.env.PORT) || 3000;
            app.listen(port, () => {
                resolve(String);
            });
        });
    }

    public main(){
        return this.startHttpServer()
    }
}