import cluster from "cluster";
import { cpus } from "os";
import { createServerAdapter, Response } from '@whatwg-node/server'
import URL from "fast-url-parser";
import { createServer } from "node:http";

if (cluster.isPrimary) {
  for (let i = 0; i < cpus().length; i++) {
    cluster.fork();
  }
} else {
function parseUrl(url) {
  return URL.parse(url)
}

const serverAdapter = createServerAdapter(request => {
  const url = parseUrl(request.url);
  if (url.pathname === '/graphql') {
    return new Response(
      JSON.stringify({
        data: {
          hello: 'world'
        }
      }),
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
