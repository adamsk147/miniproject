const bcrypt = require("bcrypt");

let db = {
  users: [
    {
      id: 1,
      passport: "1234567891234",
      fullName: "test test",
      address: "Phuket",
      plaints: [
        { id: 1, title: "a", price: 100, status: false },
        { id: 2, title: "a", price: 100, status: false },
      ],
    },
  ],
  admins: [
    {
      id: 1,
      username: "admin",
      password: "$2b$10$P2IL5vvjmE9dfzZ0LCBxaerYAK03/m/ATzvItfcApxQBmpKeWrbpS",
      email: "admin@gmail.com",
    },
  ],
};

const SECRET = "your_jwt_secret";
const NOT_FOUND = -1;

exports.db = db;
exports.SECRET = SECRET;
exports.NOT_FOUND = NOT_FOUND;

exports.setUsers = function (_users) {
  users = _users;
};

// === validate username/password ===
exports.isValidUser = async (username, password) => {
  const index = db.admins.findIndex((item) => item.username === username);
  return await bcrypt.compare(password, db.admins[index].password);
};

// return -1 if user is not existing
exports.checkExistingUser = (username) => {
  return db.admins.findIndex((item) => item.username === username);
};
