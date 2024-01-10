import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit: "16kb"}))
// specifically handles json data only
// express.json --> enables parsing of incoming request bodies in json format
// when client sends the data in json format to the server
// this middleware will parse the payload make it accessible in req.body
// this limit mitigate the risk of potential attack using large payload
// basically preventing the denial of service

app.use(express.urlencoded({extended: true, limit: "16kb"}))
// specifically handles url encoded data
// url encoded data --> example -> name=John+Doe&age=30
// makes the url encoded data available to req.body
// extended option when set to true, enables parsing of url-encoded data
// with complex structure like arrays and nested objects
// limit is just restrictive size for security reasons 


app.use(express.static("public"))
// middleware used to serve static files

app.use(cookieParser())
// used for enable cookie parsing for incoming requests
// middleware parses the 'cookie' from incoming header requests
// it decodes the cookie information and creates a 'cookies' object containing 
// key-value pair of parsed cookies




export { app }