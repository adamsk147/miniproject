const {
  SECRET,
  db,
  NOT_FOUND,
  isValidUser,
  checkExistingUser,
} = require("./database.js");
let users = db.admins;

const passport = require("passport");
const bcrypt = require("bcrypt");

const passportJWT = require("passport-jwt"),
  ExtractJWT = passportJWT.ExtractJwt,
  JWTStrategy = passportJWT.Strategy,
  LocalStrategy = require("passport-local").Strategy;

passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    async (username, password, cb) => {
      console.log("User: ", username, password);
      const index = checkExistingUser(username);
      if (index !== NOT_FOUND && (await isValidUser(username, password))) {
        const { id, username, email } = db.admins[index];
        return cb(
          null,
          { id, username, email },
          { message: "Logged In Successfully" }
        );
      } else return cb(null, false, { message: "Incorrect user or password." });
    }
  )
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: SECRET,
    },
    (jwtPayload, cb) => {
      try {
        // find the user in db if needed
        console.log("jwt strategy");
        const index = checkExistingUser(jwtPayload.username);
        if (index !== NOT_FOUND) {
          // Strip password out
          const { id, username, email } = db.admins[index];
          //Return to caller via req.user
          return cb(null, { id, username, email });
        } else {
          return cb(null, false);
        }
      } catch (error) {
        return cb(error, false);
      }
    }
  )
);
