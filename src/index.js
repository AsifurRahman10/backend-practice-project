import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({
    path: './env'
})

connectDB()



































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