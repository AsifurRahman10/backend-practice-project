import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from './app.js'

dotenv.config({
    path: './env'
})

connectDB()
    .then(
        app.listen(process.env.PORT || 8000, () => {
            console.log("Server is running");
        })
    )
    .catch(err => {
        console.log('MongoDB connection failed', err);
    })



































/*
// create express app
const app = express()
// connect db
(async () => {
    try {
        mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        app.on("Error", (err) => {
            console.log("Err", err);
            throw err
        })

        app.listen(process.env.PORT, () => {
            console.log(`App is running on port" ${process.env.PORT}`);
        });
    } catch (error) {
        console.log("Error", error);
        throw error
    }
})()
    */