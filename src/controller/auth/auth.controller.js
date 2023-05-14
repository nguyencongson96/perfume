import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Users from "#root/model/users.model.js";
import Tokens from "#root/model/token.model.js";
import _throw from "#root/utils/throw.js";
import currentTime from "#root/utils/currentTime.js";
import userField from "#root/config/auth/userField.config.js";
import asyncWrapper from "#root/middleware/async.middleware.js";

const authController = {
  logIn: asyncWrapper(async (req, res) => {
    const { user, password } = req.body;

    const foundUser = await Users.findOne({ username: user }).exec();
    !foundUser && _throw(404, "User not found");

    // Evaluate password
    const match = await bcrypt.compare(password, foundUser.password);
    !match && _throw(401, "Password has not matched");

    //Create JWTs
    const foundRoles = Object.values(foundUser.roles).filter((role) => role !== undefined);

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
    const refreshToken = jwt.sign({ username: foundUser.username }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
    });

    //Save token to db
    await Tokens.findOneAndUpdate(
      { userId: foundUser._id },
      { userId: foundUser._id, accessToken, refreshToken },
      { runValidators: true, upsert: true, new: true }
    );

    //Send accessToken to frontend
    return res.status(200).json({
      username: foundUser.username,
      roles: foundRoles,
      accessToken,
      refreshToken,
    });
  }),

  update: asyncWrapper(async (req, res) => {
    const cookie = req.signedCookies,
      time = currentTime();
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
    Object.assign(foundUser, { lastUpdateAt: time, lastActiveAt: time });

    await foundUser.save();
    res.status(200).json(`user ${foundUser.username} update successfully`);
  }),

  logOut: asyncWrapper(async (req, res) => {
    const cookie = req.signedCookies;

    //Check whether jwt key exist in cookie
    if (!cookie.jwt) return res.sendStatus(401);

    //Check validation of refreshToken get from jwt key
    const refreshToken = cookie.jwt;

    // Update Token save in db
    const foundToken = await Tokens.findOneAndUpdate({ refreshToken }, { accessToken: "", refreshToken: "" });

    //If user cannot be found, then throw http code 403
    !foundToken && _throw(403);

    //Update user's last active
    await Users.findByIdAndUpdate(foundToken.userId, {
      lastActiveAt: currentTime(),
    });

    //Clear cookie
    res.clearCookie("jwt");

    //Throw status code 204 if success
    return res.status(200).json("Log out successfully");
  }),

  register: asyncWrapper(async (req, res) => {
    const { user, email, phone, password } = req.body;

    //check for username has already existed in DB or not
    (await Users.findOne({ username: user })) && _throw(409, "User has existed");
    (await Users.findOne({ email: email })) && _throw(409, "Email has existed");
    (await Users.findOne({ phone: phone })) && _throw(409, "Phone has existed");

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
    res.status(201).json(`New user ${result.username} has been created`);
  }),
};

export default authController;
