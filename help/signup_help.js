var db = require('../config/connection')
var collection = require('../config/collections')
const bcrypt = require('bcrypt')

module.exports = {
    doSignup: (signupData) => {
        return new Promise(async (resolve, reject) => {
            signupData.Password = await bcrypt.hash(signupData.Password, 10)
            db.get().collection(collection.SIGNUP).insertOne(signupData).then((data) => {
                resolve(signupData)
            })
        })
    },

    doLogin: (loginData) => {
        return new Promise(async (resolve, reject) => {
            let response={}
            let employee= await db.get().collection(collection.SIGNUP).findOne({ID:loginData.ID})
            if(employee){
                bcrypt.compare(loginData.Password,employee.Password).then((status)=>{
                    if(status)
                    {
                        console.log("Login Success")
                        response.employee=employee
                        response.status=true
                        resolve(response)
                    }
                    else
                    {
                        console.log("Login failed")         
                        resolve({status:false})               
                    }
                    
                })
            }
            else
            {
                console.log("No account found")
                resolve({status:false})    
            }
        })
    }
}