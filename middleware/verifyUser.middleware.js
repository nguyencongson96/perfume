import jwt from "jsonwebtoken";

const verifyUser = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  console.log(authHeader);
  if (!authHeader?.startsWith("Bearer ")) {
    req.user = false;
    next();
  } else {
    const accessToken = authHeader.split(" ")[1];
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.sendStatus(403); // Invalid Token
      req.user = decoded.userInfo.username;
      req.roles = decoded.userInfo.roles;
      req.token = accessToken;
      next();
    });
  }
};

export default verifyUser;
