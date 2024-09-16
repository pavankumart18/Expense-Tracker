import passport from "passport";
import bcryptjs from "bcryptjs";

import User from "../models/user.model.js";
import { GraphQLLocalStrategy, buildContext } from "graphql-passport";

export const configurePassport = async () =>{
    passport.serializeUser((user, done) => {
        console.log("serializeUser");
        done(null, user._id);
    });

    passport.deserializeUser(async (userId, done) => {
        console.log("deserializeUser");
        try {
            const user = await User.findById(userId);
            done(null, user);
        } catch (error) {
            done(error);
        }
    });

    passport.use(
        new GraphQLLocalStrategy(async (username, password, done) => {
            try {
                const user = await User.findOne({ username  });
                if(!user){
                    throw new Error("User not found");
                }

                const isPasswordValid = await bcryptjs.compare(password, user.password);
                if(!isPasswordValid){
                    throw new Error("Invalid password");
                }

                return done(null, user);

            }catch (err) {
                return done(err);
            }
        }
    ))
}