require('dotenv').config();
const Hapi = require('@hapi/hapi');

const albums = require('./api/albums');
const AlbumService = require('./services/albums/postgres');
const AlbumValidator = require('./validator/albums');

const songs = require('./api/songs');
const SongService = require('./services/songs/postgres');
const SongValidator = require('./validator/songs');

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: albums,
      options: {
        service: new AlbumService(),
        validator: AlbumValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: new SongService(),
        validator: SongValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

init();
