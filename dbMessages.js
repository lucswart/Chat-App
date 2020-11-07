import mongoose from "mongoose";

const chatappSchema = mongoose.Schema({
  group: String,
  message: String,
  name: String,
  timestamp: String,
  userid: String,
});

export default mongoose.model("messagecontents", chatappSchema);
