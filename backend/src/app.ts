import express  from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import bodyParser from "body-parser"
import { bookRouter } from "./routes/book.routes"

dotenv.config()


// Usameos express para el midleware
const app = express()
app.use(bodyParser.json())  // Parsea el body que recibe


//Connect to BBDD
const mongoUrl = process.env.MONGO_URL;
const dbName = process.env.MONGO_DEB_NANE;

if (!mongoUrl || !dbName) {
  throw new Error('Missing MONGO_URL or MONGO_DEB_NANE in environment variables');
}

mongoose.connect(mongoUrl, { dbName: dbName})
const db = mongoose.connection

app.use('/api/books', bookRouter)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server Running at PORT ${PORT}`)
}).on("error", (err) => {
    throw new Error(err.message);
})

