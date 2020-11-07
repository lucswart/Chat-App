import mongoose from "mongoose";

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const peoplegroupSchema = mongoose.Schema({
  groupid: ObjectId,
  username: String,
  user: String,
});

export default mongoose.model("peoplegroup", peoplegroupSchema);
