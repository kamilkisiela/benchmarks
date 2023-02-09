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
| [Fastify](https://github.com/fastify/fastify) | Node.js | Fastify | 7.14ms | 14kps |
| [WhatWG-Server](https://github.com/ardatan/whatwg) | Node.js | Http | 8.25ms | 12kps |
| [Mercurius](https://github.com/mercurius-js/mercurius) | Node.js | Fastify | 9.76ms | 10kps |
| [WhatWG-Server + Envelop](https://github.com/ardatan/whatwg) | Node.js | Http | 12.66ms | 7.9kps |
| [graphql-yoga](https://github.com/dotansimha/graphql-yoga) | Node.js | http | 17.13ms | 5.8kps |
| [graphql-jit](https://github.com/zalando-incubator/graphql-jit) | Node.js | http | 19.96ms | 5.0kps |
| [apollo](https://github.com/apollographql/apollo-server) | Node.js | Express | 40.72ms | 2.4kps |
| [graphql-js](https://github.com/graphql/graphql-js) | Node.js | http | 48.35ms | 2.1kps |
