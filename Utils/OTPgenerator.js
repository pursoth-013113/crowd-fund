let OTPgenerator = (length)=>{
    Numbers = "1234567890"
    OTP="";
    
    
    for(let i=0;i<length;i++)
    {
        OTP += Numbers.charAt(Math.floor(Math.random()*Numbers.length))

        if(OTP == "000000"){
            OTPgenerator(6)
        }  
    }
    return OTP
}

module.exports = OTPgenerator;