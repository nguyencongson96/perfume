import jwt from "jsonwebtoken";
import Users from "../../model/Users.js";
import _throw from "../throw.js";

const handleRefreshToken = async (req, res) => {
  const { jwt: refreshToken } = req.cookies;

  try {
    !refreshToken && _throw(401);
    const foundUser = await Users.findOne({ refreshToken }).exec();
    !foundUser && _throw(403);

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
        // Return the new access token in the response
        res.json({ accessToken });
      }
    );
  } catch (err) {
    console.log(err);
    return res
      .status(err.status || 500)
      .json({
        msg: err.msg || "Error occurred while getting new refreshToken",
      });
  }
};

export default handleRefreshToken;
