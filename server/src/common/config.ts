import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

function exitDueToUndefinedCredential(cred: string) {
    console.error(`${cred} is undefined`);
    process.exit(1);
}

export const DB_URI = process.env.DB_URI            ?? exitDueToUndefinedCredential("DB_URI")!;
export const SECRET_KEY = process.env.SECRET_KEY    ?? exitDueToUndefinedCredential("SECRET_KEY")!;
export const PORT = process.env.PORT                ?? exitDueToUndefinedCredential("PORT")!;