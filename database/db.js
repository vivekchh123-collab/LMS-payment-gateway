import mongoose from "mongoose";

const MAX_RETRIES = 3;

const RETRY_INTERVAL = 5000; // Delay in milliseconds between retries

class DatabaseConnection {

    constructor() {
        this.retryCount = 0;
        this.isConnected = false;

        //configure mongoose settings
        mongoose.set('strictQuery', true); // Disable strict query mode

        mongoose.connection.on('connected',() =>{
            console.log("MONFODB CONNECTED SUCCESSFULLY");
            this.isConnected = true;
            
        })
        mongoose.connection.on('error',() =>{
            console.log("MONFODB CONNECTED SUCCESSFULLY");
            this.isConnected = false;
        })
        mongoose.connection.on('disconnected', () => {
            console.log("MONFODB CONNECTED SUCCESSFULLY");
          this.handleDisconnection(); // Handle disconnection and attempt to reconnect
        });
    
        process.on('SIGTERM',this.handleAppTermination.bind(this)); // Handle application termination
    }
    async connect (){
        try {
            if(!process.env.MONGO_URI){
                throw new Error("MONGO_URI is not defined in the environment variables");}
    
                const connectionOptions = {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                    maxPoolSize: 10, // Adjust the pool size as needed  
                    serverSelectionTimeoutMS: 5000, // Adjust the timeout as needed
                    socketTimeoutMS: 45000, // Adjust the socket timeout as needed
                    family: 4, // Use IPv4
                };
                if(process.env.NODE_ENV === "development"){
                    mongoose.set('debug', true); // Enable debug mode in development
                }
                await mongoose.connect(process.env.MONGO_URI, connectionOptions);
                this.retryCount = 0; // Reset retry count on successful connection
        } catch (error) {
            console.error("Error connecting to MongoDB:", error);
            await this.handleConnectionError();
        }
            
            
    }

    async handleConnectionError() {
        if(this.retryCount < MAX_RETRIES){
            this.retryCount++;
            console.log(`MongoDB connection error. Retrying in ${RETRY_INTERVAL / 1000} seconds... (Attempt ${this.retryCount} of ${MAX_RETRIES})`);

            await new Promise(resolve => setTimeout(()=> {
                resolve
            }, RETRY_INTERVAL));
            return this.connect();
        }else{
            console.error("Max retries reached. Failed to connect to MongoDB.");
            process.exit(1); // Exit the process with an error code
        }

}

async handleDisconnection() {
    if(!this.isConnected){
        console.error("MongoDB connection lost.");
        this.connect(); // Attempt to reconnect
    }

}

async handleAppTermination() {
    try {
        await mongoose.connection.close();
        console.log("MongoDB connection closed due to application termination.");
        process.exit(0);
    } catch (error) {
        console.error("Error occurred while closing MongoDB connection:", error);
        process.exit(1);
    }
}

getConnectionStatus() {
    return {  
    isConnected: this.isConnected,
    readyState: mongoose.connection.readyState,
    host: mongoose.connection.host,
    name: mongoose.connection.name,
    }

}
}

//create a singleton instance of the DatabaseConnection class
const dbconnection = new DatabaseConnection();

export default dbconnection.connect.bind(dbconnection);
export const getDBStatus = dbconnection.getConnectionStatus.bind(dbconnection);