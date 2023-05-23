import jwt from "jsonwebtoken";
import JWTexception from "#root/config/JWTexception.config.js";
import Tokens from "#root/model/token.model.js";

const verifyJWT = (req, res, next) => {
  // Get the authorization header from the request
  const authHeader = req.headers.authorization || req.headers.Authorization;

  console.log(authHeader); // Log the authorization header to the console

  // If the authorization header doesn't start with "Bearer ", check if there is an exception for this request
  if (!authHeader?.startsWith("Bearer ")) {
    const foundException = JWTexception.find(
      (item) =>
        item.path.toLowerCase() === req.originalUrl.toLowerCase() &&
        item.method.toLowerCase() === req.method.toLowerCase()
    );
    // If there is no exception for this request, return a 401 Unauthorized status code
    if (!foundException) return res.sendStatus(401);
    else return next();
  }

  // If the authorization header starts with "Bearer ", get the access token from it
  const accessToken = authHeader.split(" ")[1];

  // Verify the access token using the secret key
  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
    // If there is an error verifying the token, return a 403 Forbidden status code
    if (err) return res.sendStatus(403);

    // Find the token in the database
    const foundToken = await Tokens.findOne({ accessToken });

    // If the token is not found in the database, return a 403 Forbidden status code
    if (!foundToken) return res.sendStatus(403);

    // Set the user and roles properties of the request object to the values from the decoded token
    req.user = decoded.userInfo.username;
    req.roles = decoded.userInfo.roles;

    // Call the next middleware function
    next();
  });
};

export default verifyJWT;
