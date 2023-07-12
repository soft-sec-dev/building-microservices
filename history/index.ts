import { HistoryApp } from "./src/app";

const historyApp = new HistoryApp()

historyApp.main().then(() => console.log('Microservice-History online indexando'))
    .catch(err => {
        console.log("Microservices failed to start")
        console.log(err && err.stack || err)
    })