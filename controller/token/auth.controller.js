import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Users from "../../model/users.model.js";
import Tokens from "../../model/token.model.js";
import _throw from "../throw.js";
import currentTime from "../../config/currentTime.js";
import userField from "../../config/userField.config.js";
import asyncWrapper from "../../middleware/async.middleware.js";

const authController = {
  logIn: asyncWrapper(async (req, res) => {
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
      httpOnly: true,
      maxAge:
        parseInt(process.env.REFRESH_TOKEN_EXPIRATION) * 24 * 60 * 60 * 1000,
      sameSite: "Lax",
      secure: true,
      signed: true,
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
  }),
  update: asyncWrapper(async (req, res) => {
    const cookie = req.signedCookies;
    //Check whether jwt key exist in cookie
    !cookie.jwt && _throw(401);
    //Check validation of refreshToken get from jwt key
    const foundToken = await Tokens.findOne({ refreshToken: cookie.jwt });
    //If token cannot be found, then throw http code 403
    !foundToken && _throw(403);
    // Update Token save in db by each key of user
    const foundUser = await Users.findOne({
      _id: foundToken.userId,
      username: req.user,
    });

    //Update field of user
    for (const key of userField) {
      const val = req.body[key];
      //Only processing update if user send any value
      val &&
        //If key is username then find in db to check whether this new val is already existed or not
        (key === "username" && (await Users.findOne({ username: val }))
          ? //Throw error if username existed
            _throw(400, "Username has been registered")
          : //Throw error if email existed
          key === "email" && (await Users.findOne({ email: val }))
          ? _throw(400, "Email has been registered")
          : //If key is password then encode it and save
          key === "password"
          ? (foundUser[key] = await bcrypt.hash(val, 10))
          : //Otherwise, save it
            (foundUser[key] = val));
    }

    //Update time
    foundUser.lastUpdateAt = currentTime();
    foundUser.lastActiveAt = currentTime();
    console.log(foundUser);
    await foundUser.save();
    res.status(200).json(`user ${foundUser.username} update successfully`);
  }),
  logOut: asyncWrapper(async (req, res) => {
    const cookie = req.signedCookies;
    //Check whether jwt key exist in cookie
    if (!cookie.jwt) return res.sendStatus(204);
    //Check validation of refreshToken get from jwt key
    const refreshToken = cookie.jwt;
    // Update Token save in db
    const foundToken = await Tokens.findOneAndUpdate(
      { refreshToken },
      { accessToken: "", refreshToken: "" }
    );
    //Update user's last active
    const foundUser = await Users.findByIdAndUpdate(foundToken.userId, {
      lastActiveAt: currentTime(),
    });
    //If user cannot be found, then throw http code 403
    !foundUser && _throw(403);

    //Clear cookie
    res.clearCookie("jwt");

    //Throw status code 204 if success
    res.status(200).json("Log out successfully");
  }),
  register: asyncWrapper(async (req, res) => {
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
      createAt: currentTime(),
    });
    console.log(result);
    res.status(201).json(`New user ${user} has been created`);
  }),
};

export default authController;
