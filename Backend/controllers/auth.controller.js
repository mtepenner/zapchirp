import bcrypt from "bcryptjs";
import User from '../models/user.model.js';
import generateTokenAndSetCookie from '../utils/generateToken.js';

export const signup = async (req, res) => {
    try {
      const { fullName, username, email, password, gender } = req.body;  
      
      // 1. ADD VALIDATION to prevent crashes
      if (!fullName || !username || !email || !password || !gender) {
          return res.status(400).json({ error: "All fields are required" });
      }

      const user = await User.findOne({ username });

      if (user) {
        return res.status(400).json({ error: "Username already exists." });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      // Avatar placeholder
      const maleProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
      const femaleProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

      const newUser = new User({
        fullName,
        username,
        email,
        password: hashedPassword,
        gender,
        profilePic: gender === "male" ? maleProfilePic : femaleProfilePic
      });

      // 2. SAVE FIRST, THEN SET COOKIE
      await newUser.save();
      generateTokenAndSetCookie(newUser._id, res);

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        email: newUser.email,
        gender: newUser.gender,
        profilePic: newUser.profilePic
      });

    } catch (error) {
        // 3. HANDLE DUPLICATE KEYS (e.g., Email already taken)
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            return res.status(400).json({ error: `An account with that ${field} already exists.` });
        }

        console.log("Error in signup controller: ", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const login = async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
      }

      const user = await User.findOne({ username });

      if (!user) {
          return res.status(400).json({ error: "Invalid username or password" });
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.password);

      if (!isPasswordCorrect) {
          return res.status(400).json({ error: "Invalid username or password" });
      }

      // Generate JWT token
      const token = generateTokenAndSetCookie(user._id, res);

      res.status(200).json({
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        profilePic: user.profilePic,
        token
      });
    } catch(error) {
      console.log("Error in login controller: ", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
};

export const logout = async (req, res) => {
    try {
      res.cookie("jwt", "", { maxAge: 0 });
      res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      console.log("Error in logout controller: ", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
};
