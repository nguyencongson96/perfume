import jwt from "jsonwebtoken";
import Tokens from "../model/token.model.js";

const verifyUser = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  console.log(authHeader);
  if (!authHeader?.startsWith("Bearer ")) {
    req.user = false;
    next();
  } else {
    const accessToken = authHeader.split(" ")[1];
    jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) return res.sendStatus(403); //"Invalid Token";
        const foundToken = await Tokens.findOne({ accessToken });
        console.log(foundToken);
        if (!foundToken) return res.sendStatus(403); //"Invalid Token";
        req.user = decoded.userInfo.username;
        req.roles = decoded.userInfo.roles;
        next();
      }
    );
  }
};

export default verifyUser;
