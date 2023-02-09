import cluster from "cluster";
import { cpus } from "os";
import Fastify from 'fastify'

if (cluster.isPrimary) {
  for (let i = 0; i < cpus().length; i++) {
    cluster.fork();
  }
} else {
  const fastify = Fastify({
    logger: false
  })
  
  fastify.post('/graphql', function (request, reply) {
    reply.send({ data: { hello: 'world' } })
  })
  
  fastify.listen({ port: 8000 }, function (err) {
    if (err) {
      fastify.log.error(err)
      process.exit(1)
    }
  })
}
