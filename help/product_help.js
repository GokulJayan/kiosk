var db=require('../config/connection')
var collection=require('../config/collections')
const { response } = require('express')

module.exports={
    addProduct:(product,callback)=>
    {
        db.get().collection(collection.COLLECTION).insertOne(product).then((data)=>{
            console.log("ID: "+product.ID)
            callback(product.ID)
        })
    },

    getAllProducts:()=>{
        return new Promise(async(resolve,reject)=>{
            let products=await db.get().collection(collection.COLLECTION).find().toArray()
            resolve(products)
        })
    },

    deleteitem:(prodID)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.COLLECTION).deleteOne({ID:prodID}).then((response)=>{
                resolve(response)
            })
        })
    },

    getdetails:(prodID)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.COLLECTION).findOne({ID:prodID}).then((product)=>{
                resolve(product)
            })
        })
    },

    updateitem:(details)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.COLLECTION).updateOne({ID:details.ID},{$set:{
             ID:details.ID,
             Name:details.Name,
             Category:details.Category,
             Price:details.Price,
             Description:details.Description,             
            }
        }).then((response)=>{
            resolve()
        })
        })
    }
}