import http from "http";
import app from "./app";
import { connectToMongoDB } from "./common/database";

(async () => {
    await connectToMongoDB();

    const server = http.createServer(app);

    const port = 4000;

    server.listen(port, () => console.log(`Server open at http://localhost:${port}`));
})();