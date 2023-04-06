import Users from "../../model/Users.js";
import _throw from "../throw.js";

const handleLogOut = async (req, res) => {
  try {
    const cookie = req.cookies;
    if (!cookie.jwt) return res.sendStatus(204);
    const refreshToken = cookie.jwt;
    res.clearCookie("jwt", {
      httpOnly: true,
      maxAge: 1 * 24 * 60 * 60 * 1000,
      sameSite: "Lax",
      secure: "true",
    });
    const foundUser = await Users.findOne({ refreshToken });
    !foundUser && _throw(403);

    // Delete Refresh Token
    foundUser.refreshToken = "";
    await foundUser.save();
    res.sendStatus(204);
  } catch (err) {
    console.log(err);
    return res
      .status(err.status || 500)
      .json({ msg: err.msg || "Error occurred while logging out" });
  }
};

export default handleLogOut;
