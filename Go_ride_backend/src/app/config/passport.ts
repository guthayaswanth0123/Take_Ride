/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from "passport";

import { Strategy as LocalStrategy } from "passport-local";
import bcryptjs from "bcryptjs";
import { User } from "../modules/user/user.model";
import { IsBlock, Role } from "../modules/user/user.interface";
import { envVars } from "./env";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email: string, password: string, done) => {
      try {
        const cleanEmail = email ? email.trim() : "";
        const isUserExist = await User.findOne({
          email: { $regex: new RegExp(`^${cleanEmail}$`, "i") },
        });

        if (!isUserExist) {
          return done(null, false, { message: "User does not exist" });
        }

        // if (!isUserExist.isVerified) {
        //   return done(null, false, { message: "User is not verified" });
        // }

        if (isUserExist.isBlock === IsBlock.BLOCK) {
          return done(null, false, { message: "User is blocked" });
        }

        if (isUserExist.isDeleted) {
          return done(null, false, { message: "User is deleted" });
        }

        const isPasswordMatched = await bcryptjs.compare(
          password as string,
          isUserExist.password as string
        );

        if (!isPasswordMatched) {
          return done(null, false, { message: "Password does not match" });
        }

        return done(null, isUserExist);
      } catch (error) {
        console.log(error);
        done(error);
      }
    }
  )
);

// for google login
passport.use(
  new GoogleStrategy(
    {
      clientID: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      callbackURL: envVars.GOOGLE_CALLBACK_URL,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
           const email = profile.emails?.[0].value;
        if (!email) {
          return done(null, false, { message: "No email found" });
        }

        let isUserExist = await User.findOne({ email });

        if (isUserExist && !isUserExist.isVerified) {
          return done(null, false, {message: "User is not Verified"})
        }

        if (
          isUserExist &&
          (isUserExist.isBlock === IsBlock.BLOCK)
        ) {
          done(`User is Blocked`);
        }

        if (isUserExist && isUserExist.isDeleted) {
          return done(null, false, {message: "User is deleted"});
        }

        if (!isUserExist) {
          isUserExist = await User.create({
            email,
            name: profile.displayName,
            picture: profile.photos?.[0].value,
            role: Role.RIDER,
            isVerified: true,
            auths: [
              {
                provider: "google",
                providerId: profile.id,
              },
            ],
          });
        }
        return done(null, isUserExist);
      } catch (error) {
        // console.log("Google Strategy Error", error);
        return done(error);
      }
    }
  )
);

passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done: any) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    console.log(error);
    done(error);
  }
});