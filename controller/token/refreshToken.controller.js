import jwt from "jsonwebtoken";
import Users from "../../model/users.model.js";
import Tokens from "../../model/token.model.js";
import asyncWrapper from "../../middleware/async.middleware.js";
import _throw from "../throw.js";

const handleRefreshToken = asyncWrapper(async (req, res) => {
  const { jwt: refreshToken } = req.cookies;
  //Check whether refreshToken apprear in cookies or not
  !refreshToken && _throw(401);

  //Check the validation of refreshToken in cookies
  const foundToken = await Tokens.findOne({ refreshToken });
  !foundToken && _throw(403);

  //Send new accessToken to frontend
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      const foundUser = await Users.findById(foundToken.userId);
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

      //Save new accessToken to db
      foundToken.accessToken = accessToken;
      await foundToken.save();

      //Send new accessToken to front
      res.json({ accessToken });
    }
  );
});

export default handleRefreshToken;
