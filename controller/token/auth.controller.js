import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Users from "../../model/users.model.js";
import Tokens from "../../model/token.model.js";
import _throw from "../throw.js";

const authController = {
  logIn: async (req, res) => {
    try {
      const { user, password } = req.body;

      //Input validation
      (!user || !password) && _throw(400, "Invalid username or password");

      const foundUser = await Users.findOne({ username: user }).exec();
      !foundUser && _throw(401, "User not found");

      // Evaluate password
      const match = await bcrypt.compare(password, foundUser.password);
      !match && _throw(401, "Password has not matched");

      //Create JWTs
      const foundRoles = Object.values(foundUser.roles).filter(
        (role) => role !== undefined
      );

      //Generate new accessToken
      const accessToken = jwt.sign(
        {
          userInfo: {
            username: foundUser.username,
            roles: foundRoles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION }
      );

      //Generate new refreshToken
      const refreshToken = jwt.sign(
        { username: foundUser.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION }
      );

      //Add refresh Token to Cookie
      res.cookie("jwt", refreshToken, {
        // httpOnly: true,
        maxAge:
          parseInt(process.env.REFRESH_TOKEN_EXPIRATION) * 24 * 60 * 60 * 1000,
        sameSite: "Lax",
        secure: true,
        // signed: true,
      });

      //Save token to db
      const foundToken = await Tokens.findOne({ userId: foundUser._id });
      if (!foundToken) {
        const newTokenUser = await Tokens.create({
          userId: foundUser._id,
          accessToken,
          refreshToken,
        });
        console.log(newTokenUser);
      } else {
        foundToken.accessToken = accessToken;
        foundToken.refreshToken = refreshToken;
        await foundToken.save();
      }

      //Send accessToken to frontend
      res.json({
        username: foundUser.username,
        roles: foundRoles,
        accessToken: accessToken,
      });
    } catch (err) {
      console.log(err);
      err.name === "ValidationError"
        ? res.status(400).json(
            Object.keys(err.errors).reduce((obj, key) => {
              obj[key] = err.errors[key].message;
              return obj;
            }, {})
          )
        : err.status
        ? res.status(err.status).json(err.msg)
        : res.status(500).send("Error occurred while logging in");
    }
  },
  logOut: async (req, res) => {
    try {
      const cookie = req.cookies;
      //Check whether jwt key exist in cookie
      if (!cookie.jwt) return res.sendStatus(204);

      //Check validation of refreshToken get from jwt key
      const refreshToken = cookie.jwt;
      // Delete Refresh Token
      const foundToken = await Tokens.findOneAndUpdate(
        { refreshToken },
        { accessToken: "", refreshToken: "" }
      );
      !foundToken && _throw(403);

      //Clear cookie
      res.clearCookie("jwt");

      res.sendStatus(204);
    } catch (err) {
      console.log(err);
      err.status
        ? res.status(err.status).json(err.msg)
        : res.status(500).send("Error occurred while logging out");
    }
  },
  register: async (req, res) => {
    try {
      const { user, email, phone, password } = req.body;

      //check for username has already existed in DB or not
      const duplicate = await Users.findOne({ username: user }).exec();
      duplicate && _throw(409, "User has existed");

      //encypt the password
      const hashedPwd = await bcrypt.hash(password, 10);
      //create and store the new user
      const result = await Users.create({
        username: user,
        email: email,
        phone: phone,
        password: hashedPwd,
      });
      console.log(result);
      res.status(201).json(`New user ${user} has been created`);
    } catch (err) {
      console.log(err);
      err.name === "ValidationError"
        ? res.status(400).json(
            Object.keys(err.errors).reduce((obj, key) => {
              obj[key] = err.errors[key].message;
              return obj;
            }, {})
          )
        : err.status
        ? res.status(err.status).json(err.msg)
        : res.status(500).json("Error occurred while registering");
    }
  },
};

export default authController;
