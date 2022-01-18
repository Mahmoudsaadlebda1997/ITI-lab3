const fs = require('fs')
// some
// find
const validateUser = async (req, res, next) =>{
    try {
        const {username , password , age} = req.body;
        if(!username) return next({status:422,message:"User Name is Needed"})
        if(!password) return next({status:422,message:"Password is Needed"})
        if(!age) return next({status:422,message:"Age is Needed"})
        const data = await fs.promises.readFile('./user.json',{encoding:'utf8'})
        const users = JSON.parse(data)
        const isUsernameExists = users.some(user=>user.username===username)
        if(isUsernameExists && req.method == "POST") return next({status:422, message:"username is used"})
        next()
    } catch (error) {
        next({status:500, internalMessage:error.message})
    }
}

module.exports = {
    validateUser
}