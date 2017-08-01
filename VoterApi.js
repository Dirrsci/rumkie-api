import VoteModel from './models/vote';

export default class VoterApi {
  vote(songId, chargeId) {
    return VoteModel.create({ songId, chargeId });
  }

  getAll() {
    return VoteModel.find({});
  }

  getCounts() {
    return VoteModel.aggregate()
      .group({ _id: '$songId', count: {$sum: 1 }})
      .exec((err, res) => {
        if (err) return Promise.reject(err);
        return Promise.resolve(res);
      });
  }

}
