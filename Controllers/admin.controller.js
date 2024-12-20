const Register = require("../Models/RegisterSchema");
const Fundraiser =  require("../Models/campaignModel");
const Amount = require("../Models/payment.model");
const PendingFundraiser = require("../Models/campaignModel")
const moment = require("moment")

const Dashboard = async(req,res) =>{

    try {
        const User = await Register.find();
        const Campaigns =  await Fundraiser.find({status:"approved"});
        const AmountDetails = await Amount.find();

        let totalAmountRaised = 0;
        for (let i = 0; i < AmountDetails.length; i++) {
            totalAmountRaised += AmountDetails[i].amount;
        }

        const today = moment().startOf('day');
        const sevenDaysAgo = moment().subtract(7, 'days').startOf('day');

        const totalAmountLast7Days = AmountDetails.reduce((sum, amountDetail) => {
            const createdAt = moment(amountDetail.createdAt);
            if (createdAt.isBetween(sevenDaysAgo, today, null, '[]')) {
                return sum + amountDetail.amount;
            }
            return sum;
        }, 0);

        const Pending = await PendingFundraiser.find();
        console.log(Pending);
        
        const pendingCount = Pending.filter((item) => item.status === "pending").length;
        
        console.log("Count of pending fundraisers:", pendingCount);
        


        let UserLength = User.length;
        let Campaignslength = Campaigns.length;

       console.log(totalAmountLast7Days);
       
        

        res.status(200).json({
            UserLength,
            Campaignslength,
            totalAmountRaised,
            totalAmountLast7Days,
             pendingCount 

        })
        
        
    } catch (error) {
        console.log(error.message);
        
    }
    
}

const User = async (req,res) =>{
    try {
        console.log("hi");
        
        const userdetails = await Register.find();
        console.log(userdetails);
        res.status(200).json(userdetails)

        console.log("done");
        
        
    } catch (error) {
        console.log(error.message);
        
    }
}

const add = async(req,res) =>{
    const{Name,Email,status}=req.body
    console.log(status);
    
    try {
        const data = await Register.create({Name,Email,status});

        console.log(data);

        res.status(200).json("Data saved Successfully")
        
    } catch (error) {
        console.log(error.message);
    }
}
const block = async (req, res) => {
    const { _id } = req.params;
  
    try {
      const updatedUser = await Register.findByIdAndUpdate(_id,{ status:"blocked"});

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      console.log("User blocked:", updatedUser);
  
      res.status(200).json({
        message: "User successfully blocked",
        data: updatedUser,
      });
    } catch (error) {
      console.error("Error blocking user:", error);
  
      res.status(500).json({ message: "Internal server error" });
    }
  };

  const unblock = async(req,res)=>{
    const {_id} = req.params

    try {
        const updateUser =  await Register.findByIdAndUpdate(_id,{status:"active"})

        if(!updateUser){
            res.status(200).json({Message:"User not found"})
        }

        res.status(200).json({Message:"status is updated",updateUser})
    } catch (error) {
        console.log(error.message);
    }
  }

  const deleteUser = async (req, res) => {
    const { _id } = req.params;
  
    try {
      const deletedUser = await Register.findByIdAndDelete(_id);
    //   if (!deletedUser) {
    //     return res.status(404).json({ message: 'User not found' });
    //   }
      res.status(200).json({ message: 'User deleted successfully', deletedUser });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ message: 'Internal server error', error });
    }
  };

  const fetch = async(req,res)=>{
    
    const data = await Fundraiser.find();
    res.status(200).json({Message:"Successful",data})
    console.log(data);
    
    
  }

  const DeleteUser = async (req, res) => {
    const { _id } = req.params;
  
    console.log("Received ID for deletion:", _id);
  
    try {
      const deletedUser = await Fundraiser.findByIdAndDelete(_id);
  
      res.status(200).json({ message: 'User deleted successfully' });
      console.log("User deleted successfully:", _id);

    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: 'Internal server error', error });
    }
  };
  
module.exports = {Dashboard,User,add,block,unblock,deleteUser,fetch,DeleteUser}