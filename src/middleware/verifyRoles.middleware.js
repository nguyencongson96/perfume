import _throw from "../utils/throw.js";

const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // If the roles property is not defined on the request object, return a 401 Unauthorized status code with an error message
    !req?.roles && _throw(401, "Undefine your permission");

    // Create an array of allowed roles from the function arguments
    const roleArray = [...allowedRoles];

    // Check if any of the roles in the request match an allowed role
    const result = req.roles.map((role) => roleArray.includes(role)).find((val) => val === true);

    // If none of the roles match an allowed role, return a 401 Unauthorized status code with an error message
    !result && _throw(401, "Permission is not granted");

    // If the roles match an allowed role, call the next middleware function
    next();
  };
};

export default verifyRoles;
