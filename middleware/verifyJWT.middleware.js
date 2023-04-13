import jwt from "jsonwebtoken";
import JWTexception from "../config/JWTexception.config.js";
import Tokens from "../model/token.model.js";

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  console.log(authHeader);
  if (!authHeader?.startsWith("Bearer ")) {
    const foundException = JWTexception.find(
      (item) =>
        item.path.toLowerCase() === req.originalUrl.toLowerCase() &&
        item.method.toLowerCase() === req.method.toLowerCase()
    );
    if (!foundException) return res.sendStatus(401);
    else return next();
  }
  const accessToken = authHeader.split(" ")[1];
  jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) return res.sendStatus(403); //"Invalid Token";
      const foundToken = await Tokens.findOne({ accessToken });
      if (!foundToken) return res.sendStatus(403); //"Invalid Token";
      req.user = decoded.userInfo.username;
      req.roles = decoded.userInfo.roles;
      next();
    }
  );
};

export default verifyJWT;
