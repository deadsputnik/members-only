const passport = require("passport");
const LocalStrategy = require("passport-local");
const pool = require("./db/pool");
const bcrypt = require("bcryptjs");

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const { rows } = await pool.query(
        "SELECT * FROM users WHERE username = $1",
        [username],
      );
      const user = rows[0];
      if (!user) {
        console.log("incorrect username");
        return done(null, false, { message: "Incorrect username" });
      }
      bcrypt.compare(password, user.password_hash, (err, result) => {
        if (err) return done(err);
        if (!result) {
          console.log("incorrect pass");
          return done(null, false, { message: "Incorrect password" });
        }
        console.log("correct password");
        return done(null, user);
      });
    } catch (error) {
      return done(error);
    }
  }),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [
      id,
    ]);
    const user = rows[0];

    done(null, user);
  } catch (error) {
    done(error);
  }
});
