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
| [Fastify](https://github.com/fastify/fastify) | Node.js | Fastify | 5.80ms | 17kps |
| [WhatWG-Server](https://github.com/ardatan/whatwg) | Node.js | Http | 6.58ms | 15kps |
| [Mercurius](https://github.com/mercurius-js/mercurius) | Node.js | Fastify | 8.06ms | 12kps |
| [WhatWG-Server + GraphQL-JS (lru)](https://github.com/ardatan/whatwg) | Node.js | Http | 9.01ms | 11kps |
| [WhatWG-Server + Envelop](https://github.com/ardatan/whatwg) | Node.js | Http | 10.56ms | 9.5kps |
| [Fastify + GraphQL-JS (lru)](https://github.com/ardatan/whatwg) | Node.js | Http | 11.31ms | 8.8kps |
| [graphql-yoga](https://github.com/dotansimha/graphql-yoga) | Node.js | http | 15.20ms | 6.6kps |
| [graphql-jit](https://github.com/zalando-incubator/graphql-jit) | Node.js | http | 17.78ms | 5.6kps |
| [apollo](https://github.com/apollographql/apollo-server) | Node.js | Express | 32.95ms | 3.0kps |
| [graphql-js](https://github.com/graphql/graphql-js) | Node.js | http | 41.96ms | 2.4kps |
