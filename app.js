const express = require("express");
const userRouter = require("./src/routes/user.route");
const catchAsync = require("./src/utils/errorHandler");
const app = express();

app.get(
  "/",
  catchAsync(async (req, res) => {
    throw new Error("err hpwn");
    res.send("Hello World");
  }),
);
app.use("/user", userRouter);

app.use((error, req, res, next) => {
  res.status(500).send({ message: error.message });
});
app.listen(4000, () => {
  console.log("server running on port http://localhost:4000");
});
