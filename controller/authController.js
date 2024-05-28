const User = require("../model/authModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const cloudinary = require("cloudinary");

const createUser = async (req, res) => {
    console.log(req.body);

    const { name, phoneno, email, username, address, password } = req.body;

    if (!name || !phoneno || !email || !username || !address || !password) {
        return res.json({
            success: false,
            message: "Please enter all the fields."
        });
    }

    try {
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.json({
                success: false,
                message: "User already exists."
            });
        }

        const randomSalt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(password, randomSalt);

        const newUser = new User({
            name,
            phoneno,
            email,
            username,
            address,
            password: encryptedPassword,
        });

        await newUser.save();
        res.status(200).json({
            success: true,
            message: "User created successfully."
        });

    } catch (error) {
        console.log(error);
        res.status(500).json("Server Error");
    }
};

const loginUser = async (req, res) => {
    console.log(req.body);

    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({
            success: false,
            message: "Please enter all fields."
        });
    }

    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.json({
                success: false,
                message: "User does not exist."
            });
        }

        const isMatched = await bcrypt.compare(password, user.password);
        if (!isMatched) {
            return res.json({
                success: false,
                message: "Invalid Credentials."
            });
        }

        const token = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            process.env.JWT_SECRET
        );

        res.status(200).json({
            success: true,
            message: "User logged in successfully.",
            token: token,
            userData: user
        });

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: "Server Error",
            error: error
        });
    }
};

const changePassword = async (req, res) => {
    console.log("Change password details  ", req.body);

    const { oldPassword, newPassword, userId } = req.body;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.json({
                success: false,
                message: "User not found",
            });
        }

        const isMatched = await bcrypt.compare(oldPassword, user.password);

        if (!isMatched) {
            return res.json({
                success: false,
                message: "Old password is incorrect",
            });
        }

        const newHashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = newHashedPassword;
        await user.save();

        res.json({
            success: true,
            message: "Password changed successfully",
        });
    } catch (error) {
        res.json({
            success: false,
            message: "Server error"
        });
    }
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;
    console.log(email);

    if (!email) {
        return res.status(400).json({
            message: "Please enter your email address",
        });
    }

    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }

        const secret = process.env.JWT_SECRET + user.password;
        const token = jwt.sign({ email: user.email }, secret, { expiresIn: "15m" });

        const link = `http://localhost:5000/api/user/reset-password/${user._id}/${token}`;

        var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "lakhanmgr123@gmail.com",
                pass: "pgpkxvkhfaldwfeq",
            },
        });

        var mailOptions = {
            from: "lakhanmgr123@gmail.com",
            to: email,
            subject: "Password Reset Link",
            text: link,
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log("Email sent:" + info.response);
            }
        });

        res.status(200).json({
            success: true,
            message: "Password reset link sent successfully."
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

const updatePasswordLinkCheck = async (req, res) => {
    const { id, token } = req.params;

    try {
        const oldUser = await User.findOne({ _id: id });
        if (!oldUser) {
            return res.status(404).json({
                message: "User does not exist",
            });
        }

        const secret = process.env.JWT_SECRET + oldUser.password;
        const verify = jwt.verify(token, secret);
        if (verify) {
            res.render("index", { id: id, token: token, email: verify.email });
        }
    } catch (error) {
        res.status(500).json("Password reset link not verified");
    }
};

const updatePassword = async (req, res) => {
    const { id, token } = req.params;
    const { password } = req.body;

    try {
        const oldUser = await User.findOne({ _id: id });
        if (!oldUser) {
            return res.status(404).json({
                message: "User does not exist",
            });
        }

        const secret = process.env.JWT_SECRET + oldUser.password;
        jwt.verify(token, secret);

        const encryptedPassword = await bcrypt.hash(password, 10);
        await User.updateOne(
            { _id: id },
            { $set: { password: encryptedPassword } }
        );

        return res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        res.status(500).json("Password reset failed");
    }
};

const updateUserProfile = async (req, res) => {

    console.log(req.body);
    console.log(req.files)
    
    const userId = req.params.userId;
    const { name, phoneno, email, username, address } = req.body;

    try {
        let user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (req.files && req.files.profileImage) {
            const { profileImage } = req.files;
            const result = await cloudinary.v2.uploader.upload(profileImage.path, {
                folder: 'users',
                crop: 'scale'
            });
            user.profileImage = result.secure_url;
        }

        user.name = name;
        user.phoneno = phoneno;
        user.email = email;
        user.username = username;
        user.address = address;

        user = await user.save();

        res.status(200).json({
            success: true,
            message: 'User profile updated successfully',
            user
        });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
const updateUserBilling = async (req, res) => {

    console.log(req.body);

    const userId = req.params.userId;
    const { address } = req.body;

    try {
        let user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.address = address;

        user = await user.save();

        res.status(200).json({
            success: true,
            message: 'User billing updated successfully',
            user
        });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getUserById = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({
            success: true,
            message: "User found successfully",
            user: user,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();

        if (!users || users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No users found.",
            });
        }

        res.status(200).json({
            success: true,
            users: users,
        });
    } catch (error) {
        console.error("Error getting users:", error);
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
};

module.exports = {
    createUser,
    loginUser,
    changePassword,
    getUserById,
    updatePassword,
    updatePasswordLinkCheck,
    forgotPassword,
    updateUserProfile,
    updateUserBilling,
    getAllUsers,
};
