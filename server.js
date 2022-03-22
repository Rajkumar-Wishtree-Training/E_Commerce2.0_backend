const app = require('./app')

const dotenv = require('dotenv')
const connectDatabase = require('./config/database') 
//Handling Uncaught Exceptions
process.on('uncaughtException' , (err) =>{
    console.log(`Error ${err.message}`);
    process.exit()
})

//Config
dotenv.config({path : "backend/config/config.env"});

//Database
connectDatabase()

const server = app.listen(process.env.PORT , ()=>{
    console.log(`server is running on server http://localhost:${process.env.PORT}`);
})


//Unhandlerd Promise Rejection
process.on('unhandledRejection' , (err) =>{
    console.log(`Error ${err.message}`);
    server.close();
    process.exit(1);

})