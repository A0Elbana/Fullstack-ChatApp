import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";
import db from "./src/lib/db.js";

const PORT = process.env.PORT || 1502;

await db();

app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
});
