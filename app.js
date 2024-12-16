const express = require("express");
const redirectRouter = require("./src/routes/redirect.route");
const userRouter = require("./src/routes/user.route");
const pharmacyRouter = require("./src/routes/pharmacy.route");
const catchAsync = require("./src/utils/errorHandler");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const app = express();
const allowedOrigins = ['http://localhost:5173', 'http://localhost:4173'];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.get(
  "/",
  catchAsync(async (req, res) => {
    res.send("Hello World");
  }),
);
app.use(cookieParser())
app.use(express.json());
app.use("/user", userRouter);
app.use("/pharmacy", pharmacyRouter);
app.use("/redirects", redirectRouter);

app.use((error, req, res, next) => {
  res.status(500).send({ message: error.message, stack: error.stack });
});
app.listen(4000, () => {
  console.log("server running on port http://localhost:4000");
});
