import mongoose from "mongoose";

const groupSchema = mongoose.Schema({
  groupname: String,
});

export default mongoose.model("Groups", groupSchema);
