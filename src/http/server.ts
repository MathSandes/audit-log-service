import fastify from "fastify";
import { registerRoutes } from "./routes";
import { AppDataSource } from "../infrastructure/db/data-source";

const server = fastify();

export async function buildServer() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  await registerRoutes(server);
  return server;
}

if (require.main === module) {
  (async () => {
    try {
      await buildServer();
      const port = Number(process.env.PORT || 3000);
      await server.listen({ port, host: "0.0.0.0" });
      console.log(`Server listening on ${port}`);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  })();
}

export default server;

