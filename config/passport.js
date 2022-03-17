const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User')


module.exports = async (passport) => {
    await passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/callback"
    },
        async function (accessToken, refreshToken, profile, cb) {

            console.log(profile);

            // const user = User.findOne({ googleId: profile.id });

            // try {
            //     if (user) {
            //         // demak user bazada bor
            //         cb(null, user)
            //     } else {
            //         // demak user ni yaratish kerak
            //         const user = await User.create({
            //             googleId: profile.id,
            //             name: profile.name.givenName,
            //             surname: profile.name.familyName,
            //             photo: profile.photos[0].value
            //         })

            //         cb(null, user)
            //     }
            // } catch (error) {
            //     console.error(error);
            // }
        }
    ));


    // passport.serializeUser(function (user, done) {
    //     done(null, user.id);
    // });

    // passport.deserializeUser(function (id, done) {
    //     User.findById(id, function (err, user) {
    //         done(err, user);
    //     });
    // });

}