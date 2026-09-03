import mongoose from "mongoose"

const mongodbUrl=process.env.MONGODB_URL

if(!mongodbUrl){
    throw new Error("db url not found!")
}

let cached=global.mongooseConn
if(!cached){
    cached=global.mongooseConn={conn:null,promise:null}
}

const connectDb=async () => {
    if(cached.conn && cached.conn.readyState === 1){
        return cached.conn
    }


    if(!cached.promise){
        cached.promise=mongoose.connect(mongodbUrl, {
            serverSelectionTimeoutMS: 5000,
        }).then(c=>c.connection)
    }

try {
    const conn=await cached.promise
    return conn
} catch (error) {
    cached.promise=null
    throw error
}

}

export default connectDb