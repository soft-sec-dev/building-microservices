import RunApp from "./src/app";

const app = new RunApp()
app.main()
    .then(() => { console.log('Microservices is running') })
    .catch(err => {
        console.log("Microservices failed to load")
        console.log(err && err.stack || err)
    })