// import { env } from "process";
// import { passport } from "passport";


// var FortyTwoStrategy = require('passport-42').Strategy;

// passport.use(new FortyTwoStrategy({
//     clientID: env.FORTYTWO_APP_ID,
//     clientSecret: env.FORTYTWO_APP_SECRET,
//     callbackURL: "http://127.0.0.1:3000/auth/42/callback"
//   },
//   function(accessToken, refreshToken, profile, cb) {
//     User.findOrCreate({ fortytwoId: profile.id }, function (err, user) {
//       return cb(err, user);
//     });
//   }
// ));