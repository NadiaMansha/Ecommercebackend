const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/mail");
const crypto = require("crypto");

// @desc    Get all users
// @route   GET /users
// @access  private

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").lean();
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
//@desc create a new user
//@route POST /users/create
//@access public
const createUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    //check data
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ success: false, error: "Please provide all the fields" });
    }
    //check duplicate
    const duplicate = await User.findOne({ email }).lean().exec();
    if (duplicate) {
      return res
        .status(400)
        .json({ success: false, error: "Email already exists" });
    }
    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    //create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
    });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
      });
      res.status(200).json({
        success: true,
        data: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        token,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
//@desc get a user
//@route GET /users/:id
//@access private
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password").lean();
    if (!user) {
      return res.status(400).json({ success: false, error: "No user found" });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
//@desc update a user
//@route PUT /users/update/:id
//@access private
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(400).json({ success: false, error: "No user found" });
    }
    const { username, email, password, role ,country,city} = req.body;
    if (username) {
      user.username = username;
    }
    if (email) {
      user.email = email;
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }
    if (role) {
      user.role = role;
    }
    if (country) {
      user.country = country;
    }
    if (city) {
      user.city = city;
    }
    await user.save();
    return res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
//@desc delete a user
//@route DELETE /users/dlete/:id
//@access private
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(400).json({ success: false, error: "No user found" });
    }
    console.log(user);
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
//@desc loginUser
//@route POST /users/login
//@access public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, error: "Please provide email and password" });
    }
    const user = await User.findOne({ email }).lean();
    if (!user) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    });
    res.cookie("token", token, {
      httpOnly: true,
     
    });
    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

//@desc forgot password
//@route POST /users/forgotpassword
//@access private

const forgotPasswordRequest = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, error: "Please provide email" });
    }

    //check if user exists
    const user = User.findOne({ email }).lean();
    if (!user) {
      return res.status(400).json({ success: false, error: "No user found" });
    }
    //generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    //create reset url
    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/users/resetpassword/${resetToken}`;
    //send email
    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;
    try {
      await sendEmail({
        email: user.email,
        subject: "Password reset token",
        message,
      });
      res.status(200).json({ success: true, data: "Email sent" });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      return res.status(500).json({ success: false, error: error.message });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });

  }
};

  const resetPassword = async (userId, token, password) => {
       
  
    if (!token) {
      throw new Error("Invalid or expired password reset token");
    }
  
  
    const isValid = await bcrypt.compare(token, passwordResetToken.token);
  
    if (!isValid) {
      throw new Error("Invalid or expired password reset token");
    }
  
    const hash = await bcrypt.hash(password, Number(bcryptSalt));
  
    await User.updateOne(
      { _id: userId },
      { $set: { password: hash } },
      { new: true }
    );
  
    const user = await User.findById({ _id: userId });
  
    sendEmail(
      user.email,
      "Password Reset Successfully",
      {
        name: user.name,
      },
      "./template/resetPassword.handlebars"
    );
  
    await passwordResetToken.deleteOne();
  
    return { message: "Password reset was successful" };
  };
    
    

//@desc google auth
//@route POST /users/googleauth
//@access public
const { OAuth2Client } = require('google-auth-library');




const googleAuth = async (req, res) => {
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function verifyGoogleAccessToken(token) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return payload;
  } catch (error) {
    console.log(error);
    return null;
  }
}
  const { token } = req.body;
  const payload = await verifyGoogleAccessToken(token);
  if (payload === null) {
    return res.sendStatus(401);
  }
  // Authentication succeeded, send a response to the frontend
  res.send(payload);
 
};



//@desc logout user
//@route GET /users/logout
//@access private
const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  forgotPasswordRequest,
  resetPassword,
  googleAuth,
  logoutUser,

};
