import app from "./app";
import { env } from "./config/env";
import { prisma } from "./lib/prisma";

const server = app.listen(env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Admin backend running on http://localhost:${env.PORT}`);
});

const shutdown = async () => {
  // eslint-disable-next-line no-console
  console.log("Shutting down backend...");
  await prisma.$disconnect();
  server.close(() => process.exit(0));
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

