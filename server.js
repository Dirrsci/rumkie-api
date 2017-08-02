import restify from 'restify';
import mongoose from 'mongoose';
import config from './config/default';
import bluebird from 'bluebird';
import Stripe from './StripeApi';
import Voter from './VoterApi';
import corsMiddleware from 'restify-cors-middleware';
import pasync from 'pasync';

import Songs from './songlist.json';

let stripe = new Stripe();
let voter = new Voter();

mongoose.connect(config.mongoose.url, { promiseLibrary: bluebird });

const server = restify.createServer({
  name: 'myapp',
  version: '1.0.0'
});

const cors = corsMiddleware({
  origins: ['http://localhost:3000'],
  allowHeaders: ['*']
  // exposeHeaders: ['API-Token-Expiry']
});

server.pre(cors.preflight);
server.use(cors.actual);

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());


server.get('/songs', (req, res, next) => {
  res.send(Songs);
  return next(false);
});

server.get('/songs-with-votes', (req, res, next) => {
  voter.getCounts()
    .then((counts) => {
      Songs.map((song) => {
        const count = counts.filter((count) => { return count._id === song.id; })[0];
        song.count = count && count.count || 0;
      });
      res.send(Songs);
      return next(false);
    })
    .catch((err) => {
      res.send(err);
      return next(err);
    });
});

server.post('/vote', (req, res, next) => {
  let { name, email, songs, token } = req.body;
  console.log('songs', songs);
  // start of promise chain
  stripe.calculateChargeAmount(songs.length)
    .then((chargeAmount) => stripe.chargeCard(chargeAmount, token))
    .then((charge) => {
      return pasync.each(songs, (songId) => {
        return voter.vote(songId, charge.id);
      });
    })
    .then(() => {
      res.send('Successfully Voted');
    })
    .catch((err) => {
      res.send('Error Voted');
      console.log('Error Charging Card: ', err);
    })
    .then(() => next());
});

server.listen(8080, () => {
  console.log('%s listening at %s', server.name, server.url);
});
