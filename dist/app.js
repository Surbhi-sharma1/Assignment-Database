import express from "express";
const app = express();
import cors from "cors";
app.use(cors());
import route from "./src/route.js";
app.use(express.static('./dist/public'));
app.use(express.json());
let corsOptions = {
    origin: "http://localhost:4200",
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use('/', route);
export const myURL = `http://localhost:5000`;
app.listen(5000, () => {
    console.log(`Listening on port 5000`);
});
//# sourceMappingURL=app.js.map