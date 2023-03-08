import mongoose from "mongoose";

mongoose.set('strictQuery', false);

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log(`Database connected`);
    } catch (error) {
        console.log(`Error while connect with db : ${error}`);
    }
}


export default connectDB;