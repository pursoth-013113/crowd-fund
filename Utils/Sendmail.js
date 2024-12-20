let nodemailer = require('nodemailer')

const Sendmail = (Email,Name,OTP)=>{
    try {
        let transport = nodemailer.createTransport({
            service:"gmail",
            auth:{
                user:"ashwinsiva992@gmail.com",
                pass:"koxm ktsp uvsq wnaz"
            }
        })
        let Mail = {
            from:"ashwinsiva992@gmail.com",
            to:Email,
            subject:"Your OTP",
            text:`Hi ${Name}, This is your ${OTP} OTP for Reset Password`
        }
        transport.sendMail(Mail)

        console.log(Mail);
        

    } catch (e) {
        console.log(e.message);
        
    }
}

module.exports = Sendmail