const nodemailer = require('nodemailer'); 
const jwt = require('jsonwebtoken'); 
  
const transporter = nodemailer.createTransport({ 
    service: 'gmail', 
    auth: { 
        // burner email
        user: 'kuzmobeatz',
        pass: 'sfpv kgfn uqld tdga'
    } 
}); 
  
const token = jwt.sign({ 
        data: 'Token Data'
    }, 'secret', { expiresIn: '10m' }   
);     
  

  
// transporter.sendMail(mailConfigurations, function(error, info){ 
//     if (error) throw Error(error); 
//     console.log('Email Sent Successfully'); 
//     console.log(info); 
// }); 

module.exports = transporter;