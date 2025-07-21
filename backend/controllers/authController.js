const bcrypt=require('bcryptjs')
const User=require('../models/User')
const jwt=require('jsonwebtoken')
const register=async(req,res)=>{
    try{
        const {username,email,password}=req.body;

        const existingUser=await User.findOne({email})
        if(existingUser){
            return res.status(400).json({message:"Usr already exist"})
        }

        const hashedpassword=await bcrypt.hash(password,10);

        const newUser=new User({
            username,
            email,
            password:hashedpassword,
        })

        await newUser.save();

        res.status(200).json({message:"User registered successfully "})
        
    }
    catch(err){
        res.status(500).json({message:"server error"+err.message})
    }
}

    const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '12h' });
    res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { 
};
module.exports={register,login}