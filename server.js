import restify from 'restify';
import mongoose from 'mongoose';
import config from './config/default';
import bluebird from 'bluebird';
import Stripe from './StripeApi';
import Voter from './StripeApi';
import SongModel from './models/song';

let stripe = new Stripe();
let voter = new Voter();

mongoose.connect(config.mongoose.url, { promiseLibrary: bluebird });

const server = restify.createServer({
  name: 'myapp',
  version: '1.0.0'
});

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());


server.get('/songs', (req, res, next) => {
  SongModel.find()
    .then((songs) => {
      res.send(songs);
      return next(false);
    })
    .catch((err) => {
      return next(err);
    });
});

server.post('/vote', (req, res, next) => {
  console.log('req.params: ', req.params);
  console.log('req.body: ', req.body);
  stripe.create(req.body)
    .then((charge) => {
      req.body.songs.map((song) => {
        voter.vote(song.id, charge.id);
      });
    })
    .catch((err) => {
      console.log('Error Charging Card: ', err);
    });
  res.send('Successfully Voted');
  return next();
});

server.post('/song', (req, res, next) => {
  SongModel.create(req.body)
    .then((song) =>{
      res.send(song);
      next(song);
    })
    .catch((err) => {
      next(err);
    });
});

server.listen(8080, () => {
  console.log('%s listening at %s', server.name, server.url);
});
