<!-- README.md is generated from README.ecr, do not edit -->

# GraphQL server benchmarks

Graphql server benchmarks in many languages. Pull requests welcome, please read [CONTRIBUTING.md](CONTRIBUTING.md)

All servers implement a simple schema:

```graphql
type Query {
  hello: String!
}
```

The returned string is always `world`.

The API is served over HTTP using a common web server and load tested using [bombardier](https://github.com/codesenberg/bombardier).

### Results

| Name                          | Language      | Server          | Latency avg      | Requests      |
| ----------------------------  | ------------- | --------------- | ---------------- | ------------- |
| [Fastify](https://github.com/fastify/fastify) | Node.js | Fastify | 6.11ms | 16kps |
| [WhatWG-Server](https://github.com/ardatan/whatwg) | Node.js | Http | 7.84ms | 13kps |
| [Mercurius](https://github.com/mercurius-js/mercurius) | Node.js | Fastify | 8.55ms | 12kps |
| [graphql-yoga](https://github.com/dotansimha/graphql-yoga) | Node.js | http | 17.40ms | 5.7kps |
| [graphql-jit](https://github.com/zalando-incubator/graphql-jit) | Node.js | http | 20.57ms | 4.9kps |
| [apollo](https://github.com/apollographql/apollo-server) | Node.js | Express | 37.32ms | 2.7kps |
| [graphql-js](https://github.com/graphql/graphql-js) | Node.js | http | 56.92ms | 1.7kps |
