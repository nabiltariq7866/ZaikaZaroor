import mongoose from "mongoose";
const connectDB =async () => {
    try {
        const conn=await mongoose.connect(process.env.MONGODB_URL)
        console.log("DB connected")
    } catch (error) {
        console.log("DB not connected")
        
    }
}
export default connectDB