const express = require("express");
const userRouter = require("./src/routes/user.route");
const pharmacyRouter = require("./src/routes/pharmacy.route");
const catchAsync = require("./src/utils/errorHandler");
const app = express();

app.get(
  "/",
  catchAsync(async (req, res) => {
    res.send("Hello World");
  }),
);
app.use("/user", userRouter);
app.use("/pharmacy", pharmacyRouter);

app.use((error, req, res, next) => {
  res.status(500).send({ message: error.message });
});
app.listen(4000, () => {
  console.log("server running on port http://localhost:4000");
});
