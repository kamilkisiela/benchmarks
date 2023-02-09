import cluster from "cluster";
import { cpus } from "os";
import { createSchema } from "graphql-yoga";
import { lru } from "tiny-lru";
import { parse, validate, execute } from 'graphql';
import Fastify from 'fastify'

if (cluster.isPrimary) {
  for (let i = 0; i < cpus().length; i++) {
    cluster.fork();
  }
} else {

const schema = createSchema({
  typeDefs: `
    type Query {
      hello: String!
    }
  `,
  resolvers: {
    Query: {
      hello: () => "world",
    },
  },
})


const parseMap = lru(20);
const validateMap = lru(20);

function cachedParse(query) {
  const cacheEntry = parseMap.get(query);

  if (cacheEntry) {
    return cacheEntry;
  }

  const document = parse(query);
  parseMap.set(query, document);

  return document;
}

function cachedValidate(schema, document) {
  const cacheEntry = validateMap.get(document);

  if (cacheEntry) {
    return cacheEntry;
  }

  const errors = validate(schema, document);
  validateMap.set(document, errors);
  
  return errors;
}

const fastify = Fastify({
  logger: false
})

fastify.post('/graphql', function (request, reply) {
    const document = cachedParse(request.body.query);
    const errors = cachedValidate(schema, document);
    
    if (errors.length > 0) {
      reply.send({errors})
      return;
    }

    execute({
      schema, document
    }).then(result => {
      reply.send(result)
    })
})

fastify.listen({ port: 8000 }, function (err) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})

process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server');
  fastify.close();
  process.exit(0);
})
}
