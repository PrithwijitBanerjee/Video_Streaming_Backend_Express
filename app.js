import express from "express";
import CreateError from "http-errors";
import AllStatusCodes from "./utils/AllStatusCodes.js";
import cors from 'cors';
import { errorResponse } from "./utils/responseHandler.js";
import UploadRouter from "./routes/upload.routes.js";

const app = express();

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static('uploads'));

app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
}));

app.use((_, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
})

/** ... Basic Landing page ... **/
app.get("/", (_, res) => {
    res.status(AllStatusCodes.OK).render('index', {
        title: 'Welcome To Video Streaming Website',
    })
});

app.use(UploadRouter);

app.use((req, res, next) => {
    next(CreateError(AllStatusCodes.NotFound, "Route Not Found!!!"));
});

app.use((error, req, res, next) => {
    if (req.headersSent) {
        next(error); // Delegate to the express default error handling middleware ...
    } else {
        errorResponse(res, {
            status: error?.status || 500,
            message: error?.message || "Internal Server Error",
        });
    }
});

export default app;