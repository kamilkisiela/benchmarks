import cluster from "cluster";
import { cpus } from "os";
import { createServerAdapter, Response } from "@whatwg-node/server";
import URL from "fast-url-parser";
import { createServer } from "node:http";
import { execute, subscribe } from "@graphql-tools/executor";
import { envelop, useEngine, useSchema } from "@envelop/core";
import { parse, validate, specifiedRules } from "graphql";
import { createSchema } from "graphql-yoga";
import { useParserAndValidationCache } from "./node_modules/graphql-yoga/esm/plugins/useParserAndValidationCache.js";

if (cluster.isPrimary) {
  for (let i = 0; i < cpus().length; i++) {
    cluster.fork();
  }
} else {
  function parseUrl(url) {
    return URL.parse(url);
  }

  const getEnveloped = envelop({
    plugins: [
      useEngine({
        parse,
        validate,
        execute,
        subscribe,
        specifiedRules,
      }),
      useSchema(
        createSchema({
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
      ),
      useParserAndValidationCache({}),
    ],
  });

  const serverAdapter = createServerAdapter(async (request, serverContext) => {
    const url = parseUrl(request.url);
    if (url.pathname === "/graphql") {
      const { parse, validate, execute, schema, contextFactory } = getEnveloped(serverContext);
      const { query, variables } = await request.json();
      let document;
        try {
            document = parse(query);
        } catch (error) {
            return Response.json({
                errors: [error],
            })
        }
        const validationErrors = validate(schema, document);
        if (validationErrors.length > 0) {
            return Response.json({
                errors: validationErrors,
            })
        }
        const result = await execute({
          schema,
          document,
          variableValues: variables,
          contextValue: await contextFactory(),
        });
        return Response.json(result);
    }
    return new Response("Not found", { status: 404 });
  });

  const nodeServer = createServer(serverAdapter);

  nodeServer.listen(8000, () => {});
}
