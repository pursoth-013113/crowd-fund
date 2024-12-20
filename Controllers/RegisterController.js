const bcrypt= require("bcrypt")
const Register= require("../Models/RegisterSchema")
const {generateToken} = require("../Middlewares/token")
const generateOTP = require("../Utils/OTPgenerator")
const session = require("express-session");
const Sendmail = require("../Utils/Sendmail")
const jwt = require("jsonwebtoken"); 

const RegisterController = async(req,res) =>{
    try {

        console.log(req.body);
        
        let{Password,conformPassword,Email,PhoneNumber,...restbody}=req.body;
    
    
        if(Password != conformPassword ){
         return res.status(400).json("Password doesn't match")
        }
    
    
        let findEmail = await Register.findOne({Email});
        if(findEmail){
           return res.status(400).json("User Already Exist")
        }
    
    
        let splitNumber = PhoneNumber.toString().split('');
        console.log(splitNumber);
        if(splitNumber.length != 10){
            return res.status(400).json("Enter the valid number")
        }
    
    
        let Number = await Register.findOne({PhoneNumber});
        if(Number){
           return res.status(400).json("Phone Number is already registed")
        }
    
        let hashPassword = await bcrypt.hash(Password,8)
    
        let Data = await Register.create({
            ...restbody,
            Password:hashPassword,
            Email,
            PhoneNumber
        })
        console.log("Registered Successfully");
        
        res.status(200).json(Data)
    } 
      
      catch (e) {
        res.status(500).json(e.message)
        
      }
    }

    const Login= async(req,res)=>{
        try {
      
            let {Email,Password} = req.body
            console.log(req.body);
            
      
            if(!Email || !Password)
            {
                return res.json("Enter the required details")
            }
      
            let checkmail = await Register.findOne({Email})
            if(!checkmail)
            {
                return res.status(404).json(`${Email} not found`)
            }
            if(checkmail.status=="blocked"){
                return res.status(400).json (`${Email} is blocked`)
            }
            
            let checkPassword = await bcrypt.compare(Password, checkmail.Password);
      console.log(checkmail);
      
            if(!checkPassword)
            {
                return res.status(400).json("Wrong Password, Enter the Correct Password")
            }
      
            let token= generateToken(checkmail._id);
            console.log(token); 
            
            res.json({
              checkmail,
              token,
              Message:"Login Successfully"
          })
          
      } catch (e) {
          console.log("Error Message:",e.message);
      }
}


const dynamic =async(req,res)=>{
    try {
        let _id=req.headers["_id"];

        let getUser = await Register.findOne({_id});
        console.log(getUser);

    if(!getUser){
        return res.status(400).json("User not found")
    }

    res.status(200).json(getUser);

    } catch (error) {
        console.log(error.message);
        
    }
}

const Recovery=async(req,res)=>{
    try {
    let{Email} =req.body
    const data = await Register.findOne({Email});
    if(!data){
        return res.status(400).json("User Not Found, Please Sign Up first")
    }
    // console.log(data);

    let{Name}=data
    
    let OTP = generateOTP(6);

    
    req.session.OTP = OTP;

    console.log("OTP set in session:", req.session.OTP);


    Sendmail(Email,Name,OTP);
    req.session.email = req.body.Email;
    console.log(req.session.email);
    

    res.status(200).json("OTP was sended to your valid Email");

    
    } catch (error) {
        console.log(error.message);
    }
    
}

const otpVerify = (req,res) =>{
    let {OTP} = req.body;

    let GenerateOtp = req.session.OTP
    console.log(req.session.OTP);
    
    if(OTP !==  GenerateOtp)
    {
       return res.status(400).json("Enter the valid OTP")
    }
    req.session.isOtpVerified = true;
    res.status(200).json("Done, You're verifed")
}

const resetPassword = async(req,res) =>{
    try {
        const { newPassword, confirmPassword } = req.body;
        if (!req.session.isOtpVerified) {
            return res.status(400).json("OTP verification required before resetting password.");
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json("Passwords do not match.");
        }
        console.log(req.session.email);
        
        const data = await Register.findOne({Email:req.session.email});

        console.log(data);
        if (!data) {
            return res.status(404).json("User not found.");
        }
        console.log(newPassword);
        
        const hashedPassword = await bcrypt.hash(newPassword, 8);
        data.Password = hashedPassword;
        await data.save();

        req.session.OTP = null;
        req.session.isOtpVerified = null;
        req.session.email = null;

        res.status(200).json("Password reset successful.");
    } catch (error) {
        console.log(error.message);
        res.status(500).json("Error resetting password.");
    }
};

const Profile=async(req,res)=>{
   try {
    console.log(`Hi! ${userId}`);

   const data= await Register.findOne({ _id: userId })
   res.status(200).json(data)
   console.log(data);
   
   } catch (error) {
    console.log(error.message);
    
   }
   
}

const ProfileUpdate = async(req, res)=>{

    const userId = req.headers.userid; 

    try {
        const updateData = {
            Name: req.body.Name,
            Username: req.body.Username,
            Email: req.body.Email,
            PhoneNumber: req.body.PhoneNumber,
            Address: req.body.Address,
            Pincode: req.body.Pincode,
        };

        const user = await Register.findByIdAndUpdate(userId, updateData, { new: true });
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Profile updated successfully", user });
    } catch (error) {
        console.error("Error updating profile:", error);
    }
    
}

const User =async(req,res)=>{
    const { userId } = req.params;

    try {
        // Find the user by ID
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        console.error("Error fetching user details:", error);
        res.status(500).json({ message: "Error fetching user details", error });
    }
}



module.exports = {RegisterController,Login,dynamic,Recovery,otpVerify,resetPassword,Profile,ProfileUpdate,User};