import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Users from "../../model/Users.js";
import _throw from "../throw.js";

const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;
  try {
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
      secure: "true",
    });

    //Send Access Token to front
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
};

export default { handleLogin };
