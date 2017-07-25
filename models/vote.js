import mongoose from 'mongoose';

let VoteSchema = mongoose.Schema({
  chargeId: String,
  songId: String
});

let VoteModel = mongoose.model('Vote', VoteSchema);

export default VoteModel;
