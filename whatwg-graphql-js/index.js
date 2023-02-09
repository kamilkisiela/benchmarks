import cluster from "cluster";
import { cpus } from "os";
import { createServerAdapter, Response } from '@whatwg-node/server'
import { createSchema } from "graphql-yoga";
import URL from "fast-url-parser";
import { parse, validate, execute } from 'graphql';
import { createServer } from "node:http";

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


const parseMap = new Map();
const validateMap = new Map();

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

function parseUrl(url) {
  return URL.parse(url)
}

const serverAdapter = createServerAdapter(async request => {
  const url = parseUrl(request.url);
  if (url.pathname === '/graphql') {
    const {query} = await request.json();
    const document = cachedParse(query);
    const errors = cachedValidate(schema, document);
    
    if (errors.length > 0) {
      return new Response(
        JSON.stringify({
          errors,
        }),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    }

    const result = await execute({
      schema, document
    });
  
    return new Response(
      JSON.stringify(result),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }
  return new Response('Not found', { status: 404 });
});

const nodeServer = createServer(serverAdapter);

nodeServer.listen(8000, () => {});
}
