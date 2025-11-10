const mongoose = require("mongoose");

const connectDB = async() =>{
    const DB_NAME = 'CareShare';
    const DB_URI = `mongodb+srv://ishitaagrawal2020_db_user:${process.env.DB_PASSWORD}@careshare.4i19ajj.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=CareShare`
    
    try{
        const connectionInstance = await mongoose.connect(DB_URI)
        console.log(`\nMONGO DB CONNECTED !!`);

    }catch(err){
        console.log(`MONGODB CONNECTION ERROR: ${err}`);
        process.exit(1);
    }
}

module.exports = connectDB;