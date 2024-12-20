const Amount =require("../Models/Accountverify")

const AmountController = async (req, res) => {
   try {
       let data = await Amount.create({...req.body});
       res.status(200).json({ message: "Account created successfully", data });
   } catch (error) {
       console.error( error.message);
   }
};
module.exports = AmountController