import jwt from "jsonwebtoken";

const verifyUser = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  console.log(authHeader);
  if (!authHeader?.startsWith("Bearer ")) {
    req.user = false;
    next();
  } else {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.sendStatus(403); // Invalid Token
      req.user = decoded.userInfo.username;
      req.roles = decoded.userInfo.roles;
      next();
    });
  }
};

export default verifyUser;
