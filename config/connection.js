import Mongoose from "mongoose";

export default await Mongoose.connect(process.env.DB_CONNECTION_STR);

if (Mongoose.connection.readyState === 1) {
    console.log("MongoDB is connected");
} else {
    console.log("MongoDB is NOT connected");
}
