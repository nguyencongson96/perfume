import bcrypt from "bcrypt";
import Users from "../../model/Users.js";
import _throw from "../throw.js";

const handleNewUser = async (req, res) => {
  const { user, email, phone, pwd } = req.body;
  try {
    (!user || !pwd || !email || !phone) && _throw(400, "Lack information");

    (user.length < 3 ||
      pwd.length < 8 ||
      !email.includes("@") ||
      phone.length < 10) &&
      _throw(400, "Invalid Input Infor");

    //check for username has already existed in DB or not
    const duplicate = await Users.findOne({ username: user }).exec();
    duplicate && _throw(409, "User has already registered");

    //encypt the password
    const hashedPwd = await bcrypt.hash(pwd, 10);
    //create and store the new user
    const result = await Users.create({
      username: user,
      email: email,
      phone: phone,
      password: hashedPwd,
    });
    console.log(result);
    res.status(201).json({ message: `New user ${user} has been created` });
  } catch (err) {
    console.log(err);
    return res
      .status(err.status || 500)
      .json({ msg: err.msg || "Error occurred while registering" });
  }
};

export default { handleNewUser };
