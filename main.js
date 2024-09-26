const express = require("express") // Initializing the express
const jwt = require('jsonwebtoken') // 
const dotEnv = require("dotenv") //
const ejs = require('ejs')

const app = express() // assigning to app

const PORT = 4000 // Creating port value
app.use(express.json()) //config
dotEnv.config() // config
app.set('view engine', 'ejs')// config ejs
app.use(express.urlencoded({extended: true}))


// importing secret key from .env file
const secretKey = process.env.mySecretKey

// creating users
const users = [{
    id:"1",
    username:"Hemanthsai",
    password:"Sai",
    isAdmin:true
},
{
    id:"2",
    username:"naveen",
    password:"naveen",
    isAdmin:false
}]

// creating middleware for deleting method
const verifyUser = (req,res,next)=>{
    const userToken = req.headers.authorization
    if(userToken){
       const token =  userToken.split(" ")[1]
       jwt.verify(token, secretKey, (err,user)=>{
        if(err){
            return res.status(403).json({err:"token is not valid"})
        }
        req.user = user
        next() // next method used for middle
       })
    }else{
        res.status(401).json("your are not authenticated")
    }
}

// creating routes for POST Method
app.post('/api/login',(req,res)=>{ // post method
    const {username, password} = req.body; // user details

    const user = users.find((person)=>{ // find method
        return person.username === username && person.password === password

    
    })
    if(user){
        const accessToken = jwt.sign({ //sign method 
            id:user.id, 
            username:user.username,
            isAdmin:user.isAdmin
           
        },secretKey)
        res.json({
            username:user.username,
            isAdmin:user.isAdmin,
            accessToken
        })
    }else{
        res.status(401).json("user credential not matched")
    }


})

// creating Routes for Delete Method and based user id we can delete

app.delete('/api/users/:userId',verifyUser,(req,res)=>{
    if(req.user.id === req.params.userId || req.user.isAdmin){
        res.status(200).json("user is deleted successfully")
    }
    else{
        res.status(401).json("you are not allowed to delete ")
    }
})

// creating routes for get  by LOGIN

app.get("/Hemanthsai", (req,res)=>{
    res.render("Hemanthsai")
})
app.get("/naveen",(req,res)=>{
    res.render("naveen")
})

app.get('/api/login/:userId',(req,res)=>{
    const userId = req.params.userId
    if(userId){
        if(userId === "1"){
            res.redirect('/Hemanthsai')
        } else if(userId === "2"){
            res.redirect("/naveen")
        }
    }else{
        res.status(403).json("user not found")
    }
})

// creating routes for get by LOGOUT

app.post("/api/logout",(req,res)=>{
    const userTokens = req.headers.authorization
    if(userTokens){
        const token = userTokens.split(" ")[1]
        if(token){
            let allTokens = []
            const tokenIndex = allTokens.indexOf(token)
            if(tokenIndex !== -1){
                allTokens.splice(tokenIndex, 1)
                res.status(200).json("Logout Successfully!")
                res.redirect("/")
            }
            else{
                res.status(400).json("you are not valied user")
            }
        }else{
            res.status(400).json("token not found")
        }
    }else{
        res.status(400).json("you are not authenticated")
    }
})

app.get('/api/logout', (req,res)=>{
    res.redirect('/')
})

app.get('/',(req,res)=>{
    res.render('welcome')
})




// creating server
app.listen(PORT, ()=>{
    console.log(`Server Started and running @${PORT}`)
    
})