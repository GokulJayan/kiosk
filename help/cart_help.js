var db = require('../config/connection')
var collection = require('../config/collections')
var productHelp = require('../help/product_help')
const bcrypt = require('bcrypt')
const { response } = require('express')

module.exports = {
    addToCart: (prodID) => {
        productHelp.getAllProducts().then((products) => {
            for (var ele of products) {
                if (ele.ID == prodID) {

                    return new Promise((resolve, reject) => {
                        let Obj = {
                            ID: prodID,
                            Name: ele.Name,
                            Category: ele.Category,
                            Price: ele.Price,
                            Description: ele.Description,
                            Count: 1,
                        }
                        db.get().collection(collection.CARTITEMS).insertOne(Obj).then((response) => {
                            console.log(response)
                            resolve()
                        })
                    })

                }
            }
        })
    },



    getCartItems: () => {
        return new Promise(async (resolve, reject) => {
            let cartItems = await db.get().collection(collection.CARTITEMS).find().toArray()
            for (var ele of cartItems) {

                if (ele.Count <= 0) {
                    db.get().collection(collection.CARTITEMS).deleteOne({ ID: ele.ID })
                }
            }
            resolve(cartItems)
        })
    },

    deleteitem: (prodID) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.CARTITEMS).deleteOne({ ID: prodID }).then((response) => {
                resolve(response)
            })
        })
    },

    incrementitem: (prodID) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.CARTITEMS).updateOne({ ID: prodID }, {
                $inc: {
                    Count: 1,
                }
            }).then((response) => {
                resolve(response)
            })
        })
    },

    decrementitem: (prodID) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.CARTITEMS).updateOne({ ID: prodID }, {
                $inc: {
                    Count: -1,
                }
            }).then((response) => {
                resolve(response)
            })
        })
    },

    getTotal:()=>{
        return new Promise(async (resolve, reject) => {
            let total=0
            let cartItems = await db.get().collection(collection.CARTITEMS).find().toArray()
            for (var ele of cartItems) {
                total=total+(ele.Price*ele.Count)
            }
            resolve(total)
        })

    }
}