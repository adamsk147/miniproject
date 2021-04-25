const express = require("express"),
  app = express(),
  passport = require("passport"),
  port = process.env.PORT || 80,
  cors = require("cors"),
  cookie = require("cookie");
const bcrypt = require("bcrypt");
const { db, SECRET, checkExistingUser, NOT_FOUND } = require("./database.js");

require("./passport.js");

const router = require("express").Router(),
  jwt = require("jsonwebtoken");

router.use(cors({ origin: "http://localhost:3000", credentials: true }));
router.use(express.json());
router.use(express.urlencoded({ extended: false }));

router.post("/login", (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    console.log("Login: ", req.body, user, err, info);
    if (err) return next(err);
    if (user) {
      if (req.body.remember == true) {
        time_exp = "7d";
      } else time_exp = "1d";
      const token = jwt.sign(user, SECRET, {
        expiresIn: time_exp,
      });
      var decoded = jwt.decode(token);
      let time = new Date(decoded.exp * 1000);
      console.log(new Date(decoded.exp * 1000));
      res.setHeader(
        "Set-Cookie",
        cookie.serialize("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== "development",
          maxAge: 60 * 60,
          sameSite: "strict",
          path: "/",
        })
      );
      res.statusCode = 200;
      return res.json({ user, token });
    } else return res.status(422).json(info);
  })(req, res, next);
});

router.get("/logout", (req, res) => {
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      maxAge: -1,
      sameSite: "strict",
      path: "/",
    })
  );
  res.statusCode = 200;
  return res.json({ message: "Logout successful" });
});

/* GET user profile. */
router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    res.send(req.user);
  }
);

router.post("/register", async (req, res) => {
  try {
    const SALT_ROUND = 10;
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.json({ message: "Cannot register with empty string" });
    if (checkExistingUser(username) !== NOT_FOUND)
      return res.json({ message: "Duplicated user" });

    let id = db.admins.length ? db.admins[db.admins.length - 1].id + 1 : 1;
    hash = await bcrypt.hash(password, SALT_ROUND);
    console.log(hash);
    db.admins.push({ id, username, password: hash, email });
    res.status(200).json({ message: "Register success", a: db.admins });
  } catch {
    res.status(422).json({ message: "Cannot register" });
  }
});

router.route("/passport/:passport").get((req, res) => {
  let id = db.users.findIndex((item) => +item.id == +req.params.passport);
  res.json(db.users[id]);
});

router.route("/pay/:passport/:plaintId").put((req, res) => {
  let id = db.users.findIndex((item) => +item.passport == +req.params.passport);
  db.users[id].plaints = db.users[id].plaints.map((item) => {
    if (+item.id == +req.params.plaintId) {
      item.status = true;
    }
    return item;
  });

  res.json(db.users[id]);
});

router
  .route("/user", passport.authenticate("jwt", { session: false }))
  .post((req, res) => {
    const { plaints, fullname, passport, address } = req.body;
    console.log(req.body);
    let id = db.users.findIndex((item) => item.passport == passport);
    console.log(id);
    if (id == -1 && !address && !fullname) {
      return res.json({ text: "ผู้ต้องหาใหม่" });
    }
    if (id == -1) {
      let userId = db.users.length ? db.users[db.users.length - 1].id + 1 : 1;
      let plaintList = plaints.map((item, id) => {
        return { id: id + 1, ...item };
      });
      db.users.push({
        id: userId,
        fullname,
        passport,
        address,
        plaints: plaintList,
      });
      return res.json(db.users);
    } else {
      console.log("asd");
      let plaintId = db.users[id].plaints[db.users[id].plaints.length - 1].id;
      let plaintList = plaints.map((item, id) => {
        return { id: plaintId + 1, ...item };
      });
      db.users[id].plaints.push(...plaintList);
      return res.json(db.users[id]);
    }
  });

router
  .route("/users", passport.authenticate("jwt", { session: false }))
  .get((req, res) => {
    res.json(db.users);
  });

router
  .route(
    "/passport/:passport/:plaintId",
    passport.authenticate("jwt", { session: false })
  )
  .put((req, res) => {
    const { title, price, status } = req.body;
    let id = db.users.findIndex(
      (item) => +item.passport == +req.params.passport
    );
    let index = db.users[id].plaints.findIndex(
      (item) => +item.id == +req.params.plaintId
    );
    console.log(req.params.plaintId);
    db.users[id].plaints[index].title = title;
    db.users[id].plaints[index].price = price;
    db.users[id].plaints[index].status = status;
    res.json(db.users[id]);
  })

  .delete((req, res) => {
    let id = db.users.findIndex(
      (item) => +item.passport == +req.params.passport
    );
    db.users[id].plaints = db.users[id].plaints.filter(
      (item) => +item.id !== +req.params.plaintId
    );
    res.json(db.users[id]);
  });

app.use("/api", router);

// Error Handler
app.use((err, req, res, next) => {
  let statusCode = err.status || 500;
  res.status(statusCode);
  res.json({
    error: {
      status: statusCode,
      message: err.message,
    },
  });
});

// Start Server
app.listen(port, () => console.log(`Server is running on port ${port}`));
