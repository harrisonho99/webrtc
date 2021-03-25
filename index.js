const express =require("express")
const ejs =  require("ejs")
const app = express()
// ejs engine
app.set("view engine", "ejs")
// serse static
app.use(express.static("public"))
// render page
app.use("/" , (req, res )=>{
    res.render("index")
})
// init
app.listen(8080)