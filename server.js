import restify from 'restify';
import mongoose from 'mongoose';
import config from 'config';

mongoose.connect(config.mongoose.url);

import SongModel from './models/song';

const server = restify.createServer({
  name: 'myapp',
  version: '1.0.0'
});

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());


server.get('/vote/:stripe_id', (req, res, next) => {
  console.log(req.params);
  res.send(req.params);
  return next();
});

server.get('/songs', (req, res, next) => {
  SongModel.find()
  .then(songs) => {
    res.send(songs);
    return next(false);
  })
  .catch((err) => {
    return next(err);
  }

  server.post('/vote/:charge_id', (req, res, next) => {



  });

}





server.listen(8080, () => {
  console.log('%s listening at %s', server.name, server.url);
});
