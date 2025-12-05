// const mongoose = require('mongoose');


// const mongoURI = "mongodb://localhost:27017/nootebook"


// const connectToMongo= async ()=>{
//     try{
//       await  mongoose.connect(mongoURI)

//             console.log("connected to mongo sucessfully");

//     }
//     catch(error){
//          console.error("Error connecting to MongoDB:", error);
//     }
// }

// module.exports=connectToMongo;



const mongoose = require('mongoose');
require('dotenv').config(); // Load .env variables

const mongoURI = process.env.MONGO_URI; // Get MongoDB URI from .env

const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log("MongoDB Connected Successfully!");
    } catch (error) {
        console.error("MongoDB Connection Error:", error);
    }
};

module.exports = connectToMongo;

