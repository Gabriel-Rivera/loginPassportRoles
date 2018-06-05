const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const roomSchema = new Schema({
  name: String,
  desc: String,
  owner: Schema.Types.ObjectId
});

const Room = mongoose.model("Room", userSchema);

module.exports = Room;