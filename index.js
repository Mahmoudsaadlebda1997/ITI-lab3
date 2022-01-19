const express = require('express')
const fs = require('fs')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const userRouter = require('./routers/usersRouter')
const {logRequest} = require('./generalHelpers')
const { v4: uuidv4 } = require("uuid");
const { validateUser } = require("./userHelpers");
const { json } = require('body-parser')

app.use(bodyParser.json())
/*
https://www.youtube.com/playlist?list=PLdRrBA8IaU3Xp_qy8X-1u-iqeLlDCmR8a
Fork the project 
git clone {url}
npm i


Create server with the following end points 
POST /users with uuid, unique username 
PATCH /users/id 
GET /users with age filter 
Create Error handler 
POST /users/login /sucess 200 , error:403
GET /users/id   200,   eror:404
DELETE users/id  200,    error:404
complete middleware for validating user
Create Route For users 

Bonus
Edit patch end point to handle the sent data only
If age is not sent return all users


git add .
git commit -m "message"
git push
*/

// Add users to /users
app.post("/users", validateUser, async (req, res, next) => {
  try {
      const { username, age, password } = req.body;
      const data = await fs.promises
          .readFile("./user.json", { encoding: "utf8" })
          .then((data) => JSON.parse(data));
      const id = uuidv4();
      data.push({ id, username, age, password });
      await fs.promises.writeFile("./user.json", JSON.stringify(data), {
          encoding: "utf8",
      });
      res.send({ id, message: " User Added sucessfully" });
  } catch (error) {
      next({ status: 500, internalMessage: error.message });
  }
});
//  edit Users By User ID
app.patch("/users/:userId", validateUser, async (req, res, next) => {
  try {
    
    const {username,password,age}=req.body;
    const users =await fs.promises.readFile("./user.json",{encoding:"utf8"})
    .then((data) => JSON.parse(data));
    const newUsers =users.map((user)=>{
      if (user.id !== req.params.userId) return user;
      return {
        username,
        password,
        age,
        id:req.params.userId,
      };
    });
    await fs.promises.writeFile("./user.json",JSON.stringify(newUsers),{
      encoding:"utf8"}
      
      );
    res.status(200).send({message:"User Is  Edited Succesfully"});
  } catch (error){
    next({status:500,internalMessage:error.message});
  }
});

//  Get with age filter and return all users if no age is sent

app.get('/users', async (req,res,next)=>{
  try {
  if(typeof req.query.age == 'undefined')
  {
    const users = await fs.promises
    .readFile("./user.json", { encoding: "utf8" })
    .then((data) => JSON.parse(data));
    res.send(users)
  }else
  {
    const age = Number(req.query.age)
    const users = await fs.promises
    .readFile("./user.json", { encoding: "utf8" })
    .then((data) => JSON.parse(data));
    const filteredUsers = users.filter(user=>user.age===age)
    res.send(filteredUsers)
  }
  
  } catch (error) {
  next({ status: 500, internalMessage: error.message });
  }

})

  //Log in user
  app.post("/loginin",async (req, res, next) => {
    const { username, password } = req.body;
    if(!username) return next({status:422, message:"username is requird"})
    if(!password) return next({status:422, message:"password is requird"})
    try {
      const users = await fs.promises
      .readFile("./user.json", { encoding: "utf8" })
      .then((data) => JSON.parse(data));
      const isUser = users.some(user=>user.username===username && user.password ===password)
      if(isUser)
      {
        res.status(200).send({message: "Succesfully Signned In"});
      }else
      {
        next({status:403, message:"Please Register"})
      }
      } catch (error) {
      next({ status: 500, internalMessage: error.message });
      }
  });
// error Handler
app.use((err,req,res,next)=>{
  if(err.status>=500){
    console.log(err.internalMessage)
    return res.status(500).send({error :"internal server error"})
  }
  res.status(err.status).send(err.message)

})
//delete users by ID
app.delete("/users/:id", async (req, res, next) => {
  try {
      const id = req.params.id
      console.log(id);
      const users = await fs.promises.readFile('./user.json', { encoding: "utf8" })
          .then((data) => JSON.parse(data))

      const newUsers = users.filter(user => {
          return user.id != id
      })
      await fs.promises.writeFile("./user.json", JSON.stringify(newUsers), (err) => {
          if (!err) return res.status(200).send({ message: "success" })
          res.status(500).send("server error")
      })
      res.status(200).send({ message: "user deleted" })

  }
  catch (error) {
      next({ status: 500, internalMessage: error.message });
  }
})

// get users by id

app.get("/users/:id", async (req, res, next) => {
  try {
      const id = req.params.id
      console.log(id);
      const users = await fs.promises.readFile('./user.json', { encoding: "utf8" })
          .then((data) => JSON.parse(data))

      const newUser = users.filter(user => {
          return user.id == id
      })
      res.status(200).send(newUser)
  }
  catch (error) {
      next({ status: 500, internalMessage: error.message });
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})