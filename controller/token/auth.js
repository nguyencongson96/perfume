import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Users from "../../model/Users.js";
import _throw from "../throw.js";

const authController = {
  logIn: async (req, res) => {
    try {
      const { user, pwd } = req.body;

      //Input validation
      (!user || user.length < 3 || !pwd || pwd.length < 8) &&
        _throw(400, "Invalid username or password");

      const foundUser = await Users.findOne({ username: user }).exec();
      !foundUser && _throw(401, "User not found");

      // Evaluate password
      const match = await bcrypt.compare(pwd, foundUser.password);
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

      //Saving refresh token with current User
      foundUser.refreshToken = refreshToken;
      await foundUser.save();

      //Add refresh Token to Cookie
      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        maxAge:
          parseInt(process.env.REFRESH_TOKEN_EXPIRATION) * 24 * 60 * 60 * 1000,
        sameSite: "Lax",
        secure: true,
        signed: true,
      });

      //Send accessToken to frontend
      res.json({
        username: foundUser.username,
        roles: foundRoles,
        accessToken: accessToken,
      });
    } catch (err) {
      console.log(err);
      return res
        .status(err.status || 500)
        .json({ msg: err.msg || "Error occurred while logging in" });
    }
  },
  logOut: async (req, res) => {
    try {
      const cookie = req.signedCookies;
      //Check whether jwt key exist in cookie
      if (!cookie.jwt) return res.sendStatus(204);

      const refreshToken = cookie.jwt;
      //Clear cookie
      res.clearCookie("jwt");

      //Check validation of refreshToken get from jwt key
      const foundUser = await Users.findOne({ refreshToken });
      !foundUser && _throw(403);

      // Delete Refresh Token
      foundUser.refreshToken = "";
      await foundUser.save();
      res.sendStatus(204);
    } catch (err) {
      console.log(err);
      return res
        .status(err.status || 500)
        .json({ msg: err.msg || "Error occurred while logging out" });
    }
  },
  register: async (req, res) => {
    const { user, email, phone, pwd } = req.body;
    try {
      (!user || !pwd || !email || !phone) && _throw(400, "Lack infor");

      //Check input validation
      user.length < 3 && _throw(400, "Username too short");
      pwd.length < 8 && _throw(400, "Password too short");
      !email.includes("@") && _throw(400, "Invalid email");
      phone.length < 10 && _throw(400, "Invalid phone number");

      //check for username has already existed in DB or not
      const duplicate = await Users.findOne({ username: user }).exec();
      duplicate && _throw(409, "User has existed");

      //encypt the password
      const hashedPwd = await bcrypt.hash(pwd, 10);
      //create and store the new user
      const result = await Users.create({
        username: user,
        email: email,
        phone: phone,
        password: hashedPwd,
      });
      console.log(result);
      res.status(201).json({ message: `New user ${user} has been created` });
    } catch (err) {
      console.log(err);
      return res
        .status(err.status || 500)
        .json({ msg: err.msg || "Error occurred while registering" });
    }
  },
};

export default authController;
