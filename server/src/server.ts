import http from "http";
import app from "./app";
import { connectToMongoDB } from "./common/database";
import { PORT } from "./common/config";

(async () => {
  await connectToMongoDB();

  const server = http.createServer(app);

  server.listen(PORT, () =>
    console.log(`Server open at http://localhost:${PORT}`)
  );
})();
