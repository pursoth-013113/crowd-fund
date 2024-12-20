const cloudinary = require("../Utils/cloudynary");
const pendingFundraiser = require("../Models/campaignModel")
const QuerySchema = require("../Models/Quries");
const FeedbackSchema = require("../Models/feedback.model")
const  Payment = require("../Models/payment.model")
const Fundraiser = require("../Models/Approved.Model")
const Donation = require("../Models/Donation.model");
const createFundraiser = async (req, res) => {
    try {
        const { fundraiserName, title, totalAmount, endDate, category, about, userId } = req.body;
        const { bannerImage, profileImage, patientImages } = req.files;

        const uploadSingleImage = async (file) => {
            const result = await cloudinary.uploader.upload(file.path);
            return result.secure_url;
        };

        const bannerImageUrl = await uploadSingleImage(bannerImage[0]);
        const profileImageUrl = await uploadSingleImage(profileImage[0]);
        const patientImageUrls = await Promise.all(
            patientImages.map((file) => uploadSingleImage(file))
        );
        const newPending = await pendingFundraiser.create({
            userId,
            fundraiserName,
            title,
            totalAmount,
            endDate,
            category,
            about,
            bannerImage: bannerImageUrl,
            profileImage: profileImageUrl,
            patientImages: patientImageUrls,
            status: 'pending',
            submitted_at: new Date()
        });

        res.status(200).json({
            success: true,
            message: "Fundraiser submitted for approval.",
            fundraiser: newPending
        });

        console.log("Fundraiser submitted for approval:", newPending);

    } catch (err) {
        console.error("Error submitting fundraiser for approval:", err);
        res.status(500).json({ error: "Failed to submit fundraiser for approval." });
    }
};

const PendingCard = async (req, res) => {
    try {
        console.log("hi");
        
        const PendingFundraisers = await pendingFundraiser.find({status:"pending"});
        console.log(PendingFundraisers);
        
        res.status(200).json(PendingFundraisers);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch pending fundraisers.' });
    }
};


const Approve= async (req, res) => {
    const { campaignId } = req.params;
    console.log(campaignId);
    

    if (!campaignId) {
        return res.status(400).json({ error: 'Fundraiser ID is required.' });
    }

    try {
        const PendingFundraiser = await pendingFundraiser.findById(campaignId);

        console.log(PendingFundraiser);
        

        if (!PendingFundraiser) {
            return res.status(404).json({ error: 'Fundraiser not found.' });
        }

        const approvedFundraiser = await Fundraiser.create({
            ...PendingFundraiser.toObject(),
            _id: undefined,
            approved_at: new Date(),
            status: 'approved'
        });
        

        console.log(approvedFundraiser);

        PendingFundraiser.status = 'approved';
        await PendingFundraiser.save();
    
        return res.status(200).json({
            message: 'Fundraiser approved successfully.',
            fundraiser: approvedFundraiser  // Return the approved fundraiser details
        });

    } catch (err) {
        console.error('Error approving fundraiser:', err);
        return res.status(500).json({ error: 'Failed to approve fundraiser.' });
    }
};

const Reject= async (req, res) => {
    const {campaignId} =  req.params
    console.log(campaignId);
    
    try {
        const PendingFundraiser = await pendingFundraiser.findById(campaignId);
        if (!pendingFundraiser) return res.status(404).json({ error: 'Fundraiser not found.' });

        console.log(PendingFundraiser);
        

        PendingFundraiser.status = 'rejected';
        
        // PendingFundraiser.rejection_reason = reason;
        await PendingFundraiser.save();

        res.status(200).json({ message: 'Fundraiser rejected successfully.' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to reject fundraiser.' });
    }
};




    const fetchCard = async (req,res)=>{
        try {
            data=await Fundraiser.find()
            console.log();
            
            res.status(200).json(data)
        } catch (e) {
            
        }
    }
    const Details = async (req,res)=>{
        try {
            const campaign = await Fundraiser.findById(req.params.id);
            if (campaign) {
              res.json(campaign);
            } else {
              res.status(404).json({ message: "Campaign not found" });
            }
          } catch (error) {
            res.status(500).json({ message: "Error fetching campaign details", error });
          }
    }


    const Query = async (req,res) =>{
        try {
            const data = await QuerySchema.create({...req.body});
            res.status(200).json({data})
        } catch (error) {
            console.log(error.message);
            
        }
    }

   

    const feedback = async (req, res) => {
        try {
            const data = await FeedbackSchema.create({
                feedback: req.body.feedback,
                Email: req.body.Email
            });
            res.status(200).json({ message: "Feedback submitted successfully", data });
        } catch (error) {
            console.error("Error saving feedback:", error.message);
            res.status(500).json({ message: "Failed to submit feedback" });
        }
    };
    
const FundraiserDetails = async(req,res)=>{
    const { userId } = req.query; 

    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }

    try {
       
        const fundraisers = await Fundraiser.find({ userId });
        
        res.json(fundraisers);
        console.log(fundraisers);
        
    } catch (error) {
        console.error("Error fetching fundraisers:", error);
        res.status(500).json({ error: "Failed to fetch fundraisers" });
    }
}


const Fundraisermaintain = async (req, res) => {
    const { _id } = req.params;

    if (!_id) {
        return res.status(400).json({ error: "Fundraiser ID is required" });
    }

    try {
        const fundraisers = await Fundraiser.findOne({ _id });
        if (!fundraisers) {
            return res.status(404).json({ error: "Fundraiser not found" });
        }
        
        const payments = await Payment.find({ Fundraiser_id: _id });

        let totalAmountRaised = 0;
        for (let i = 0; i < payments.length; i++) {
            totalAmountRaised += payments[i].amount;
        }
        console.log("Total Amount Raised:", totalAmountRaised);

        let progess =  totalAmountRaised/fundraisers.totalAmount*100
        console.log(progess);
        

        res.json({ fundraisers, totalAmountRaised,progess});
        
    } catch (error) {
        console.error("Error fetching fundraiser details:", error);
        res.status(500).json({ error: "Failed to fetch fundraiser details" });
    }
};

const fund = async(req,res)=>{
    try {
        const {_id} =  req.params
    const data = await Fundraiser.findOne({_id})
    console.log(data);

    res.status(200).json(data);
    } catch (error) {
        console.log(error.message);
        
    }
    
    
}

const Payments = async(req,res)=>{
    
    try {
        const Amount = await Payment.find();
    const DonationAmount = await Donation.find()

    const data = {Amount,DonationAmount};
    console.log(data);
    

    res.status(200).json(data)
    } catch (error) {
        console.log(error.message);
        
    }
    
}

    

module.exports = {createFundraiser,fetchCard,Details,Query,feedback,FundraiserDetails,Fundraisermaintain,PendingCard,Approve,Reject,fund,Payments};
