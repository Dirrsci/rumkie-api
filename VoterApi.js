import VoteModel from './models/vote';

export default class VoterApi {
  vote(songId, chargeId) {
    return VoteModel.create({
      songId,
      chargeId
    });
  }
}
