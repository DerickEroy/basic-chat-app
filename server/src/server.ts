import http from "http";
import app from "./app";
import mongoose from "mongoose";
import { DB_URI } from "@common/config";

(async () => {

    try {
        await mongoose.connect(DB_URI).then(() => console.log('Connected to MongoDB'));

        const server = http.createServer(app);

        const port = 4000;

        server.listen(port, () => console.log(`Server open at http://localhost:${port}`));
    } catch (error) {
        console.error(error);
        process.exit(1);
    }

})();