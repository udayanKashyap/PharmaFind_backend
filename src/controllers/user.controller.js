function getUser(req, res) {
  res.send("Got user");
}

function updateUser(req, res) {
  res.send("User updated");
}

module.exports = {
  getUser,
  updateUser,
};
