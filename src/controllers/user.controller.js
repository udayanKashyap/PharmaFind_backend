const db = require("../db/prisma");
const catchAsync = require("../utils/errorHandler");

const adduser = catchAsync(async (req, res) => {
  console.log(req.body);
  const {
    password,
    email,
    address: location,
    fullName: name,
    pincode,
  } = req.body;
  await db.user.create({
    data: {
      name,
      password,
      pincode,
      email,
      location,
      contact_no,
    },
  });
  res.send({ message: "User created successfully" });
});

function getUser(req, res) {
  res.send("Got user");
}

function updateUser(req, res) {
  res.send("User updated");
}

module.exports = {
  getUser,
  updateUser,
  adduser,
};
