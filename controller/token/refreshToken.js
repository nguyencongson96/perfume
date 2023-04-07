import jwt from "jsonwebtoken";
import Users from "../../model/Users.js";
import _throw from "../throw.js";

const handleRefreshToken = async (req, res) => {
  try {
    const { jwt: refreshToken } = req.signedCookies;
    //Check whether refreshToken apprear in cookies or not
    !refreshToken && _throw(401);

    //Check the validation of refreshToken in cookies
    const foundUser = await Users.findOne({ refreshToken }).exec();
    !foundUser && _throw(403);

    //Send new accessToken to frontend
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        (err || foundUser.username !== decoded.username) && _throw(403);
        const accessToken = jwt.sign(
          {
            UserInfo: {
              username: foundUser.username,
              roles: Object.values(foundUser.roles),
            },
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION }
        );
        res.json({ accessToken });
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(err.status || 500).json({
      msg: err.msg || "Error occurred while getting new refreshToken",
    });
  }
};

export default handleRefreshToken;
