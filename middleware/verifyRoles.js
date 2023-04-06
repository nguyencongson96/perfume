const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.roles) {
      return res.status(401).json({ msg: "Undefine your permission" });
    }
    const roleArray = [...allowedRoles];
    const result = req.roles
      .map((role) => roleArray.includes(role))
      .find((val) => val === true);
    if (!result)
      return res.status(401).json({ msg: "Permission is not granted" });
    next();
  };
};

export default verifyRoles;
