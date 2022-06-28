require('dotenv').config()
const Hapi = require('@hapi/hapi');

const albums = require('./api/albums')
const AlbumService = require('./services/albums/postgres')
const AlbumValidator = require('./validator/albums')

const init = async () => {
    const server = Hapi.server({
        port: process.env.PORT || 3000,
        host: process.env.HOST || 'localhost',
        routes: {
            cors: {
                origin: ['*'],
            }
        }
    })

    await server.register([
        {
            plugin: albums,
            options: {
                service: new AlbumService(),
                validator: AlbumValidator,
            }
        }
    ])

    await server.start()
    console.log(`Server running at: ${server.info.uri}`)
}

init()