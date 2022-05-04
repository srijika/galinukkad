const db = require('../_helper/db'); 
const Category = db.Category; 
const Contact = db.Contact; 
const Product = db.Product; 
const UserLogins = db.UserLogins; 
const Profile = db.Profile; 
const Bussiness = db.Bussiness; 
const Contect = db.Contact; 
const Newsletter = db.NewsLetter; 
const otp = db.otp; 
const Review = db.Review; 
const accessTokenSecret = require('../config.json').jwd_secret; 
var ROLES = require('../config.json').ROLES; 
var basepath = require('../config.json').basepath; 
const jwt = require('jsonwebtoken'); 
let mongoose = require('mongoose') 
const { Address } = require('../_helper/db'); 
var request = require('request'); 
const { log } = require('console'); 
var path = require('path') 
var sendmail = require('sendmail')(); 
var xlsx = require('node-xlsx'); 
const { send } = require('process'); 
var nodemailer = require('nodemailer'); 
let bcrypt = require('bcrypt'); 
var transporter = nodemailer.createTransport({ 
   service: 'gmail', 
   auth: { 
       user: 'mail786tester@gmail.com', 
       pass: 'oaelwbhhckizzoce' 
   } 
}); 
const axios = require('axios'); 
let adminEmail = "admin@galinukkad.com"; 
const Helper = require('../core/helper'); 
const sharp = require('sharp'); 
var path = require('path'); 
var fs = require('fs'); 
var request = require('request'); 

// let adminEmail = "chitesh444@gmail.com" 
let saltRounds = 10; 
notEmpty = (obj) => { 
   let t = Object.keys(obj).filter(i => (obj[i] == undefined || obj[i].toString().length == 0)); 
   console.log("t", t) 
   if (t.length > 0) { 
       return false; 
   } else { 
       return true; 
   } 
}; 
let api_key = "3bc27ef827668484358972ef4d81183c28b5867e64b29cdf"; 
let api_token = "51c9d0e8d625d2181e37f6de5a263020d17a4561829dfe81" 
let s_id = "galinukkad1"; 
let subdomain = "@api.exotel.com"; 


function sendSms(mobile_number, msg_body) { 
   return new Promise(async (resolve, reject) => { 
       try { 
           const apiData = `From=08047187076&To=${mobile_number}&Body=${msg_body}`; 
           const url = `https://${api_key}:${api_token}${subdomain}/v1/Accounts/${s_id}/Sms/send`; 

           request({ 
               url: url, 
               method: 'POST', 
               headers: { 
                   'Content-Type': 'application/x-www-form-urlencoded' 
               }, 
               body: apiData 
           }, (err, response) => { 
               console.log('EEEEEEEE', err, response.statusCode, response.body) 
               if (!err && response.statusCode == 200) { 
                   return resolve(true); 
               } else { 
                   return resolve(false); 
               } 
           }); 
       } catch (error) { 
           return resolve(false); 
       } 
   }); 
} 

module.exports = { 

   sendsms: async (req, res, next) => { 
       const f = await sendSms(req.body.phone, generateOTP() + ' is your OTP for Login Transaction on Galinukkad and valid till 10 minutes. Do not share this OTP to anyone for security reasons.'); 
       res.send({ status: f, message: f ? 'SMS sent successfully' : 'Something went wrong, when sent SMS' }); 
   }, 

   // login:(req,res,next)=>{ 

   //     const { username, password } = req.body; 
   //     if(!username || !password   ) { 
   //         res.send({status:false,message:"please provide username password"}); 
   //     }else{ 
   //         UserLogins.findOne({$or:[{ email: username},{ username: username}]}).then((data)=> { 

   //             let user={username:data.email,_id:data._id,time:new Date().getTime(),role:data.roles} 
   //             const accessToken = jwt.sign(user, accessTokenSecret); 
   //             if(data && data._id ){ 
   //                 let compare=bcrypt.compareSync(password,data.password) 
   //                 if(!compare){ 
   //                     if(data.password===password){ 
   //                         res.json({ 
   //                             status:true, 
   //                             accessToken, 
   //                             user 
   //                         }); 
   //                         return; 
   //                     } 
   //                     res.send({status:false,message:"Invalid password!"}); 
   //                 }else{ 


   //                     res.json({ 
   //                         status:true, 
   //                         accessToken, 
   //                         user 
   //                     }); 

   //                 } 


   //             }else{ 
   //                 res.send({status:false,message:" username and email not found"}); 
   //             } 
   //         }) 
   //     } 

   // }, 
   login: async (req, res, next) => { 
       // var request = require('request'); 
       // var dataString = `From=1005160449925462365&To=9803148768&Body=Hello World!!`; 

       // var options = { 
       //     url: `https://${api_key}:${api_token}${subdomain}/v1/Accounts/${s_id}/Sms/send`, 
       //     method: 'POST', 
       //     body: dataString 
       // }; 

       // function callback(error, response, body) { 

       //     console.log(response.statusCode,body) 
       //     if (!error && response.statusCode == 200) { 
       //         console.log(body); 
       //     } 
       // } 


       // await request(options, callback); 
       const { isOtp, username, password, mobile_number } = req.body; 
       console.log(req.body.isOtp) 
       if (!isOtp) { 
           res.send({ status: false, message: "please provide isOtp" }); 
       } else { 
           if (isOtp == 0) {    // if is otp is false 
               console.log('otp is false') 
               UserLogins.findOne({ $or: [{ email: username }, { username: username }] }).then((data) => { 

                   if (data && data._id) { 

                       if (!data.isEmailVerified && data.roles !== ROLES[2]) { 
                           return res.send({ status: false, message: "Your account is not verified" }); 
                       } 

                       let user = { username: data.email, _id: data._id, time: new Date().getTime(), role: data.roles }; 
                       const accessToken = jwt.sign(user, accessTokenSecret); 

                       let compare = bcrypt.compareSync(password, data.password); 
                       if (!compare) { 
                           if (data.password === password) { 
                               UserLogins.updateOne({ _id: data._id }, { $set: { last_login_time: new Date() } }).then({}); 
                               res.json({ 
                                   status: true, 
                                   accessToken, 
                                   user 
                               }); 
                               return; 
                           } 
                           res.send({ status: false, message: "Invalid password!" }); 
                       } else { 
                           UserLogins.updateOne({ _id: data._id }, { $set: { last_login_time: new Date() } }).then({}) 
                           return res.json({ 
                               status: true, 
                               accessToken, 
                               user 
                           }); 
                       } 

                   } else { 
                       res.send({ status: false, message: " username and email not found" }); 
                   } 
               }) 
           } else if (isOtp == 1) { // if login by otp is true 
               // let otp = Math.floor(1000 + Math.random() * 9000); 
               console.log('otp is not false') 
               let otp = generateOTP(); 

               if (username) { 
                   UserLogins.findOne({ $or: [{ email: username }] }).then((data) => { 
                       UserLogins.updateOne({ email: username }, { $set: { otp: otp } }).then(user => { 
                           var mailOptions = { 
                               from: 'no-reply@gmail.com', 
                               to: username, 
                               subject: 'New Signup', 
                               text: `Your one time otp is ${otp}` 
                           }; 
                           transporter.sendMail(mailOptions, function (error, info) { 
                               if (error) { 
                                   console.log(error); 
                               } else { 
                                   console.log('Email sent: ' + info.response); 
                               } 
                           }); 
                           res.send({ status: true, message: "Otp sent!" }) 
                           return; 
                       }).catch(err => { 
                           res.send({ status: false, err: "An Error Occured" }) 
                           return; 
                       }) 
                   }).catch(err => { 
                       res.send({ status: false, err: "An Error Occured" }) 
                       return; 
                   }); 

               } else if (mobile_number) { 
                   UserLogins.findOne({ $or: [{ mobile_number: mobile_number }] }).then((data) => { 
                       UserLogins.updateOne({ mobile_number: mobile_number }, { $set: { otp: otp } }).then(async user => { 
                           await sendSms(mobile_number, generateOTP() + ' is your OTP for Login Transaction on Galinukkad and valid till 10 minutes. Do not share this OTP to anyone for security reasons.'); 

                           // const formUrlEncoded = x => Object.keys(x).reduce((p, c) => p + `&${c}=${encodeURIComponent(x[c])}`, '') 
                           // axios.post(`https://${api_key}:${api_token}${subdomain}/v1/Accounts/${s_id}/Sms/send`, 
                           //     formUrlEncoded({ 
                           //         "From": "EXOSMS", 
                           //         "To": mobile_number, 
                           //         "Body": `This is a test message being sent using Exotel with a (Test123) and (123). If this is being abused, report to 08088919888` 
                           //     }), 
                           //     { 
                           //         withCredentials: true, 
                           //         headers: { 
                           //             "Accept": "application/x-www-form-urlencoded", 
                           //             "Content-Type": "application/x-www-form-urlencoded" 
                           //         } 
                           //     }, 

                           // ).then(function (response) { 
                           //     console.log(response.data); 
                           // }) 
                           //     .catch(function (error) { 
                           //         console.log(error); 
                           //     }); 
                           res.send({ status: true, message: "Otp sent!" }) 
                           return; 
                       }).catch(err => { 
                           res.send({ status: false, err: "An Error Occured" }) 
                           return; 
                       }) 
                   }).catch(err => { 
                       res.send({ status: false, err: "An Error Occured" }) 
                       return; 
                   }); 
               } 
           } 
       } 
   }, 

   loginNew: async (req, res, next) => { 
       try { 
           const reqBody = req.body; 
           // const Email = reqBody.email; 
           const Username = reqBody.username; 
           // const MobNo = reqBody.mobile_number; 
           const Password = reqBody.password; 
           const firebaseToken = reqBody.firbaseToken; 
           console.log(firebaseToken); 

           if (!Username) { 
               return res.send({ status: false, message: "Email or Mobile No. is required" }); 
           } 

           let isUser = await UserLogins.findOne({ $or: [{ email: Username }, { mobile_number: Username }] }) 
               // .select('_id email username mobile_number roles password') 
               .lean().exec(); 

           const isEmail = Username.includes('.com') ? 'Email' : 'Mobile No'; 

           if (!isUser) { 
               return res.send({ status: false, message: `User not registered for this ${isEmail}` }); 
           } 

           if (isUser.roles !== ROLES[3]) { 
               if (!Password) { 
                   return res.send({ status: false, message: "Password is required" }); 
               } 
           } else { 
               const otpCheck = generateOTP(); 
               let msg_body = `Hi, ${isUser.username} <br />`;  
               msg_body += 'Your One Time Password is ' + otpCheck; 
               msg_body += '<br />Thanks,<br />Gali Nukkad Team'; 
               Helper.sendEmail(isUser.email, "OTP Verification", msg_body); 
                
               await sendSms(isUser.mobile_number, `${otpCheck} is your OTP for Login Transaction on Galinukkad and valid till 10 minutes. Do not share this OTP to anyone for security reasons.`); 

               await UserLogins.findByIdAndUpdate(isUser._id, { otp: otpCheck, mobile_otp: otpCheck }).lean().exec(); 

               return res.send({ status: true, message: "OTP sent to your mobile number and email" }); 
           } 

           const comparePass = bcrypt.compareSync(Password, isUser.password); 

           const accessToken = jwt.sign(isUser, accessTokenSecret); 

           if (comparePass || (!comparePass && isUser.password === Password)) { 

               if (isUser.roles !== ROLES[2]) { 
                   if (!isUser.isMobileVerified && !isUser.isEmailVerified) { 

                       const emailOtp = generateOTP(); 
                       let msg_body = `Hi, ${isUser.username} <br />`; 
                       msg_body += 'Your One Time Password is ' + emailOtp; 
                       msg_body += '<br />Thanks,<br />Gali Nukkad Team'; 

                       const mobileOtp = generateOTP(); 
                       await sendSms(isUser.mobile_number, `${mobileOtp} is your OTP for Login Transaction on Galinukkad and valid till 10 minutes. Do not share this OTP to anyone for security reasons.`); 

                       await UserLogins.findByIdAndUpdate(isUser._id, { otp: emailOtp, mobile_otp: mobileOtp }).lean().exec(); 
                       Helper.sendEmail(isUser.email, "OTP Verification", msg_body); 

                       return res.send({ status: false, message: "Your account is not verified" }); 
                   } 
               } 

               let userData = { username: isUser.username, email: isUser.email, mobile: isUser.mobile_number, isMobileVerified: isUser.isMobileVerified, isEmailVerified: isUser.isEmailVerified, _id: isUser._id, time: new Date().getTime(), role: isUser.roles }; 
               console.log(firebaseToken); 
               await UserLogins.findByIdAndUpdate(isUser._id, { $inc: { no_of_loggedin: 1 }, last_login_time: new Date(), firebase_token: firebaseToken }); 

               return res.send({ status: true, user: userData, accessToken: accessToken }); 
           } else { 
               return res.send({ status: false, message: `Invalid password!` }); 
           } 

       } catch (error) { 
           console.log(error) 
           return res.send({ status: false, message: error.message }); 
       } 
   }, 

   socialLogin: async (req, res, next) => { 
       try { 
           const { type, socialid, email, username, profile_link, ip_address } = req.body; 
           let user = await UserLogins.findOne({ $or: [{ email: email }, { username: username }] }); 
           console.log(user) 
           if (!user) { // if user is not available 
               let role_type = "CUSTOMER"; 
               let password = generateOTP(); 
               const hash = bcrypt.hashSync(password, saltRounds); 
               let createData = { username: username, email: username, password: hash, roles: role_type, socialid: socialid, type_login: type, ip_address: ip_address }; 
               UserLogins.create(createData).then((data) => { 

                   Profile.create({ email: email, name: username, phone: '', gender: '', dob: new Date(), photo: profile_link, loginid: data._id }).then((profile) => { 
                       let user = { username: data.username, email: data.email, _id: data._id, time: new Date().getTime(), role: role_type } 
                       const accessToken = jwt.sign(user, accessTokenSecret); 
                       res.send({ 
                           status: true, 
                           accessToken, 
                           user 
                       }); 
                   }) 
               }); 
           } else { // if user is available 
               let token = { username: user.email, _id: user._id, time: new Date().getTime(), role: user.roles } 
               const accessToken = jwt.sign(token, accessTokenSecret); 
               res.send({ 
                   status: true, 
                   accessToken, 
                   user 
               }); 
           } 
       } catch (e) { 
           console.log(e) 
           res.send({ status: false, err: e.message }); 
           return; 
       } 
   }, 

   sendOtpToUser: async (req, res, next) => { 
       try { 
           const reqBody = req.body; 
           const Email = reqBody.email; 
           const Username = reqBody.username; 
           const mobileNumber = reqBody.mobile_number; 

           if (!Email && !Username && !mobileNumber) { 
               return res.send({ status: false, message: "Required parameter missing, Please provide email username or mobile number" }); 
           } 

           const userOtp = generateOTP(); 

           if (Email || Username) { 
               const isUser = await UserLogins.findOne({ $or: [{ email: Email }, { username: Username }] }); 
               if (!isUser) { 
                   return res.send({ status: false, message: "User not found" }); 
               } 

               let msg_body = `Hi, ${isUser.username} <br />`; 
               msg_body += 'Your One Time Password is ' + userOtp; 
               msg_body += '<br />Thanks,<br />Gali Nukkad Team'; 

               await UserLogins.findByIdAndUpdate(isUser._id, { otp: userOtp }).lean().exec(); 
               Helper.sendEmail(isUser.email, "OTP Verification", msg_body); 

               return res.send({ status: true, message: "OTP send to your email" }); 
           } else if (mobileNumber) { 
               const isUser = await UserLogins.findOne({ mobile_number: mobileNumber }); 

               if (!isUser) { 
                   return res.send({ status: false, message: "User not found" }); 
               } 

               await sendSms(mobileNumber, `${userOtp} is your OTP for Login Transaction on Galinukkad and valid till 10 minutes. Do not share this OTP to anyone for security reasons.`); 

               await UserLogins.findByIdAndUpdate(isUser._id, { mobile_otp: userOtp }).lean().exec(); 
               return res.send({ status: true, message: "OTP send to your Phone No." }); 
           } else { 
               return res.send({ status: false, message: "Something went wrong" }); 
           } 

       } catch (error) { 
           return res.send({ status: false, err: e.message }); 
       } 
   }, 

   verifyOtp: async (req, res, next) => { 
       try { 
           const { mobile_number, userName, email, otp } = req.body; 

           if (!email && !userName && !mobile_number) { 
               return res.send({ status: false, message: "Required parameter missing, Please provide email username or mobile number" }); 
           } 

           if (!otp) { 
               return res.send({ status: false, message: "OTP is required" }); 
           } 

           if (email || userName) { 
               const isUser = await UserLogins.findOne({ $or: [{ email: email }, { username: userName }] }).lean().exec(); 
               if (!isUser) { 
                   return res.send({ status: false, message: "User not found" }); 
               } 

               if (isUser.otp == otp) { 
                   await UserLogins.findByIdAndUpdate(isUser._id, { isEmailVerified: true }); 

                   if (isUser.roles !== ROLES[3]) { 
                       return res.send({ status: true, message: "OTP Verified" }); 
                   } else { 
                       const userData = { username: isUser.email, _id: isUser._id, time: new Date().getTime(), role: isUser.roles }; 
                       const accessToken = jwt.sign(isUser, accessTokenSecret); 

                       await UserLogins.findByIdAndUpdate(isUser._id, { $inc: { no_of_loggedin: 1 }, last_login_time: new Date() }); 
                       return res.send({ status: true, user: userData, accessToken: accessToken }); 
                   } 

                   // return res.send({ status: true, message: "OTP Verified" }); 
               } else { 
                   return res.send({ status: false, message: "OTP Not Verified" }); 
               } 

           } else if (mobile_number) { 
               const isUser = await UserLogins.findOne({ mobile_number: mobile_number }).lean().exec(); 

               if (!isUser) { 
                   return res.send({ status: false, message: "User not found" }); 
               } 

               if (isUser.mobile_otp == otp) { 
                   await UserLogins.findByIdAndUpdate(isUser._id, { isMobileVerified: true }); 

                   if (isUser.roles !== ROLES[3]) { 
                       return res.send({ status: true, message: "OTP Verified" }); 
                   } else { 
                       const userData = { username: isUser.email, _id: isUser._id, time: new Date().getTime(), role: isUser.roles }; 
                       const accessToken = jwt.sign(isUser, accessTokenSecret); 

                       await UserLogins.findByIdAndUpdate(isUser._id, { $inc: { no_of_loggedin: 1 }, last_login_time: new Date() }); 
                       return res.send({ status: true, user: userData, accessToken: accessToken }); 
                   } 

               } else { 
                   return res.send({ status: false, message: "OTP Not Verified" }); 
               } 
           } else { 
               return res.send({ status: false, message: "Something went wrong" }); 
           } 

           // if (!otp) { 
           //     res.send({ status: false, message: "please provide isOtp" }); 
           // } else { 
           //     if (req.body.mobile_number) { 
           //         UserLogins.findOne({ mobile_number: mobile_number }).then((data) => { 
           //             if (data && data._id && data.otp === otp) { 
           //                 let user = { username: data.email, _id: data._id, time: new Date().getTime(), role: data.roles } 
           //                 const accessToken = jwt.sign(user, accessTokenSecret); 
           //                 res.json({ 
           //                     status: true, 
           //                     accessToken, 
           //                     user 
           //                 }); 
           //             } else { 
           //                 res.send({ status: false, err: "Otp is not verified!" }) 
           //                 return; 
           //             } 
           //         }).catch(err => { 
           //             console.log(err) 
           //             res.send({ status: false, err: "An Error Occured" }) 
           //             return; 
           //         }) 
           //     } else if (req.body.userName) { 
           //         UserLogins.findOne({ $or: [{ email: userName }, { username: userName }] }).then((data) => { 
           //             if (data && data._id && data.otp === otp) { 
           //                 let user = { username: data.email, _id: data._id, time: new Date().getTime(), role: data.roles } 
           //                 const accessToken = jwt.sign(user, accessTokenSecret); 
           //                 res.json({ 
           //                     status: true, 
           //                     accessToken, 
           //                     user 
           //                 }); 
           //             } else { 
           //                 res.send({ status: false, err: "Otp is not verified!" }) 
           //                 return; 
           //             } 
           //         }).catch(err => { 
           //             console.log(err) 
           //             res.send({ status: false, err: "An Error Occured" }) 
           //             return; 
           //         }) 
           //     } else { 
           //         res.send({ status: false, err: "Please send param userName or mobile_number" }) 
           //         return; 
           //     } 
           // } 
       } catch (e) { 
           console.log(e) 
           return res.send({ status: false, err: e.message }) 
       } 
   }, 

   signup: async (req, res, next) => { 

       try { 
           const { 
               username, 
               email, 
               password, 
               roleType, 
               mobile_number, 
               gstin, 
               fssai, 
               ip_address, 
               name, 
               gender, 
               dob, 
               photo 
           } = req.body; 

           if (!username) 
               return res.send({ status: false, message: "Username is required" }); 

           if (!email) 
               return res.send({ status: false, message: "Email is required" }); 

           if (!password) 
               return res.send({ status: false, message: "Password is required" }); 

           if (!mobile_number) 
               return res.send({ status: false, message: "Mobile No. is required" }); 

           if (!roleType || ROLES.indexOf(roleType) == -1) 
               return res.send({ status: false, message: "Role is not valid" }); 


           const hash = bcrypt.hashSync(password, saltRounds); 

           const userOtp = generateOTP(); 
           const mobileOtp = generateOTP(); 

           const data = { 
               email: email, 
               username: username, 
               password: hash, 
               roles: roleType, 
               mobile_number: mobile_number, 
               gstin: (gstin || false), 
               fssai: (fssai || false), 
               ip_address: (ip_address || null), 
               otp: userOtp, 
               mobile_otp: mobileOtp 
           }; 

           const isUser = await UserLogins 
               .findOne({ $or: [{ email: email }, { username: username }, { mobile_number: mobile_number }] }) 
               .lean().exec(); 

           if (isUser) { 
               let msg = 'This'; 
               if (isUser.email === email) { 
                   msg += ' Email'; 
               } else if (isUser.username === username) { 
                   msg += ' Username'; 
               } else if (isUser.mobile_number === mobile_number) { 
                   msg += ' Mobile No'; 
               } 
               msg += ' is already registered'; 

               return res.send({ status: false, message: msg }); 
           } 

           const userLoginCreate = await (new UserLogins(data)).save(); 

           let profileCreate = ''; 

           if (userLoginCreate && userLoginCreate._id) { 

               const profileData = { 
                   email: email, 
                   phone: mobile_number, 
                   loginid: userLoginCreate._id, 
                   name: name, 
                   gender: gender, 
                   dob: dob, 
                   photo: photo 
               }; 

               profileCreate = await (new Profile(profileData)).save(); 
           } else { 
               return res.send({ status: false, message: 'something went wrong when create user login' }); 
           } 

           if (!profileCreate) { 
               return res.send({ status: false, message: 'something went wrong when create profile' }); 
           } 

           let msg_body = 'Hi, <br />'; 
           msg_body += 'Your account has been added on Gali Nukkad Website <br />'; 
           msg_body += 'Please find below your login credentials:<br />'; 
           msg_body += 'Username: ' + username + '<br />'; 
           msg_body += 'Email: ' + email + '<br />'; 
           msg_body += 'Password: ' + password + '<br />'; 
           msg_body += 'And your OTP(One Time Password) is ' + userOtp; 
           msg_body += '<br />Thanks,<br />Gali Nukkad Team'; 

           // email sending 
           await Helper.sendEmail(email, 'New Signup', msg_body); 

           await sendSms(mobile_number, `${mobileOtp} is your OTP for Login Transaction on Galinukkad and valid till 10 minutes. Do not share this OTP to anyone for security reasons.`); 

           return res.send({ status: true, data: userLoginCreate, profile: profileCreate }); 

       } catch (error) { 
           console.log(error) 

           if (error.errmsg && error.errmsg.indexOf('E11000') > -1) { 
               return res.send({ status: false, message: "User Already Exist, Please try with other username or email" }) 
           } 

           return res.send({ status: false, message: error.message }) 
       } 
   }, 

   getalluser: async (req, res, next) => { 
       // var { limit, page, sort } = req.body; 
       // var l = limit || 10, p = page || 0, s = (sort == 'asc') ? 1 : -1; 
       // const { role } = req.body; 
       // if (!role) { 
       //     res.send({ status: false, message: "Not valid role" }); 
       //     return; 
       // } 
       // UserLogins.find({ roles: role }, 
       //     { roles: 1, id: 1, email: 1, gstin: 1, fssai: 1, mobile_number: 1, isEmailVerified: 1, isBussinessVerified: 1, username: 1 }).limit(l).skip(l * p).sort({ _id: -1 }).then(userlist => { 
       //         res.send({ status: true, data: userlist, total: userlist.length }) 
       //     }).catch(e => { 
       //         res.send({ status: false, err: 'Something went wrong' }) 
       //     }) 

       // email: "demo1234@gmail.com" 
       // fssai: false 
       // gstin: false 
       // id: "5fec294307534b248b7d9112" 
       // isBussinessVerified: false 
       // isEmailVerified: false 
       // roles: "CUSTOMER" 
       // username: "demo1234" 

       try { 
           const reqBody = req.body; 
           const Limit = reqBody.limit ? parseInt(reqBody.limit) : 10; 
           const PageNo = reqBody.page ? parseInt(reqBody.page) : 0; 
           const sortColumn = reqBody.sortColumn ? reqBody.sortColumn : 'updated'; 
           const sortType = reqBody.sortType ? (reqBody.sortType == 'asc' ? 1 : -1) : -1; 
           let role = reqBody.role; 

           if (role && !ROLES.includes(role)) { 
               return res.send({ status: false, message: "Not valid role" }); 
           } 

           const MATCH = {}; 
           MATCH.$or = []; 
           MATCH.$and = []; 

           if (role) { 
               MATCH.$and.push({ roles: role }); 
           } 

           if (!MATCH.$or.length) { delete MATCH.$or; } 
           if (!MATCH.$and.length) { delete MATCH.$and; } 

           const data = await UserLogins.aggregate([ 
               { $lookup: { from: 'profiles', localField: '_id', foreignField: "loginid", as: "profileInfo" } }, 
               { $unwind: { path: '$profileInfo', preserveNullAndEmptyArrays: true } }, 
               { 
                   $project: { 
                       roles: 1, 
                       id: 1, 
                       email: 1, 
                       gstin: 1, 
                       fssai: 1, 
                       mobile_number: 1, 
                       isEmailVerified: 1, 
                       isBussinessVerified: 1, 
                       username: 1, 
                       'name': "$profileInfo.name", 
                       'photo': "$profileInfo.photo", 
                       'create': "$profileInfo.create", 
                       'updated': "$profileInfo.updated", 
                       'user_status': { 
                           $cond: { 
                               if: { $eq: ["$user_status", "deactive"] }, 
                               then: "deactive", 
                               else: "active" 
                           } 
                       }, 
                   } 
               }, 
               { $match: MATCH }, 
               { $sort: { [sortColumn]: sortType } }, 
               { $skip: (Limit * PageNo) }, 
               { $limit: Limit } 
           ]); 

           const countUser = await UserLogins.aggregate([ 
               { $lookup: { from: 'profiles', localField: '_id', foreignField: "loginid", as: "profileInfo" } }, 
               { $unwind: { path: '$profileInfo', preserveNullAndEmptyArrays: true } }, 
               { 
                   $project: { 
                       roles: 1, 
                       id: 1, 
                       email: 1, 
                       gstin: 1, 
                       fssai: 1, 
                       mobile_number: 1, 
                       isEmailVerified: 1, 
                       isBussinessVerified: 1, 
                       username: 1, 
                       'name': "$profileInfo.name", 
                       'photo': "$profileInfo.photo", 
                       'create': "$profileInfo.create", 
                       'user_status': { 
                           $cond: { 
                               if: { $eq: ["$user_status", "deactive"] }, 
                               then: "deactive", 
                               else: "active" 
                           } 
                       }, 
                   } 
               }, 
               { $match: MATCH }, 
           ]); 


           return res.send({ status: true, data: data, total: countUser.length, message: 'Users get successfully' }); 
       } catch (error) { 
           return res.send({ status: false, message: error.message }); 
       } 
   }, 

   deleteuser: async (req, res, next) => { 
       try { 
           const { _id } = req.body; 
           if (!_id) { 
               res.send({ status: false, message: "Not valid id" }); 
               return; 
           } 

           const deleteUser = await UserLogins.findByIdAndDelete(_id); 
           if (!deleteUser) { 
               return res.send({ status: false, message: 'User not found' }) 
           } 
           const deleteProfile = await Profile.findOneAndDelete({ loginid: _id }); 
           return res.send({ status: true, message: 'User deleted successfully' }); 

       } catch (error) { 
           return res.send({ status: false, message: error.message }) 
       } 
   }, 

   forgotpassword: async (req, res, next) => { 
       try { 
           const { username } = req.body; 
           const newOtp = generateOTP(); 

           if (!username) { 
               return res.send({ status: false, message: "please provide username or email" }); 
           } 

           const isUser = await UserLogins.findOne({ $or: [{ email: username }, { username: username }] }); 

           if (!isUser) { 
               return res.send({ status: false, message: "User not found" }); 
           } 

           const isOtp = await otp.findOneAndUpdate({ loginid: isUser._id }, { $inc: { attempt: 1 }, otp: newOtp }); 

           if (!isOtp) { 
               const json = { loginid: isUser._id, otp: newOtp }; 
               await (new otp(json)).save(); 
           } 

           Helper.sendEmail(isUser.email, `Your Verification code`, `Your verification code to reset your passwod is ${newOtp}`); 
           return res.send({ status: true, message: "Otp sent to your email address" }); 

       } catch (error) { 
           return res.send({ status: false, message: error.message }); 
       } 

       // UserLogins.findOne({ $or: [{ email: username }, { username: username }] }).then(data => { 

       //     if (data && data._id) { 
       //         let newotp = generateOTP() 
       //         console.log(data) 
       //         otp.find({ loginid: data._id }).then(otpdata => { 

       //             if (otpdata.length > 0) { 
       //                 otp.update({ loginid: data._id }, { attempt: otpdata[0].attempt + 1, otp: newotp }).then(d => { 
       //                     sendmail({ 
       //                         from: 'no-reply@apnika.com', 
       //                         to: 'ravpartap@gmail.com', 
       //                         subject: 'Your Verification code', 
       //                         host: "localhost", 
       //                         html: 'Your verification code to reset your passwod is ' + newotp, 
       //                     }, function (err, reply) { 
       //                         console.log(err, reply) 
       //                     }); 
       //                     res.send({ status: true, message: "Otp sent to your email address" }) 
       //                 }) 
       //             } else { 
       //                 otp.create({ loginid: data._id, otp: newotp }).then(d => { 
       //                     sendmail({ 
       //                         from: 'no-reply@apnika.com', 
       //                         to: data.email, 
       //                         subject: 'Your Verification code', 
       //                         html: 'Your verification code to reset your passwod is ' + newotp, 
       //                     }, function (err, reply) { 
       //                         console.log(err, reply) 
       //                     }); 
       //                     res.send({ status: true, message: "Otp sent to your email address", }) 
       //                 }) 
       //             } 
       //         }) 

       //     } 

       // }) 

   }, 

   recoverpassword: async (req, res, next) => { 
       try { 
           const { username, password, otpchk } = req.body; 
           if (!username || !password || !otpchk) { 
               return res.send({ status: false, message: "please provide required params" }) 
           } 

           const hashPassword = bcrypt.hashSync(password, saltRounds); 

           const isUser = await UserLogins.findOne({ $or: [{ email: username }, { username: username }] }); 

           if (!isUser) { 
               return res.send({ status: false, message: "User not found" }); 
           } 

           const checkOtp = await otp.findOne({ loginid: isUser._id, otp: otpchk }); 

           if (!checkOtp) { 
               return res.send({ status: false, message: 'OTP not match, try again' }); 
           } 

           await UserLogins.findByIdAndUpdate(isUser._id, { password: hashPassword }); 
           await otp.findByIdAndDelete(checkOtp._id); 

           return res.send({ status: true, message: 'Password updated successfully' }); 
       } catch (error) { 
           return res.send({ status: false, message: error.message }); 
       } 

       // UserLogins.findOne({ $or: [{ email: username }, { username: username }] }).then(data => { 

       //     if (data && data._id) { 
       //         let newotp = generateOTP() 

       //         otp.find({ loginid: data._id, otp: otpchk }).then(otpdata => { 
       //             if (otpdata.length > 0) { 
       //                 UserLogins.update({ $or: [{ email: username }, { username: username }] }, { password: password }).then(d => { 

       //                     res.send({ status: true, message: "Updated" }) 
       //                 }) 
       //             } else { 
       //                 res.send({ status: false }) 
       //             } 
       //         }) 

       //     } 

       // }) 
   }, 

   changepassword: (req, res, next) => { 
       if (!password || !confirmpassword || !oldpassword) { 
           res.send({ status: false, message: "please provide required params" }) 
           return; 
       } 
       let username = req.user.username; 
       UserLogins.findOne({ $or: [{ email: username, password: oldpassword }, { username: username, password: oldpassword }] }).then(data => { 
           if (data && data._id) { 
               UserLogins.update({ $or: [{ email: username }, { username: username }] }, { password: password }).then(d => { 

                   res.send({ status: true, message: "Updated" }) 
               }) 

           } 

       }) 
   }, 


   uploadimg: (req, res, next) => { 
       try { 
           console.log('api hit!!') 
           console.log(req.files); 
           res.send({ files: req.files.map(i => i.filename) }) 
       } catch (e) { 
           console.log(e) 
       } 

   }, 

   crateprofile: (req, res, next) => { 

       const { email, phone, name, gender, dob, photo } = req.body; 
       if (!email || !phone || !name || !gender || !dob || !photo) { 
           res.send({ status: false, message: "Required Parameter is missing" }); 
           return; 
       } 

       Profile.create({ email, phone, name, gender, dob, photo, loginid: req.user._id }).then((data) => { 
           res.send({ status: true, data }) 
           return; 
       }).catch((err) => { 
           res.send({ status: false, message: "error Occured While create profile" }) 
           return; 
       }); 

   }, 

   createbussiness: async (req, res, next) => { 
       try { 
           const reqBody = req.body; 
           const { storeName, bemail, address, phone } = req.body; 

           if (!bemail || !phone || !storeName || !address) { 
               return res.send({ status: false, message: "Required Parameter is missing" }); 
           } 

           const reqFiles = req.files; 
           const imageFiles = []; 
           const imageFilesThumbnail = []; 
           let FSI = null; 
           let FSIThumbnail = null; 

           const loginId = req.user._id; 

           // const isUser = await UserLogins.findById(loginId).lean().exec(); 

           // if (!isUser) { 
           //     return res.send({ status: false, message: "Seller not found" }); 
           // } 

           // console.log(isUser.email, bemail, isUser.mobile_number, phone); 

           // if (isUser.email !== bemail || isUser.mobile_number !== phone) { 
           //     return res.send({ status: false, message: "Email or Phone not match to your profile" }); 
           // } 


           if (reqFiles) { 
               reqFiles.forEach(E => { 


                   var filePath = path.join(__dirname, '../public/thumbnail/'); 

                   if (!fs.existsSync(filePath)) { 
                       fs.mkdirSync(filePath); 
                   } 

                   const fileUrl = filePath + E.filename; 

                   sharp(E.path).resize(300, 200).toFile(fileUrl, function (err) { 
                       if (err) { 
                           console.log(err); 
                       } 
                       console.log('FILEEEEEEEE', fileUrl); 
                   }); 


                   const str = E.originalname; 
                   const extension = str.substr(str.lastIndexOf(".") + 1); 
                   const fJson = { 
                       file: E.filename, 
                       title: E.originalname, 
                       file_type: extension, 
                       file_size: E.size 
                   } 

                   if (E.fieldname === 'images') { 
                       imageFiles.push(fJson); 
                       imageFilesThumbnail.push(`thumbnail/${E.filename}`); 
                   } 
                   if (E.fieldname === 'FSI') { 
                       FSI = fJson; 
                       FSIThumbnail = `thumbnail/${E.filename}`; 
                   } 
               }) 
           } 

           const jsonData = { 
               storeName: storeName, 
               bemail: bemail, 
               address: address, 
               phone: phone, 
               gstno: reqBody.gstno, 
               gstcert: reqBody.gstcert, 
               panNumber: reqBody.panNumber, 
               idno: reqBody.idno, 
               acNumber: reqBody.acNumber, 
               ifsc: reqBody.ifsc, 
               branch: reqBody.branch, 
               idproof: reqBody.idproof, 
               images: imageFiles, 
               other: reqBody.other, 
               typeSeller: reqBody.typeSeller, 
               loginid: loginId, 
               FSI: FSI, 
               fsaai_no: reqBody.fsaai_no, 
               thumbnailImages: imageFilesThumbnail, 
               FSI_thumbnail: FSIThumbnail, 
           }; 

           const created = await (new Bussiness(jsonData)).save(); 

           return res.send({ status: true, data: created._id, message: 'Bussiness created successfully' }); 
       } catch (error) { 
           return res.send({ status: false, message: error.message }); 
       } 
   }, 

   updatebussiness: async (req, res, next) => { 
       try { 
           const reqBody = req.body; 
           const { bussiness_id, storeName, bemail, address, phone } = req.body; 

           if (!bussiness_id) { 
               return res.send({ status: false, message: "Bussiness Id is Required" }); 
           } 

           if (!bemail || !phone || !storeName || !address) { 
               return res.send({ status: false, message: "Required Parameter is missing" }); 
           } 

           const reqFiles = req.files; 
           const imageFiles = []; 
           const imageFilesThumbnail = []; 
           let FSI = null; 
           let FSIThumbnail = null; 

           if (reqFiles) { 
               reqFiles.forEach(E => { 

                   var filePath = path.join(__dirname, '../public/thumbnail/'); 

                   if (!fs.existsSync(filePath)) { 
                       fs.mkdirSync(filePath); 
                   } 

                   const fileUrl = filePath + E.filename; 

                   sharp(E.path).resize(300, 200).toFile(fileUrl, function (err) { 
                       if (err) { 
                           console.log(err); 
                       } 
                       console.log('FILEEEEEEEE', fileUrl); 
                   }); 

                   const str = E.originalname; 
                   const extension = str.substr(str.lastIndexOf(".") + 1); 
                   const fJson = { 
                       file: E.filename, 
                       title: E.originalname, 
                       file_type: extension, 
                       file_size: E.size 
                   } 
                   if (E.fieldname === 'images') { 
                       imageFiles.push(fJson); 
                       imageFilesThumbnail.push(`thumbnail/${E.filename}`); 
                   } 

                   if (E.fieldname === 'FSI') { 
                       FSI = fJson; 
                       FSIThumbnail = `thumbnail/${E.filename}`; 
                   } 
               }) 
           } 

           const jsonData = { 
               storeName: storeName, 
               // bemail: bemail, 
               address: address, 
               // phone: phone, 
               gstno: reqBody.gstno, 
               gstcert: reqBody.gstcert, 
               panNumber: reqBody.panNumber, 
               idno: reqBody.idno, 
               acNumber: reqBody.acNumber, 
               ifsc: reqBody.ifsc, 
               branch: reqBody.branch, 
               idproof: reqBody.idproof, 
               other: reqBody.other, 
               typeSeller: reqBody.typeSeller, 
               fsaai_no: reqBody.fsaai_no 
           }; 

           const isBussiness = await Bussiness.findById(bussiness_id); 

           if (!isBussiness) { 
               return res.send({ status: false, message: 'Bussiness data not found for this id' }); 
           } 

           const isUser = await UserLogins.findById(isBussiness.loginid); 

           if (!isUser) { 
               return res.send({ status: false, message: 'User not found' }); 
           } 

           if (imageFiles.length) { 
               if (isUser.isBussinessVerified) { 
                   jsonData.$push = { images: imageFiles, thumbnailImages: imageFilesThumbnail }; 
               } else { 
                   jsonData.images = imageFiles; 
                   jsonData.thumbnailImages = imageFilesThumbnail; 
               } 
           } 

           if (FSI) { 
               jsonData.FSI = FSI; 
               jsonData.FSI_thumbnail = FSIThumbnail; 
           } 

           await Bussiness.findByIdAndUpdate(bussiness_id, jsonData); 

           return res.send({ status: true, data: {}, message: 'Bussiness updated successfully' }); 
       } catch (error) { 
           return res.send({ status: false, message: error.message }); 
       } 
   }, 

   updateprofile: (req, res, next) => { 

       const { email, phone, name, gender, dob, photo } = req.body; 
       if (!email || !phone || !name || !gender || !dob || !photo) { 
           res.send({ status: false, message: "Required Parameter is missing" }); 
           return; 
       } 

       Profile.findOne({ loginid: req.user._id }).then((data) => { 

           if (data && data._id) { 
               Profile.update({ loginid: req.user._id }, { email, phone, name, gender, dob, photo, updated: new Date() }).then((data) => { 
                   res.send({ status: true, data }) 
                   return; 
               }).catch((err) => { 
                   res.send({ status: false, message: err.errmsg }) 
                   return; 
               }); 
           } else { 
               Profile.create({ email, phone, name, gender, dob, photo, loginid: req.user._id }).then((data) => { 
                   res.send({ status: true, data }) 
                   return; 
               }).catch((err) => { 
                   res.send({ status: false, message: err.errmsg }) 
                   return; 
               }); 
           } 
       }); 
   }, 

   getBussiness: (req, res, next) => { 
       var id = req.body._id 
       var _id = id || req.user._id 
       Bussiness.find({ loginid: _id }).populate('loginid', 'isBussinessVerified email username').then((data) => { 
           let isCreated = (data.length > 0) ? 1 : 0; 
           res.send({ status: true, data, isCreated }) 
           return; 
       }) 
   }, 

   getBussinessByBussnessId: async (req, res, next) => { 
       try { 
           const reqQuery = req.query; 
           const bussinessId = reqQuery.bussiness_id; 

           if (!bussinessId) { 
               return res.send({ status: false, message: 'Bussness Id is required' }); 
           } 

           const isBussness = await Bussiness.findById(bussinessId) 
               .populate('loginid', 'name email isBussinessVerified username roles') 
               .lean().exec(); 

           if (!isBussness) { 
               return res.send({ status: false, message: 'Bussness Info not found for this id' }); 
           } 
           return res.send({ status: true, data: isBussness, message: 'Bussiness profile get successfully' }); 

       } catch (error) { 
           return res.send({ status: false, message: error.message }); 
       } 
   }, 

   getBussinessByUserId: async (req, res, next) => { 
       try { 
           const reqQuery = req.query; 
           const userId = reqQuery.user_id; 

           if (!userId) { 
               return res.send({ status: false, message: 'User Id is required' }); 
           } 

           const isUser = await UserLogins.findById(userId).select('-password').lean().exec(); 

           if (!isUser) { 
               return res.send({ status: false, message: 'User not found for this id' }); 
           } 

           const isBussness = await Bussiness.find({ loginid: userId }).lean().exec(); 

           isUser.bussnessInfo = isBussness; 

           return res.send({ status: true, data: isUser, message: 'User with Bussiness info get successfully' }); 
       } catch (error) { 
           return res.send({ status: false, message: error.message }); 
       } 
   }, 

   getallbussines: async (req, res, next) => { 
       var { limit, page, isGstNo, filter, isBussinessVerified } = req.body; 
       var l = parseInt(limit) || 10, 
           p = parseInt(page) || 0; 

       filter = filter ? new RegExp(filter, 'i') : ''; 

       // console.log(req.body) 
       const MATCH = {}; 
       MATCH.$and = []; 
       MATCH.$or = []; 

       if (isGstNo === true) { 
           MATCH.$and.push({ gstno: { $nin: [null, ""] } }); 
       } else if (isGstNo === false) { 
           MATCH.$and.push({ gstno: { $in: [null, ""] } }); 
       } 

       if (isBussinessVerified === true) { 
           MATCH.$and.push({ 'user.isBussinessVerified': true }); 
       } else if (isBussinessVerified === false) { 
           MATCH.$and.push({ 'user.isBussinessVerified': false }); 
       } 


       if (filter) { 
           MATCH.$or.push({ storeName: filter }); 
           MATCH.$or.push({ bemail: filter }); 
           MATCH.$or.push({ address: filter }); 
           MATCH.$or.push({ phone: filter }); 
           MATCH.$or.push({ gstno: filter }); 
           MATCH.$or.push({ gstcert: filter }); 
           MATCH.$or.push({ panNumber: filter }); 
           MATCH.$or.push({ acNumber: filter }); 
           MATCH.$or.push({ ifsc: filter }); 
           MATCH.$or.push({ branch: filter }); 
           MATCH.$or.push({ typeSeller: filter }); 
           MATCH.$or.push({ 'user.username': filter }); 
           MATCH.$or.push({ 'user.email': filter }); 
       } 

       if (!MATCH.$and.length) delete MATCH.$and; 
       if (!MATCH.$or.length) delete MATCH.$or; 

       console.log(MATCH); 

       let data = await Bussiness.aggregate([ 
           { $lookup: { from: 'userlogins', localField: 'loginid', foreignField: "_id", as: "user" } }, 
           { $unwind: { path: '$user' } }, 
           { $match: MATCH }, 
           { 
               $project: { 
                   idproof: 0, 
                   panNumber: 0, 
                   loginid: 0, 
                   other: 0, 
                   'user.password': 0, 
               } 
           }, 
           { $sort: { updated_at: -1 } }, 
           { $skip: parseInt(p) * parseInt(l) }, 
           { $limit: parseInt(l) }, 
       ]); 

       data.forEach(E => { 
           if (E.images) { 
               E.thumbnailImages = []; 
               E.images.forEach(E2 => { 
                   E.thumbnailImages.push('thumbnail/' + E2.file); 
               }) 
           } 

           E.FSI_thumbnail = (E.FSI && E.FSI.file) ? 'thumbnail/' + E.FSI.file : ''; 
       }) 

       let count = await Bussiness.aggregate([ 
           { $lookup: { from: 'userlogins', localField: 'loginid', foreignField: "_id", as: "user" } }, 
           { $unwind: { path: '$user' } }, 
           { $match: MATCH }, 
       ]); 

       if (data.length > 0) { 
           res.send({ status: true, data: data, count: count.length }); 
       } else { 
           res.send({ status: false, message: 'No dat found!' }) 
       } 
   }, 

   getAllSellerBussInfo: async (req, res, next) => { 
       // var { limit, page, sort } = req.body; 
       // var l = limit || 10, p = page || 0; s = (sort == 'asc') ? 1 : -1; 
       // let data = await Bussiness.aggregate([ 
       //     { $lookup: { from: 'UserLogins', localField: 'loginid', foreignField: "_id", as: "user" } }, 
       //     { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } }, 
       //     { $skip: parseInt(page) * parseInt(limit) }, 
       //     { $limit: parseInt(limit) }, 
       // ]) 
       // if (data.length > 0) { 
       //     res.send({ status: true, data }) 
       // } else { 
       //     res.send({ status: false, message: 'No dat found!' }) 
       // } 

       try { 
           const reqBody = req.body; 
           const Limit = parseInt(reqBody.limit) || 10; 
           const PageNo = parseInt(reqBody.pageno) || 0; 

           const sellers = await UserLogins.aggregate([ 
               { $lookup: { from: 'profiles', localField: '_id', foreignField: "loginid", as: "profileInfo" } }, 
               { $lookup: { from: 'bussinesses', localField: '_id', foreignField: "loginid", as: "bussinessInfo" } }, 
               { $unwind: { path: '$profileInfo', preserveNullAndEmptyArrays: true } }, 
               { $match: { roles: ROLES[1] } }, 
               { $skip: (PageNo * Limit) }, 
               { $limit: Limit }, 
               { 
                   $project: { 
                       'password': 0, 
                       'bussinessInfo.loginid': 0, 
                       'profileInfo.loginid': 0 
                   } 
               }, 
           ]); 

           const sellersCount = await UserLogins.aggregate([ 
               { $lookup: { from: 'profiles', localField: '_id', foreignField: "loginid", as: "profileInfo" } }, 
               { $lookup: { from: 'bussinesses', localField: '_id', foreignField: "loginid", as: "bussinessInfo" } }, 
               { $unwind: { path: '$profileInfo', preserveNullAndEmptyArrays: true } }, 
               { $match: { roles: ROLES[1] } }, 
           ]); 

           return res.send({ status: true, data: sellers, count: sellersCount.length, message: 'Sellers with Bussiness Profile get successfully' }); 
       } catch (error) { 
           return res.send({ status: false, message: error.message }); 
       } 
   }, 

   approvebussiness: async (req, res, next) => { 

       try { 
           const { user_id, isBussinessVerified, note } = req.body; 
           if (!user_id) { 
               return res.send({ status: false, message: "User Id is required" }); 
           } 

           const isUser = await UserLogins.findById(user_id).lean().exec(); 

           if (!isUser) { 
               return res.send({ status: false, message: "User not found for this id" }); 
           } 

           if (isUser.roles !== ROLES[1]) { 
               return res.send({ status: false, message: "User is not a seller" }); 
           } 

           const verify = isBussinessVerified ? true : false; 

           let msg_body = note ? note : (verify ? `Congratulations galinukad team will contact you shortly` : `Please reach out to our team or share the time convenient to you. We will get in touch`); 

           Helper.sendEmail(isUser.email, 'Bussiness Verify Status', msg_body); 

           const updated = { 
               isBussinessVerified: verify, 
               note: note 
           }; 

           await UserLogins.findByIdAndUpdate(user_id, updated).lean().exec(); 

           return res.send({ status: true, message: msg_body }); 

       } catch (error) { 
           return res.send({ status: false, message: error.message }) 
       } 
   }, 

   getprofile: async (req, res, next) => { 

       try { 
           const profileId = req.body.profile_id; 
           if (!profileId) { 
               return res.send({ status: false, message: 'Profile Id is required' }); 
           } 

           const userLogin = await UserLogins.findById(profileId) 
               .select('-type_login -socialid -no_of_loggedin -password') 
               .lean().exec(); 

           if (!userLogin) { 
               return res.send({ status: false, message: 'User not found' }); 
           } 

           const profile = await Profile.findOne({ loginid: profileId }) 
               .select('_id create dob gender name phone') 
               .lean().exec(); 

           return res.send({ status: true, userLogin, profile }); 

       } catch (error) { 
           return res.send({ status: false, message: error.message }); 
       } 
   }, 


   createaddress: (req, res, next) => { 
       const { email, isdefault, companyname, phone, fname, lname, country, add1, add2, state, postal, isbilling, isshipping } = req.body; 
       let isEmpty = notEmpty({ isbilling, isshipping, phone, fname, lname, country, add1, state, postal }) 

       if (!isEmpty) { 
           res.send({ status: false, message: "Required Parameter is missing", isEmpty }); 
           return; 
       } 

       let ad = { isdefault, isbilling, isshipping, phone, fname, lname, country, add1, state, postal, loginid: req.user._id } 

       if (companyname) 
           ad['companyname'] = companyname; 

       if (add2) 
           ad['add2'] = add2; 

       if (email) 
           ad['email'] = email; 

       Address.create(ad).then((data) => { 
           if (isdefault == 1 || isdefault == true) { 
               Address.update({ loginid: req.user._id, _id: { $ne: data._id } }, { isshipping: 0, isbilling: 0, isdefault: 0 }).then(u => { 
                   res.send({ status: true, data }) 
                   return; 
               }); 
           } else { 
               res.send({ status: true, data }) 
               return; 
           } 

       }).catch((err) => { 
           res.send({ status: false, message: err.errmsg }) 
           return; 
       }); 

   }, 

   updateaddress: (req, res, next) => { 

       const { _id, email, companyname, phone, fname, lname, country, add1, add2, state, postal, isbilling, isshipping } = req.body; 

       if (!_id || _id == '') { 
           res.send({ status: false, message: "missing required params" }); 
           return; 
       } 

       let ad = { add2, email, companyname, isbilling, isshipping, phone, fname, lname, country, add1, state, postal, loginid: req.user._id, updated: new Date() } 

       Address.update({ _id: _id }, ad).then((data) => { 

           if (data.isdefault == 1) { 
               Address.update({ loginid: req.user._id, _id: { $ne: data._id } }, { isshipping: 0, isbilling: 0, isdefault: 0 }).then(u => { 
                   res.send({ status: true, data }) 
                   return; 
               }); 
           } else { 
               res.send({ status: true, data }) 
               return; 
           } 
       }).catch((err) => { 
           res.send({ status: false, message: err.errmsg }) 
           return; 
       }); 

   }, 

   getaddresses: (req, res, next) => { 
       Address.find({ loginid: req.user._id }).then((data) => { 

           data = data.sort((i, j) => { 
               if (i.isdefault > j.isdefault) { 
                   return -1 
               } else { 
                   return 1; 
               } 
           }) 
           res.send({ status: true, data }) 
           return; 
       }).catch((err) => { 
           res.send({ status: false, message: err.errmsg }) 
           return; 
       }); 

   }, 

   setdefaultshipping: (req, res, next) => { 

       const { _id } = req.body; 

       if (!_id || _id == '') { 
           res.send({ status: false, message: "missing required params" }); 
           return; 
       } 
       Address.update({ loginid: req.user._id }, { isshipping: 0 }).then(data => { 
           Address.update({ _id: _id }, { isshipping: 1 }).then((data) => { 
               res.send({ status: true, data }) 
               return; 
           }).catch((err) => { 
               res.send({ status: false, message: err.errmsg }) 
               return; 
           }); 
       }) 



   }, 

   deleteaddress: (req, res, next) => { 

       const { _id } = req.body; 

       if (!_id || _id == '') { 
           res.send({ status: false, message: "missing required params" }); 
           return; 
       } 

       Address.deleteOne({ _id: _id }).then((data) => { 
           res.send({ status: true, data }) 
           return; 
       }).catch((err) => { 
           res.send({ status: false, message: err.errmsg }) 
           return; 
       }); 




   }, 

   setdefaultbilling: (req, res, next) => { 

       const { _id } = req.body; 

       if (!_id || _id == '') { 
           res.send({ status: false, message: "missing required params" }); 
           return; 
       } 
       Address.update({ loginid: req.user._id }, { isbilling: 0 }).then(data => { 
           Address.update({ _id: _id }, { isbilling: 1 }).then((data) => { 
               res.send({ status: true, data }) 
               return; 
           }).catch((err) => { 
               res.send({ status: false, message: err.errmsg }) 
               return; 
           }); 
       }) 
   }, 

   getproductbyid: (req, res, next) => { 

       request('http://45.76.97.89:3000/products/' + req.params.id, function (error, response, body) { 
           res.send(JSON.parse(body)) 
       }); 

   }, 

   brand: (req, res, next) => { 

       res.send([{ "id": 1, "name": "Apple", "description": "", "slug": "apple", "created_at": "2020-03-14T10:30:03.468Z", "updated_at": "2020-03-14T10:30:31.584Z", "products": [{ "id": 1, "title": "Apple iPhone Retina 6s Plus 32GB", "is_featured": null, "is_hot": null, "price": 640.5, "sale_price": null, "vendor": "ROBERT Black", "is_featured": false, "is_hot": false, "price": 1893, "sale_price": 1389.99, "vendor": "Global Store", "review": 5, "is_out_of_stock": false, "depot": 70, "inventory": 80, "is_active": true, "is_sale": true, "created_at": "2020-03-15T18:22:07.656Z", "updated_at": "2020-03-15T18:22:07.656Z", "variants": [], "images": [{ "id": 232, "name": "1a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "addf8765d842420f8ad5f31c9cc6049c", "ext": ".jpg", "mime": "image/jpeg", "size": 8.78, "url": "/uploads/addf8765d842420f8ad5f31c9cc6049c.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T18:22:07.688Z", "updated_at": "2020-03-15T18:22:07.688Z" }, { "id": 233, "name": "1b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "91f9481dda1b43059807e01c4d3d0831", "ext": ".jpg", "mime": "image/jpeg", "size": 4.5, "url": "/uploads/91f9481dda1b43059807e01c4d3d0831.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T18:22:07.697Z", "updated_at": "2020-03-15T18:22:07.697Z" }, { "id": 234, "name": "1c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "faeb5485d91a4772a0215d19f234a12e", "ext": ".jpg", "mime": "image/jpeg", "size": 10.88, "url": "/uploads/faeb5485d91a4772a0215d19f234a12e.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T18:22:07.708Z", "updated_at": "2020-03-15T18:22:07.708Z" }], "thumbnail": { "id": 231, "name": "1.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "b9afa9cf7f8c4ba6a6564db68f2ce90f", "ext": ".jpg", "mime": "image/jpeg", "size": 7.35, "url": "/uploads/b9afa9cf7f8c4ba6a6564db68f2ce90f.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T18:22:07.676Z", "updated_at": "2020-03-15T18:22:07.676Z" } }, { "id": 60, "title": "Apple iPhone 7 Plus 128 GB 32 GB (4th Generation)", "is_featured": false, "is_hot": false, "price": 92.99, "sale_price": null, "vendor": "Young Shop", "review": 5, "is_out_of_stock": false, "depot": 50, "inventory": 60, "is_active": true, "is_sale": false, "created_at": "2020-03-18T05:42:14.186Z", "updated_at": "2020-03-18T05:42:14.186Z", "variants": [], "images": [{ "id": 274, "name": "70a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "ae983ce46fc64ec4bc65ca800de5ea56", "ext": ".jpg", "mime": "image/jpeg", "size": 24.59, "url": "/uploads/ae983ce46fc64ec4bc65ca800de5ea56.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T05:42:14.234Z", "updated_at": "2020-03-18T05:42:14.234Z" }, { "id": 275, "name": "70b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "0d1eaad741ce4efba4bba3dfa0bb4a52", "ext": ".jpg", "mime": "image/jpeg", "size": 7.02, "url": "/uploads/0d1eaad741ce4efba4bba3dfa0bb4a52.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T05:42:14.248Z", "updated_at": "2020-03-18T05:42:14.248Z" }, { "id": 276, "name": "70c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "cb1f36ff311c4297ba19ba9f27785fd2", "ext": ".jpg", "mime": "image/jpeg", "size": 8.65, "url": "/uploads/cb1f36ff311c4297ba19ba9f27785fd2.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T05:42:14.260Z", "updated_at": "2020-03-18T05:42:14.260Z" }], "thumbnail": { "id": 273, "name": "15.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "93b647e5138f40d991c4f7d123794b1f", "ext": ".jpg", "mime": "image/jpeg", "size": 4.49, "url": "/uploads/93b647e5138f40d991c4f7d123794b1f.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T05:42:14.215Z", "updated_at": "2020-03-18T05:42:14.215Z" } }, { "id": 73, "title": "Acrylic Cover Case for iPhone X- (Clear)", "is_featured": false, "is_hot": false, "price": 49.99, "sale_price": null, "vendor": "Global Office", "review": 4, "is_out_of_stock": false, "depot": 60, "inventory": 70, "is_active": true, "is_sale": false, "created_at": "2020-03-18T05:51:16.881Z", "updated_at": "2020-03-18T05:51:16.881Z", "variants": [], "images": [{ "id": 292, "name": "74a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "9060cce18215425cb932cd04807858ea", "ext": ".jpg", "mime": "image/jpeg", "size": 63, "url": "/uploads/9060cce18215425cb932cd04807858ea.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T05:51:16.944Z", "updated_at": "2020-03-18T05:51:16.944Z" }, { "id": 293, "name": "74b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "164c1cb463f040caa92d0206c3dac9e6", "ext": ".jpg", "mime": "image/jpeg", "size": 14.11, "url": "/uploads/164c1cb463f040caa92d0206c3dac9e6.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T05:51:16.957Z", "updated_at": "2020-03-18T05:51:16.957Z" }, { "id": 294, "name": "74c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "9939d662151d49cf8703359034d3e39c", "ext": ".jpg", "mime": "image/jpeg", "size": 21.53, "url": "/uploads/9939d662151d49cf8703359034d3e39c.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T05:51:16.967Z", "updated_at": "2020-03-18T05:51:16.967Z" }, { "id": 295, "name": "74d.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "0a20ecfcafde4344b5c84a593f6ee6ed", "ext": ".jpg", "mime": "image/jpeg", "size": 17.9, "url": "/uploads/0a20ecfcafde4344b5c84a593f6ee6ed.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T05:51:16.977Z", "updated_at": "2020-03-18T05:51:16.977Z" }], "thumbnail": { "id": 291, "name": "19.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "2b1781baa5a045cd83c9d1ff5f4882e4", "ext": ".jpg", "mime": "image/jpeg", "size": 8.87, "url": "/uploads/2b1781baa5a045cd83c9d1ff5f4882e4.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T05:51:16.924Z", "updated_at": "2020-03-18T05:51:16.924Z" } }] }, { "id": 2, "name": "Marshall", "description": null, "slug": "marshall", "created_at": "2020-03-14T10:31:31.138Z", "updated_at": "2020-03-14T10:31:31.138Z", "products": [{ "id": 3, "title": "Marshall Kilburn Portable Wireless Speaker", "is_featured": false, "is_hot": false, "price": 42.99, "sale_price": null, "vendor": "Go Pro", "review": 5, "is_out_of_stock": false, "depot": 85, "inventory": 100, "is_active": true, "is_sale": false, "created_at": "2020-03-15T05:55:19.349Z", "updated_at": "2020-03-15T05:55:19.349Z", "variants": [], "images": [{ "id": 10, "name": "1.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "3398b7a330154c9390db4495b9e3d413", "ext": ".jpg", "mime": "image/jpeg", "size": 158.75, "url": "/uploads/3398b7a330154c9390db4495b9e3d413.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T05:55:19.403Z", "updated_at": "2020-03-15T05:55:19.403Z" }, { "id": 11, "name": "2.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "73b00542e06e4d008945bc701959472b", "ext": ".jpg", "mime": "image/jpeg", "size": 44.03, "url": "/uploads/73b00542e06e4d008945bc701959472b.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T05:55:19.415Z", "updated_at": "2020-03-15T05:55:19.415Z" }, { "id": 12, "name": "3.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "f0647af5998446e1a6a1906996014a0a", "ext": ".jpg", "mime": "image/jpeg", "size": 69.23, "url": "/uploads/f0647af5998446e1a6a1906996014a0a.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T05:55:19.425Z", "updated_at": "2020-03-15T05:55:19.425Z" }], "thumbnail": { "id": 9, "name": "2.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "feaeaa8c5d24474e943f57a7df55e921", "ext": ".jpg", "mime": "image/jpeg", "size": 15.15, "url": "/uploads/feaeaa8c5d24474e943f57a7df55e921.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T05:55:19.385Z", "updated_at": "2020-03-15T05:55:19.385Z" } }, { "id": 15, "title": "Beat Spill 2.0 Wireless Speaker s Sports Runnning Swim Board Shorts", "is_featured": false, "is_hot": false, "price": 13.43, "sale_price": null, "vendor": "Robert's Store", "review": 5, "is_out_of_stock": false, "depot": 70, "inventory": 80, "is_active": true, "is_sale": false, "created_at": "2020-03-15T06:24:30.658Z", "updated_at": "2020-03-18T12:53:44.500Z", "variants": [], "images": [{ "id": 51, "name": "12a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "fefc8854e39940d49f828c8035b20f76", "ext": ".jpg", "mime": "image/jpeg", "size": 108.16, "url": "/uploads/fefc8854e39940d49f828c8035b20f76.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:24:30.700Z", "updated_at": "2020-03-15T06:24:30.700Z" }, { "id": 52, "name": "12b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "bf24fcb93d8d46e894ddb47dd26dc335", "ext": ".jpg", "mime": "image/jpeg", "size": 38.91, "url": "/uploads/bf24fcb93d8d46e894ddb47dd26dc335.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:24:30.716Z", "updated_at": "2020-03-15T06:24:30.716Z" }, { "id": 53, "name": "12c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "f578cf9bb1d24f3c8c898e09796ae503", "ext": ".jpg", "mime": "image/jpeg", "size": 38.08, "url": "/uploads/f578cf9bb1d24f3c8c898e09796ae503.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:24:30.725Z", "updated_at": "2020-03-15T06:24:30.725Z" }], "thumbnail": { "id": 50, "name": "11.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "283e9ff36993434c9d228a5f7681e330", "ext": ".jpg", "mime": "image/jpeg", "size": 19.09, "url": "/uploads/283e9ff36993434c9d228a5f7681e330.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:24:30.681Z", "updated_at": "2020-03-15T06:24:30.681Z" } }, { "id": 30, "title": "Letter Printed Cushion Cover Cotton", "is_featured": false, "is_hot": false, "price": 60, "sale_price": 42, "vendor": "Young Shop", "review": 2, "is_out_of_stock": false, "depot": 60, "inventory": 80, "is_active": true, "is_sale": true, "created_at": "2020-03-15T09:01:33.601Z", "updated_at": "2020-03-15T09:01:33.601Z", "variants": [], "images": [{ "id": 137, "name": "7.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "cca3c5bbc1f4412aad6cf03cf87d81e8", "ext": ".jpg", "mime": "image/jpeg", "size": 11.61, "url": "/uploads/cca3c5bbc1f4412aad6cf03cf87d81e8.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T09:01:33.634Z", "updated_at": "2020-03-15T09:01:33.634Z" }], "thumbnail": { "id": 136, "name": "7.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "aefd853e2fd942bb860b9eb4d8b8d7c0", "ext": ".jpg", "mime": "image/jpeg", "size": 11.61, "url": "/uploads/aefd853e2fd942bb860b9eb4d8b8d7c0.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T09:01:33.622Z", "updated_at": "2020-03-15T09:01:33.622Z" } }] }, { "id": 4, "name": "Microsoft", "description": null, "slug": "microsoft", "created_at": "2020-03-14T10:31:45.382Z", "updated_at": "2020-03-14T10:31:45.382Z", "products": [{ "id": 5, "title": "Xbox One Wireless Controller Black Color", "is_featured": false, "is_hot": true, "price": 55.99, "sale_price": null, "vendor": "Global Office", "review": 5, "is_out_of_stock": false, "depot": 70, "inventory": 80, "is_active": true, "is_sale": false, "created_at": "2020-03-15T06:02:06.677Z", "updated_at": "2020-03-15T06:02:06.677Z", "variants": [], "images": [{ "id": 19, "name": "5a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "1a15c64eb31a4bc2bbeff1961535519c", "ext": ".jpg", "mime": "image/jpeg", "size": 30.89, "url": "/uploads/1a15c64eb31a4bc2bbeff1961535519c.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:02:06.726Z", "updated_at": "2020-03-15T06:02:06.726Z" }, { "id": 20, "name": "5b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "bb6866b289d949338bf655c7351f9df8", "ext": ".jpg", "mime": "image/jpeg", "size": 24.88, "url": "/uploads/bb6866b289d949338bf655c7351f9df8.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:02:06.739Z", "updated_at": "2020-03-15T06:02:06.739Z" }, { "id": 21, "name": "5c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "d3a3d44ea16e439c9ff426a90e60acd2", "ext": ".jpg", "mime": "image/jpeg", "size": 21.5, "url": "/uploads/d3a3d44ea16e439c9ff426a90e60acd2.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:02:06.748Z", "updated_at": "2020-03-15T06:02:06.748Z" }, { "id": 22, "name": "5d.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "faa25ed3c1fd4ba3a904b2b6dd8bdc87", "ext": ".jpg", "mime": "image/jpeg", "size": 39.19, "url": "/uploads/faa25ed3c1fd4ba3a904b2b6dd8bdc87.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:02:06.765Z", "updated_at": "2020-03-15T06:02:06.765Z" }], "thumbnail": { "id": 18, "name": "5a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "8e2e4eff27414c719203df4ea88e68be", "ext": ".jpg", "mime": "image/jpeg", "size": 30.89, "url": "/uploads/8e2e4eff27414c719203df4ea88e68be.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:02:06.710Z", "updated_at": "2020-03-15T06:02:06.710Z" } }] }, { "id": 5, "name": "Mega System", "description": null, "slug": "megasystem", "created_at": "2020-03-14T10:32:07.805Z", "updated_at": "2020-03-14T10:32:07.805Z", "products": [{ "id": 14, "title": "MVMTH Classical Leather Watch In Black", "is_featured": false, "is_hot": false, "price": 62.99, "sale_price": 57.99, "vendor": "Young Shop", "review": 5, "is_out_of_stock": false, "depot": 60, "inventory": 70, "is_active": true, "is_sale": true, "created_at": "2020-03-15T06:34:26.192Z", "updated_at": "2020-03-15T06:34:26.192Z", "variants": [], "images": [{ "id": 60, "name": "14a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "3ac851d95c86433b8fcc50600c917036", "ext": ".jpg", "mime": "image/jpeg", "size": 37.78, "url": "/uploads/3ac851d95c86433b8fcc50600c917036.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:34:26.237Z", "updated_at": "2020-03-15T06:34:26.237Z" }, { "id": 61, "name": "14b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "ebe0db165640431d9c8fd683f3258663", "ext": ".jpg", "mime": "image/jpeg", "size": 22.93, "url": "/uploads/ebe0db165640431d9c8fd683f3258663.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:34:26.244Z", "updated_at": "2020-03-15T06:34:26.244Z" }, { "id": 62, "name": "14c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "3f385d0f210e4ee88ed91de38d36470e", "ext": ".jpg", "mime": "image/jpeg", "size": 16.68, "url": "/uploads/3f385d0f210e4ee88ed91de38d36470e.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:34:26.262Z", "updated_at": "2020-03-15T06:34:26.262Z" }], "thumbnail": { "id": 59, "name": "13.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "5a88e8516a6e44cb86ba41516dca0d56", "ext": ".jpg", "mime": "image/jpeg", "size": 7.62, "url": "/uploads/5a88e8516a6e44cb86ba41516dca0d56.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:34:26.226Z", "updated_at": "2020-03-15T06:34:26.226Z" } }, { "id": 32, "title": "Anderson Composites S STORE", "review": 2, "is_out_of_stock": false, "depot": 60, "inventory": 70, "is_active": true, "is_sale": true, "created_at": "2020-03-15T09:17:42.168Z", "updated_at": "2020-03-18T12:47:03.124Z", "variants": [], "images": [{ "id": 339, "name": "1.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "0272916ed6ed43d0807c545280ee2f32", "ext": ".jpg", "mime": "image/jpeg", "size": 13.97, "url": "/uploads/0272916ed6ed43d0807c545280ee2f32.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T12:47:03.173Z", "updated_at": "2020-03-18T12:47:03.173Z" }], "thumbnail": { "id": 338, "name": "1.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "020a68b5cdfe455e88cdd01f7500ed92", "ext": ".jpg", "mime": "image/jpeg", "size": 13.97, "url": "/uploads/020a68b5cdfe455e88cdd01f7500ed92.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T12:47:03.163Z", "updated_at": "2020-03-18T12:47:03.163Z" } }, { "id": 33, "title": "Evolution Sport Drilled and Slotted Brake Kit", "is_featured": false, "is_hot": false, "price": 50.5, "sale_price": 45.99, "vendor": "ROBERT Custom Hood", "is_featured": false, "is_hot": false, "price": 442.99, "sale_price": null, "vendor": "Go Pro", "review": 3, "is_out_of_stock": false, "depot": 40, "inventory": 50, "is_active": true, "is_sale": false, "created_at": "2020-03-15T09:37:17.903Z", "updated_at": "2020-03-15T09:37:17.903Z", "variants": [], "images": [{ "id": 148, "name": "36a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "12cfa605c95c48d080be5bfe66d6f091", "ext": ".jpg", "mime": "image/jpeg", "size": 51.22, "url": "/uploads/12cfa605c95c48d080be5bfe66d6f091.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T09:37:17.942Z", "updated_at": "2020-03-15T09:37:17.942Z" }, { "id": 149, "name": "36b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "a999ffaca996462cbd4345b07c6b5571", "ext": ".jpg", "mime": "image/jpeg", "size": 52.83, "url": "/uploads/a999ffaca996462cbd4345b07c6b5571.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T09:37:17.952Z", "updated_at": "2020-03-15T09:37:17.952Z" }, { "id": 150, "name": "36c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "abee37e1ac8b4b05ba620ee1329a5ef0", "ext": ".jpg", "mime": "image/jpeg", "size": 44.91, "url": "/uploads/abee37e1ac8b4b05ba620ee1329a5ef0.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T09:37:17.961Z", "updated_at": "2020-03-15T09:37:17.961Z" }], "thumbnail": { "id": 147, "name": "4.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "70a4149f0f15483b93737b522a0a9a44", "ext": ".jpg", "mime": "image/jpeg", "size": 8.13, "url": "/uploads/70a4149f0f15483b93737b522a0a9a44.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T09:37:17.924Z", "updated_at": "2020-03-15T09:37:17.924Z" } }] }, { "id": 6, "name": "Sony", "description": null, "slug": "sony", "created_at": "2020-03-14T10:32:15.139Z", "updated_at": "2020-03-14T10:32:15.139Z", "products": [{ "id": 7, "title": "Sound Intone I65 Earphone White Version", "is_featured": false, "is_hot": false, "price": 106.96, "sale_price": 100.99, "vendor": "Youngshop", "review": 5, "is_out_of_stock": false, "depot": 80, "inventory": 90, "is_active": true, "is_sale": true, "created_at": "2020-03-15T06:12:37.749Z", "updated_at": "2020-04-14T10:45:51.530Z", "variants": [], "images": [{ "id": 27, "name": "7a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "e98492a0c2b24ae5892641009bf21056", "ext": ".jpg", "mime": "image/jpeg", "size": 35.46, "url": "/uploads/e98492a0c2b24ae5892641009bf21056.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:12:37.787Z", "updated_at": "2020-03-15T06:12:37.787Z" }, { "id": 28, "name": "7b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "55fbf669c1804ea994ace81b7aa58896", "ext": ".jpg", "mime": "image/jpeg", "size": 44.24, "url": "/uploads/55fbf669c1804ea994ace81b7aa58896.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:12:37.797Z", "updated_at": "2020-03-15T06:12:37.797Z" }, { "id": 29, "name": "7c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "b6bf4ec3c620428ca2c3876d31b28252", "ext": ".jpg", "mime": "image/jpeg", "size": 35.55, "url": "/uploads/b6bf4ec3c620428ca2c3876d31b28252.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:12:37.807Z", "updated_at": "2020-03-15T06:12:37.807Z" }, { "id": 30, "name": "7d.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "dcdfd21d3ea44a6888d983d21852d961", "ext": ".jpg", "mime": "image/jpeg", "size": 30.8, "url": "/uploads/dcdfd21d3ea44a6888d983d21852d961.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:12:37.816Z", "updated_at": "2020-03-15T06:12:37.816Z" }], "thumbnail": { "id": 26, "name": "6.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "b097fdfb8b9d40fca83de9180de5a7ab", "ext": ".jpg", "mime": "image/jpeg", "size": 7.03, "url": "/uploads/b097fdfb8b9d40fca83de9180de5a7ab.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:12:37.775Z", "updated_at": "2020-03-15T06:12:37.775Z" } }, { "id": 23, "title": "Amcrest Security Camera in White Color", "is_featured": false, "is_hot": false, "price": 62.99, "sale_price": 45.9, "vendor": "Global Office", "review": 4, "is_out_of_stock": false, "depot": 60, "inventory": 80, "is_active": true, "is_sale": true, "created_at": "2020-03-15T07:00:52.871Z", "updated_at": "2020-03-15T07:00:52.871Z", "variants": [], "images": [{ "id": 103, "name": "24a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "4fcbfdb675614342a172da1be483724e", "ext": ".jpg", "mime": "image/jpeg", "size": 38.76, "url": "/uploads/4fcbfdb675614342a172da1be483724e.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T07:00:52.919Z", "updated_at": "2020-03-15T07:00:52.919Z" }, { "id": 104, "name": "24b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "ba0feb269ff041e9ba8489b63c0ad79d", "ext": ".jpg", "mime": "image/jpeg", "size": 19.41, "url": "/uploads/ba0feb269ff041e9ba8489b63c0ad79d.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T07:00:52.927Z", "updated_at": "2020-03-15T07:00:52.927Z" }, { "id": 105, "name": "24c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "7ed9a1fcc0814f78bf3ce9941fffcc5c", "ext": ".jpg", "mime": "image/jpeg", "size": 20.22, "url": "/uploads/7ed9a1fcc0814f78bf3ce9941fffcc5c.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T07:00:52.935Z", "updated_at": "2020-03-15T07:00:52.935Z" }, { "id": 106, "name": "24d.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "48f249386e604cb69c56a6dfd893d364", "ext": ".jpg", "mime": "image/jpeg", "size": 15.15, "url": "/uploads/48f249386e604cb69c56a6dfd893d364.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T07:00:52.943Z", "updated_at": "2020-03-15T07:00:52.943Z" }], "thumbnail": { "id": 102, "name": "22.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "bb783d18223044cca198d84a4e0e3191", "ext": ".jpg", "mime": "image/jpeg", "size": 7.24, "url": "/uploads/bb783d18223044cca198d84a4e0e3191.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T07:00:52.903Z", "updated_at": "2020-03-15T07:00:52.903Z" } }, { "id": 43, "title": "Nikon Coolpix 24 Megapixel Camera", "is_featured": false, "is_hot": false, "price": 393.38, "sale_price": null, "vendor": "Global Office", "review": 5, "is_out_of_stock": false, "depot": 70, "inventory": 80, "is_active": true, "is_sale": false, "created_at": "2020-03-15T09:51:05.087Z", "updated_at": "2020-03-15T09:51:05.087Z", "variants": [], "images": [{ "id": 166, "name": "44a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "c8ff3afb2eef49b99c8abc0f1bbf3563", "ext": ".jpg", "mime": "image/jpeg", "size": 41.72, "url": "/uploads/c8ff3afb2eef49b99c8abc0f1bbf3563.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T09:51:05.119Z", "updated_at": "2020-03-15T09:51:05.119Z" }, { "id": 167, "name": "44b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "56596cdb7d034c3e99ff9daf3c464128", "ext": ".jpg", "mime": "image/jpeg", "size": 12.31, "url": "/uploads/56596cdb7d034c3e99ff9daf3c464128.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T09:51:05.129Z", "updated_at": "2020-03-15T09:51:05.129Z" }, { "id": 168, "name": "44c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "92d14dc17dbe44169c3daa3c6f8bddd0", "ext": ".jpg", "mime": "image/jpeg", "size": 13.54, "url": "/uploads/92d14dc17dbe44169c3daa3c6f8bddd0.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T09:51:05.139Z", "updated_at": "2020-03-15T09:51:05.139Z" }, { "id": 169, "name": "44d.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "d9fdd2a79c1540b68ae3ee84d9523a70", "ext": ".jpg", "mime": "image/jpeg", "size": 13.63, "url": "/uploads/d9fdd2a79c1540b68ae3ee84d9523a70.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T09:51:05.147Z", "updated_at": "2020-03-15T09:51:05.147Z" }], "thumbnail": { "id": 165, "name": "19.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "d8125ce8ae8b46cb926e01daae0c0fb2", "ext": ".jpg", "mime": "image/jpeg", "size": 6.5, "url": "/uploads/d8125ce8ae8b46cb926e01daae0c0fb2.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T09:51:05.108Z", "updated_at": "2020-03-15T09:51:05.108Z" } }, { "id": 44, "title": "Sony HD 1080, 13.5MP, White Version", "is_featured": false, "is_hot": false, "price": 760, "sale_price": 625, "vendor": "Young Shop", "review": 5, "is_out_of_stock": false, "depot": 70, "inventory": 80, "is_active": true, "is_sale": true, "created_at": "2020-03-15T09:55:33.399Z", "updated_at": "2020-03-15T09:55:33.399Z", "variants": [], "images": [{ "id": 171, "name": "45a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "6dab2ac788b04a5cbca7400ec03d8a38", "ext": ".jpg", "mime": "image/jpeg", "size": 28.26, "url": "/uploads/6dab2ac788b04a5cbca7400ec03d8a38.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T09:55:33.428Z", "updated_at": "2020-03-15T09:55:33.428Z" }, { "id": 172, "name": "45b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "1c026df89da0490bbe2a7afc5a99195a", "ext": ".jpg", "mime": "image/jpeg", "size": 9.88, "url": "/uploads/1c026df89da0490bbe2a7afc5a99195a.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T09:55:33.438Z", "updated_at": "2020-03-15T09:55:33.438Z" }, { "id": 173, "name": "45c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "4c1c99e28c794b26a047a0c87a679f98", "ext": ".jpg", "mime": "image/jpeg", "size": 7.65, "url": "/uploads/4c1c99e28c794b26a047a0c87a679f98.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T09:55:33.446Z", "updated_at": "2020-03-15T09:55:33.446Z" }, { "id": 174, "name": "45d.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "0de96474e26645699609477fdd64b21e", "ext": ".jpg", "mime": "image/jpeg", "size": 5.76, "url": "/uploads/0de96474e26645699609477fdd64b21e.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T09:55:33.455Z", "updated_at": "2020-03-15T09:55:33.455Z" }], "thumbnail": { "id": 170, "name": "20.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "d8789adf571d46f19ce9065da0cf64a3", "ext": ".jpg", "mime": "image/jpeg", "size": 3.72, "url": "/uploads/d8789adf571d46f19ce9065da0cf64a3.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T09:55:33.416Z", "updated_at": "2020-03-15T09:55:33.416Z" } }, { "id": 67, "title": "Bose Ear-Phone Bluetooth & Wireless", "is_featured": false, "is_hot": false, "price": 392.99, "sale_price": null, "vendor": "Young Shop", "review": 4, "is_out_of_stock": false, "depot": 60, "inventory": 70, "is_active": true, "is_sale": false, "created_at": "2020-03-18T05:38:55.759Z", "updated_at": "2020-03-18T05:38:55.759Z", "variants": [], "images": [{ "id": 264, "name": "68a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "20898b1b75ff4fcd9967794e6def5d28", "ext": ".jpg", "mime": "image/jpeg", "size": 47.86, "url": "/uploads/20898b1b75ff4fcd9967794e6def5d28.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T05:38:55.790Z", "updated_at": "2020-03-18T05:38:55.790Z" }, { "id": 265, "name": "68b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "7a5d1d5dfc4e4c7f98dd19899c4da4da", "ext": ".jpg", "mime": "image/jpeg", "size": 8.04, "url": "/uploads/7a5d1d5dfc4e4c7f98dd19899c4da4da.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T05:38:55.800Z", "updated_at": "2020-03-18T05:38:55.800Z" }, { "id": 266, "name": "68c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "05a1dc53fdf6423884f70e1693bb7451", "ext": ".jpg", "mime": "image/jpeg", "size": 14.82, "url": "/uploads/05a1dc53fdf6423884f70e1693bb7451.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T05:38:55.813Z", "updated_at": "2020-03-18T05:38:55.813Z" }, { "id": 267, "name": "68d.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "e343e6de894e4428adc482f129f96d8f", "ext": ".jpg", "mime": "image/jpeg", "size": 22.57, "url": "/uploads/e343e6de894e4428adc482f129f96d8f.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T05:38:55.837Z", "updated_at": "2020-03-18T05:38:55.837Z" }], "thumbnail": { "id": 348, "name": "68a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "9807d7efbaba430b9c90fc2aaa9ec175", "ext": ".jpg", "mime": "image/jpeg", "size": 47.86, "url": "/uploads/9807d7efbaba430b9c90fc2aaa9ec175.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-28T12:09:41.868Z", "updated_at": "2020-03-28T12:09:41.868Z" } }, { "id": 75, "title": "Beats Mini On Ear Bluetooth, Wireless Headphone", "is_featured": false, "is_hot": false, "price": 64.99, "sale_price": null, "vendor": "Global Office", "review": 5, "is_out_of_stock": false, "depot": 60, "inventory": 70, "is_active": true, "is_sale": false, "created_at": "2020-03-18T06:42:47.008Z", "updated_at": "2020-03-18T06:42:47.008Z", "variants": [], "images": [{ "id": 301, "name": "76a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "fac9d42ab10e40679fa480bab1f25248", "ext": ".jpg", "mime": "image/jpeg", "size": 20.34, "url": "/uploads/fac9d42ab10e40679fa480bab1f25248.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T06:42:47.047Z", "updated_at": "2020-03-18T06:42:47.047Z" }, { "id": 302, "name": "76b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "29c988a8fbf2411eb0acdd827c59a86a", "ext": ".jpg", "mime": "image/jpeg", "size": 10.41, "url": "/uploads/29c988a8fbf2411eb0acdd827c59a86a.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T06:42:47.061Z", "updated_at": "2020-03-18T06:42:47.061Z" }, { "id": 303, "name": "76c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "3a50a259ac0f42cda5affdad8a6ac8b4", "ext": ".jpg", "mime": "image/jpeg", "size": 10.62, "url": "/uploads/3a50a259ac0f42cda5affdad8a6ac8b4.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T06:42:47.072Z", "updated_at": "2020-03-18T06:42:47.072Z" }, { "id": 304, "name": "76d.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "0375b08ca4be44f784ed68d9948fe9c2", "ext": ".jpg", "mime": "image/jpeg", "size": 3.65, "url": "/uploads/0375b08ca4be44f784ed68d9948fe9c2.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T06:42:47.081Z", "updated_at": "2020-03-18T06:42:47.081Z" }], "thumbnail": { "id": 300, "name": "21.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "1ed1fb833fc942209c3f289c7cf3bb82", "ext": ".jpg", "mime": "image/jpeg", "size": 2.83, "url": "/uploads/1ed1fb833fc942209c3f289c7cf3bb82.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T06:42:47.032Z", "updated_at": "2020-03-18T06:42:47.032Z" } }] }, { "id": 7, "name": "Flat Funiture", "description": null, "slug": "flatfuniture", "created_at": "2020-03-14T10:32:23.182Z", "updated_at": "2020-03-14T10:32:23.182Z", "products": [{ "id": 8, "title": "Korea Long Sofa Fabric In Blue Navy Color", "is_featured": false, "is_hot": false, "price": 670.2, "sale_price": 567.8, "vendor": "Youngshop", "review": 4, "is_out_of_stock": false, "depot": 85, "inventory": 79, "is_active": true, "is_sale": true, "created_at": "2020-03-15T06:15:55.939Z", "updated_at": "2020-03-15T06:15:55.939Z", "variants": [], "images": [{ "id": 32, "name": "8a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "caafb8f05561484a97923b235d2603f7", "ext": ".jpg", "mime": "image/jpeg", "size": 20.75, "url": "/uploads/caafb8f05561484a97923b235d2603f7.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:15:56.021Z", "updated_at": "2020-03-15T06:15:56.021Z" }, { "id": 33, "name": "8b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "ea26eeafaa1747b5857ee73c93430261", "ext": ".jpg", "mime": "image/jpeg", "size": 26.42, "url": "/uploads/ea26eeafaa1747b5857ee73c93430261.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:15:56.038Z", "updated_at": "2020-03-15T06:15:56.038Z" }, { "id": 34, "name": "8c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "97b54a32f4864342bc485c7929de6366", "ext": ".jpg", "mime": "image/jpeg", "size": 19.04, "url": "/uploads/97b54a32f4864342bc485c7929de6366.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:15:56.047Z", "updated_at": "2020-03-15T06:15:56.047Z" }, { "id": 35, "name": "8d.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "210d685d19f84c8b9e5de231176b4cf2", "ext": ".jpg", "mime": "image/jpeg", "size": 155.83, "url": "/uploads/210d685d19f84c8b9e5de231176b4cf2.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:15:56.057Z", "updated_at": "2020-03-15T06:15:56.057Z" }], "thumbnail": { "id": 31, "name": "7.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "04ec8d58423647c98d6dbd3544c1c355", "ext": ".jpg", "mime": "image/jpeg", "size": 3.63, "url": "/uploads/04ec8d58423647c98d6dbd3544c1c355.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:15:55.999Z", "updated_at": "2020-03-15T06:15:55.999Z" } }, { "id": 26, "title": "Simple Plastice Chair In White Color", "is_featured": false, "is_hot": false, "price": 60, "sale_price": 42, "vendor": "Young Shop", "review": 2, "is_out_of_stock": false, "depot": 70, "inventory": 80, "is_active": true, "is_sale": true, "created_at": "2020-03-15T07:23:26.180Z", "updated_at": "2020-03-15T07:23:26.180Z", "variants": [], "images": [{ "id": 118, "name": "27a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "e8c3cd4a32bd4baa9772aa080594d756", "ext": ".jpg", "mime": "image/jpeg", "size": 22.57, "url": "/uploads/e8c3cd4a32bd4baa9772aa080594d756.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T07:23:26.212Z", "updated_at": "2020-03-15T07:23:26.212Z" }, { "id": 119, "name": "27b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "4f482d2091c94fe6b2f9216e1652ad11", "ext": ".jpg", "mime": "image/jpeg", "size": 15.18, "url": "/uploads/4f482d2091c94fe6b2f9216e1652ad11.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T07:23:26.222Z", "updated_at": "2020-03-15T07:23:26.222Z" }, { "id": 120, "name": "27c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "fe5b2973ad694105b20eee9917e1491c", "ext": ".jpg", "mime": "image/jpeg", "size": 17.18, "url": "/uploads/fe5b2973ad694105b20eee9917e1491c.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T07:23:26.237Z", "updated_at": "2020-03-15T07:23:26.237Z" }, { "id": 121, "name": "27d.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "6b8716a6edc84d0191c9411e84335189", "ext": ".jpg", "mime": "image/jpeg", "size": 46.91, "url": "/uploads/6b8716a6edc84d0191c9411e84335189.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T07:23:26.251Z", "updated_at": "2020-03-15T07:23:26.251Z" }], "thumbnail": { "id": 117, "name": "3.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "c9bc200f332d47e48d4cfa68018c415c", "ext": ".jpg", "mime": "image/jpeg", "size": 4.33, "url": "/uploads/c9bc200f332d47e48d4cfa68018c415c.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T07:23:26.200Z", "updated_at": "2020-03-15T07:23:26.200Z" } }, { "id": 27, "title": "Korea Fabric Chair In Brown Color", "is_featured": false, "is_hot": false, "price": 320, "sale_price": null, "vendor": "Global Office", "review": 1, "is_out_of_stock": true, "depot": 65, "inventory": 80, "is_active": true, "is_sale": false, "created_at": "2020-03-15T07:26:02.264Z", "updated_at": "2020-03-15T07:26:02.264Z", "variants": [], "images": [{ "id": 123, "name": "28a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "8d2cd1d8755348b6bbd46c4216599640", "ext": ".jpg", "mime": "image/jpeg", "size": 145.11, "url": "/uploads/8d2cd1d8755348b6bbd46c4216599640.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T07:26:02.297Z", "updated_at": "2020-03-15T07:26:02.297Z" }, { "id": 124, "name": "28b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "925471220e1d47d082cd932b253e6666", "ext": ".jpg", "mime": "image/jpeg", "size": 37.46, "url": "/uploads/925471220e1d47d082cd932b253e6666.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T07:26:02.305Z", "updated_at": "2020-03-15T07:26:02.305Z" }, { "id": 125, "name": "28c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "a92af1e9436d4bdea3c0bef7ab6beccb", "ext": ".jpg", "mime": "image/jpeg", "size": 46.35, "url": "/uploads/a92af1e9436d4bdea3c0bef7ab6beccb.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T07:26:02.316Z", "updated_at": "2020-03-15T07:26:02.316Z" }, { "id": 126, "name": "28d.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "43ffb2ae9d3a4fd28097c7ba63dd5b22", "ext": ".jpg", "mime": "image/jpeg", "size": 64.39, "url": "/uploads/43ffb2ae9d3a4fd28097c7ba63dd5b22.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T07:26:02.324Z", "updated_at": "2020-03-15T07:26:02.324Z" }], "thumbnail": { "id": 122, "name": "4.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "afd6ccaff3fe4895903ec49b51b181d0", "ext": ".jpg", "mime": "image/jpeg", "size": 9.48, "url": "/uploads/afd6ccaff3fe4895903ec49b51b181d0.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T07:26:02.287Z", "updated_at": "2020-03-15T07:26:02.287Z" } }, { "id": 45, "title": "Wood Simple Tea Table", "is_featured": false, "is_hot": false, "price": 393.38, "sale_price": null, "vendor": "Global Office", "review": 3, "is_out_of_stock": false, "depot": 70, "inventory": 80, "is_active": true, "is_sale": false, "created_at": "2020-03-15T12:49:54.993Z", "updated_at": "2020-03-15T12:49:54.993Z", "variants": [], "images": [{ "id": 176, "name": "46a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "21b0d78f72b64f3e8b92cf194e499b7a", "ext": ".jpg", "mime": "image/jpeg", "size": 36.64, "url": "/uploads/21b0d78f72b64f3e8b92cf194e499b7a.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T12:49:55.046Z", "updated_at": "2020-03-15T12:49:55.046Z" }, { "id": 177, "name": "46b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "c9c68e1ace634ee69ced00590d3e4aa1", "ext": ".jpg", "mime": "image/jpeg", "size": 13.92, "url": "/uploads/c9c68e1ace634ee69ced00590d3e4aa1.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T12:49:55.055Z", "updated_at": "2020-03-15T12:49:55.055Z" }, { "id": 178, "name": "46c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "6ee8e30510df4e88a2807b38e38838ed", "ext": ".jpg", "mime": "image/jpeg", "size": 13.48, "url": "/uploads/6ee8e30510df4e88a2807b38e38838ed.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T12:49:55.065Z", "updated_at": "2020-03-15T12:49:55.065Z" }, { "id": 179, "name": "46d.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "61f9d89dc3cf4161b157d7b969111cc9", "ext": ".jpg", "mime": "image/jpeg", "size": 93.96, "url": "/uploads/61f9d89dc3cf4161b157d7b969111cc9.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T12:49:55.075Z", "updated_at": "2020-03-15T12:49:55.075Z" }], "thumbnail": { "id": 175, "name": "8.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "3192b332d84248d0870b62db15ea79b6", "ext": ".jpg", "mime": "image/jpeg", "size": 3.97, "url": "/uploads/3192b332d84248d0870b62db15ea79b6.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T12:49:55.032Z", "updated_at": "2020-03-15T12:49:55.032Z" } }, { "id": 46, "title": "Simple Plastic Chair In Gray Color", "is_featured": false, "is_hot": false, "price": 50, "sale_price": 25, "vendor": "Young Shop", "review": 5, "is_out_of_stock": false, "depot": 70, "inventory": 80, "is_active": true, "is_sale": true, "created_at": "2020-03-15T12:50:58.066Z", "updated_at": "2020-03-15T12:50:58.066Z", "variants": [], "images": [{ "id": 343, "name": "47a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "c34777c27dd44d6ab517cf5e5f0d3e67", "ext": ".jpg", "mime": "image/jpeg", "size": 76.72, "url": "/uploads/c34777c27dd44d6ab517cf5e5f0d3e67.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T12:49:00.500Z", "updated_at": "2020-03-18T12:49:00.500Z" }, { "id": 344, "name": "47b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "f5ca8fbda1cd45ccaa57e0dcf1692fb3", "ext": ".jpg", "mime": "image/jpeg", "size": 14.54, "url": "/uploads/f5ca8fbda1cd45ccaa57e0dcf1692fb3.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T12:49:00.510Z", "updated_at": "2020-03-18T12:49:00.510Z" }, { "id": 345, "name": "47c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "c3add993354d431c8f96405755a8099c", "ext": ".jpg", "mime": "image/jpeg", "size": 21.15, "url": "/uploads/c3add993354d431c8f96405755a8099c.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T12:49:00.524Z", "updated_at": "2020-03-18T12:49:00.524Z" }, { "id": 346, "name": "47d.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "b0cefaa6a3d24a82a5e4cb2c1c4bb134", "ext": ".jpg", "mime": "image/jpeg", "size": 66.49, "url": "/uploads/b0cefaa6a3d24a82a5e4cb2c1c4bb134.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T12:49:00.535Z", "updated_at": "2020-03-18T12:49:00.535Z" }], "thumbnail": { "id": 342, "name": "10.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "72190536af1245b48cac7925c4318e37", "ext": ".jpg", "mime": "image/jpeg", "size": 6.38, "url": "/uploads/72190536af1245b48cac7925c4318e37.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T12:49:00.488Z", "updated_at": "2020-03-18T12:49:00.488Z" } }, { "id": 47, "title": "Korea Small Wood 4 Boxes Storage", "is_featured": false, "is_hot": false, "price": 64, "sale_price": null, "vendor": "Global Office", "review": 4, "is_out_of_stock": false, "depot": 70, "inventory": 90, "is_active": true, "is_sale": false, "created_at": "2020-03-15T12:54:01.621Z", "updated_at": "2020-03-15T12:54:01.621Z", "variants": [], "images": [{ "id": 181, "name": "48a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "58cb2976791443a496b80e3cd5d55a4e", "ext": ".jpg", "mime": "image/jpeg", "size": 78.37, "url": "/uploads/58cb2976791443a496b80e3cd5d55a4e.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T12:54:01.663Z", "updated_at": "2020-03-15T12:54:01.663Z" }, { "id": 182, "name": "48b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "89cc985082fa4ca7b8cb455f13e7c3eb", "ext": ".jpg", "mime": "image/jpeg", "size": 23.31, "url": "/uploads/89cc985082fa4ca7b8cb455f13e7c3eb.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T12:54:01.676Z", "updated_at": "2020-03-15T12:54:01.676Z" }, { "id": 183, "name": "48c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "b51695a23f704bb0bc62a97e154efba5", "ext": ".jpg", "mime": "image/jpeg", "size": 23.12, "url": "/uploads/b51695a23f704bb0bc62a97e154efba5.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T12:54:01.686Z", "updated_at": "2020-03-15T12:54:01.686Z" }, { "id": 184, "name": "48d.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "05982ca9a3a64d6391366bc6103884e6", "ext": ".jpg", "mime": "image/jpeg", "size": 22.18, "url": "/uploads/05982ca9a3a64d6391366bc6103884e6.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T12:54:01.696Z", "updated_at": "2020-03-15T12:54:01.696Z" }], "thumbnail": { "id": 180, "name": "9.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "664f3ea44e7f44b5bb726d0a78a6eaec", "ext": ".jpg", "mime": "image/jpeg", "size": 8.13, "url": "/uploads/664f3ea44e7f44b5bb726d0a78a6eaec.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T12:54:01.652Z", "updated_at": "2020-03-15T12:54:01.652Z" } }, { "id": 49, "title": "Claure Austin Lover Round Chair White Wooden", "is_featured": false, "is_hot": false, "price": 99.59, "sale_price": null, "vendor": "Global Office", "review": 5, "is_out_of_stock": false, "depot": 70, "inventory": 80, "is_active": true, "is_sale": false, "created_at": "2020-03-15T12:57:21.759Z", "updated_at": "2020-03-15T12:57:21.759Z", "variants": [], "images": [{ "id": 191, "name": "50a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "f8bb5ccd1eb5459e9fc33d2f45b74e60", "ext": ".jpg", "mime": "image/jpeg", "size": 33.03, "url": "/uploads/f8bb5ccd1eb5459e9fc33d2f45b74e60.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T12:57:21.788Z", "updated_at": "2020-03-15T12:57:21.788Z" }, { "id": 192, "name": "50b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "82c418256f2e4264a3e9aed0c9264335", "ext": ".jpg", "mime": "image/jpeg", "size": 10.77, "url": "/uploads/82c418256f2e4264a3e9aed0c9264335.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T12:57:21.796Z", "updated_at": "2020-03-15T12:57:21.796Z" }, { "id": 193, "name": "50c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "65550a2a55ce4f9ea2d4599c9cffd43a", "ext": ".jpg", "mime": "image/jpeg", "size": 12.36, "url": "/uploads/65550a2a55ce4f9ea2d4599c9cffd43a.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T12:57:21.805Z", "updated_at": "2020-03-15T12:57:21.805Z" }, { "id": 194, "name": "50d.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "a18fd4de58f34496abb40f38d3dacdf9", "ext": ".jpg", "mime": "image/jpeg", "size": 11.28, "url": "/uploads/a18fd4de58f34496abb40f38d3dacdf9.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T12:57:21.812Z", "updated_at": "2020-03-15T12:57:21.812Z" }], "thumbnail": { "id": 190, "name": "1.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "d36aa60d7915475abcbb346de7274cac", "ext": ".jpg", "mime": "image/jpeg", "size": 5.79, "url": "/uploads/d36aa60d7915475abcbb346de7274cac.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T12:57:21.777Z", "updated_at": "2020-03-15T12:57:21.777Z" } }, { "id": 50, "title": "Letter Printed Cushion Cover Cotton Throw Pillow", "is_featured": false, "is_hot": false, "price": 13.59, "sale_price": null, "vendor": "Global Office", "review": 4, "is_out_of_stock": false, "depot": 70, "inventory": 80, "is_active": true, "is_sale": false, "created_at": "2020-03-15T12:59:25.253Z", "updated_at": "2020-03-15T12:59:25.253Z", "variants": [], "images": [{ "id": 196, "name": "4.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "5a21858f28fe470bab05f9e839eedbdf", "ext": ".jpg", "mime": "image/jpeg", "size": 11.61, "url": "/uploads/5a21858f28fe470bab05f9e839eedbdf.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T12:59:25.285Z", "updated_at": "2020-03-15T12:59:25.285Z" }], "thumbnail": { "id": 195, "name": "4.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "e446cc5b6ed3433f9ef5aa3c1373bf18", "ext": ".jpg", "mime": "image/jpeg", "size": 11.61, "url": "/uploads/e446cc5b6ed3433f9ef5aa3c1373bf18.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T12:59:25.275Z", "updated_at": "2020-03-15T12:59:25.275Z" } }, { "id": 51, "title": "Simple Short TV Board Combine Book Shelf", "is_featured": false, "is_hot": false, "price": 13.59, "sale_price": null, "vendor": "Global Office", "review": 5, "is_out_of_stock": false, "depot": 50, "inventory": 60, "is_active": true, "is_sale": false, "created_at": "2020-03-15T13:00:41.375Z", "updated_at": "2020-03-15T13:00:41.375Z", "variants": [], "images": [{ "id": 198, "name": "5.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "a1a08a0b292846089662206d92c858bf", "ext": ".jpg", "mime": "image/jpeg", "size": 5.07, "url": "/uploads/a1a08a0b292846089662206d92c858bf.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T13:01:18.571Z", "updated_at": "2020-03-15T13:01:18.571Z" }], "thumbnail": { "id": 197, "name": "5.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "2af891b3cc034320b2ef6b792542cba4", "ext": ".jpg", "mime": "image/jpeg", "size": 5.07, "url": "/uploads/2af891b3cc034320b2ef6b792542cba4.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T13:01:18.560Z", "updated_at": "2020-03-15T13:01:18.560Z" } }, { "id": 52, "title": "Simple Tea Teable With Glass Surface", "is_featured": false, "is_hot": false, "price": 249.59, "sale_price": null, "vendor": "Global Office", "review": 5, "is_out_of_stock": false, "depot": 70, "inventory": 80, "is_active": true, "is_sale": false, "created_at": "2020-03-15T13:28:05.503Z", "updated_at": "2020-03-15T13:28:05.503Z", "variants": [], "images": [{ "id": 200, "name": "53a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "4ad7f87094984babac0a22a9f8447eb2", "ext": ".jpg", "mime": "image/jpeg", "size": 24.93, "url": "/uploads/4ad7f87094984babac0a22a9f8447eb2.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T13:28:05.541Z", "updated_at": "2020-03-15T13:28:05.541Z" }, { "id": 201, "name": "53b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "8929c017e8324986911ae5b70798728e", "ext": ".jpg", "mime": "image/jpeg", "size": 16.98, "url": "/uploads/8929c017e8324986911ae5b70798728e.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T13:28:05.551Z", "updated_at": "2020-03-15T13:28:05.551Z" }, { "id": 202, "name": "53c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "500e7a2bbf424d6ab4c3b7ec70af33e5", "ext": ".jpg", "mime": "image/jpeg", "size": 25.08, "url": "/uploads/500e7a2bbf424d6ab4c3b7ec70af33e5.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T13:28:05.559Z", "updated_at": "2020-03-15T13:28:05.559Z" }], "thumbnail": { "id": 199, "name": "6.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "98b96e736fa744a5ab7ed83354d97536", "ext": ".jpg", "mime": "image/jpeg", "size": 3.93, "url": "/uploads/98b96e736fa744a5ab7ed83354d97536.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T13:28:05.531Z", "updated_at": "2020-03-15T13:28:05.531Z" } }] }, { "id": 8, "name": "Gucci", "description": null, "slug": "gucci", "created_at": "2020-03-14T10:32:29.669Z", "updated_at": "2020-03-14T10:32:29.669Z", "products": [{ "id": 4, "title": "Herschel Leather Duffle Bag In Brown Color", "is_featured": false, "is_hot": false, "price": 125.3, "sale_price": null, "vendor": "Go Pro", "review": 4, "is_out_of_stock": false, "depot": 50, "inventory": 70, "is_active": true, "is_sale": false, "created_at": "2020-03-15T05:58:54.229Z", "updated_at": "2020-03-15T05:58:54.229Z", "variants": [], "images": [{ "id": 14, "name": "4a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "ff63a2eb476e45b1bfef05ee79115018", "ext": ".jpg", "mime": "image/jpeg", "size": 74.96, "url": "/uploads/ff63a2eb476e45b1bfef05ee79115018.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T05:58:54.276Z", "updated_at": "2020-03-15T05:58:54.276Z" }, { "id": 15, "name": "4b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "9b7e71c6299c456baceb165ec185687d", "ext": ".jpg", "mime": "image/jpeg", "size": 76.68, "url": "/uploads/9b7e71c6299c456baceb165ec185687d.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T05:58:54.287Z", "updated_at": "2020-03-15T05:58:54.287Z" }, { "id": 16, "name": "4c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "11591497e4ac4779981252032c8b0381", "ext": ".jpg", "mime": "image/jpeg", "size": 92.28, "url": "/uploads/11591497e4ac4779981252032c8b0381.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T05:58:54.300Z", "updated_at": "2020-03-15T05:58:54.300Z" }, { "id": 17, "name": "4d.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "bbc7b7c8745140e19653bc109965f9f4", "ext": ".jpg", "mime": "image/jpeg", "size": 26.43, "url": "/uploads/bbc7b7c8745140e19653bc109965f9f4.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T05:58:54.311Z", "updated_at": "2020-03-15T05:58:54.311Z" }], "thumbnail": { "id": 13, "name": "4a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "b5deb586612e4c808272da9913b8109b", "ext": ".jpg", "mime": "image/jpeg", "size": 74.96, "url": "/uploads/b5deb586612e4c808272da9913b8109b.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T05:58:54.262Z", "updated_at": "2020-03-15T05:58:54.262Z" } }, { "id": 10, "title": "Rayban Rounded Sunglass Brown Color", "is_featured": false, "is_hot": false, "price": 35.89, "sale_price": null, "vendor": "Young shop", "review": 5, "is_out_of_stock": false, "depot": 50, "inventory": 60, "is_active": true, "is_sale": false, "created_at": "2020-03-15T06:20:39.867Z", "updated_at": "2020-03-15T06:20:39.867Z", "variants": [], "images": [{ "id": 42, "name": "10a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "0208616a8daa44cbb20f12eaebf8de53", "ext": ".jpg", "mime": "image/jpeg", "size": 21.67, "url": "/uploads/0208616a8daa44cbb20f12eaebf8de53.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:20:39.908Z", "updated_at": "2020-03-15T06:20:39.908Z" }, { "id": 43, "name": "10b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "cba8c25fcf0d41d1aac41f05d8f7ad8e", "ext": ".jpg", "mime": "image/jpeg", "size": 20.16, "url": "/uploads/cba8c25fcf0d41d1aac41f05d8f7ad8e.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:20:39.925Z", "updated_at": "2020-03-15T06:20:39.925Z" }, { "id": 44, "name": "10c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "f8f22b0f8be04b559439dd7e7a4b9631", "ext": ".jpg", "mime": "image/jpeg", "size": 14.77, "url": "/uploads/f8f22b0f8be04b559439dd7e7a4b9631.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:20:39.935Z", "updated_at": "2020-03-15T06:20:39.935Z" }], "thumbnail": { "id": 41, "name": "9.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "0f04c128bb2945608bed459cdff45b2d", "ext": ".jpg", "mime": "image/jpeg", "size": 4.7, "url": "/uploads/0f04c128bb2945608bed459cdff45b2d.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:20:39.893Z", "updated_at": "2020-03-15T06:20:39.893Z" } }, { "id": 13, "title": "Paul 10.2 Inch", "is_featured": false, "is_hot": false, "price": 332.38, "sale_price": null, "vendor": "Young Shop", "review": 4, "is_out_of_stock": false, "depot": 60, "inventory": 80, "is_active": true, "is_sale": false, "created_at": "2020-03-15T06:40:02.790Z", "updated_at": "2020-03-15T06:40:02.790Z", "variants": [], "images": [{ "id": 70, "name": "16a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "4ef330f9bd3a4bb1ba9c2b23f70772df", "ext": ".jpg", "mime": "image/jpeg", "size": 29.52, "url": "/uploads/4ef330f9bd3a4bb1ba9c2b23f70772df.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:40:02.823Z", "updated_at": "2020-03-15T06:40:02.823Z" }, { "id": 71, "name": "16b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "1eff5ff12c48444dac8ba28ac12c0790", "ext": ".jpg", "mime": "image/jpeg", "size": 14.26, "url": "/uploads/1eff5ff12c48444dac8ba28ac12c0790.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:40:02.833Z", "updated_at": "2020-03-15T06:40:02.833Z" }, { "id": 72, "name": "16c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "a25ae077a45444528b12b13c7c7c2b1e", "ext": ".jpg", "mime": "image/jpeg", "size": 13.58, "url": "/uploads/a25ae077a45444528b12b13c7c7c2b1e.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:40:02.843Z", "updated_at": "2020-03-15T06:40:02.843Z" }, { "id": 73, "name": "16d.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "f71d017b2b3d46ebbacec60d7b63f9ff", "ext": ".jpg", "mime": "image/jpeg", "size": 14.61, "url": "/uploads/f71d017b2b3d46ebbacec60d7b63f9ff.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:40:02.852Z", "updated_at": "2020-03-15T06:40:02.852Z" }], "thumbnail": { "id": 69, "name": "15.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "6b2dca15a8f14f3f9b4f95cd6b3a6711", "ext": ".jpg", "mime": "image/jpeg", "size": 6, "url": "/uploads/6b2dca15a8f14f3f9b4f95cd6b3a6711.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:40:02.813Z", "updated_at": "2020-03-15T06:40:02.813Z" } }] }, { "id": 10, "name": "Samsung", "description": null, "slug": "samsung", "created_at": "2020-03-14T10:32:43.150Z", "updated_at": "2020-03-14T10:32:43.150Z", "products": [{ "id": 18, "title": "Samsung UHD TV 24inch", "is_featured": false, "is_hot": false, "price": 599, "sale_price": null, "vendor": "Robert's Store", "review": 4, "is_out_of_stock": false, "depot": 40, "inventory": 60, "is_active": true, "is_sale": false, "created_at": "2020-03-15T06:44:46.172Z", "updated_at": "2020-03-15T06:44:46.172Z", "variants": [], "images": [{ "id": 80, "name": "18a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "2fa613328d4e4ef69fb36a281057da25", "ext": ".jpg", "mime": "image/jpeg", "size": 72.3, "url": "/uploads/2fa613328d4e4ef69fb36a281057da25.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:44:46.202Z", "updated_at": "2020-03-15T06:44:46.202Z" }, { "id": 81, "name": "18b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "298c7187ba2e4459a4427149fc1c77c5", "ext": ".jpg", "mime": "image/jpeg", "size": 27.69, "url": "/uploads/298c7187ba2e4459a4427149fc1c77c5.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:44:46.211Z", "updated_at": "2020-03-15T06:44:46.211Z" }, { "id": 82, "name": "18c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "ecdd5aa1e85146e5b7fe7b07b7fb84f1", "ext": ".jpg", "mime": "image/jpeg", "size": 27.7, "url": "/uploads/ecdd5aa1e85146e5b7fe7b07b7fb84f1.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:44:46.219Z", "updated_at": "2020-03-15T06:44:46.219Z" }, { "id": 83, "name": "18d.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "bcd5916387a348d592994740de295881", "ext": ".jpg", "mime": "image/jpeg", "size": 4.42, "url": "/uploads/bcd5916387a348d592994740de295881.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:44:46.227Z", "updated_at": "2020-03-15T06:44:46.227Z" }], "thumbnail": { "id": 79, "name": "18.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "a48664eaed094c769046b4128dd341e4", "ext": ".jpg", "mime": "image/jpeg", "size": 11.29, "url": "/uploads/a48664eaed094c769046b4128dd341e4.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:44:46.192Z", "updated_at": "2020-03-15T06:44:46.192Z" } }, { "id": 31, "title": "Samsung Gear VR Virtual Reality Headset", "is_featured": false, "is_hot": false, "price": 320, "sale_price": null, "vendor": "Global Office", "review": 1, "is_out_of_stock": false, "depot": 70, "inventory": 80, "is_active": true, "is_sale": false, "created_at": "2020-03-15T09:05:44.603Z", "updated_at": "2020-03-15T09:05:44.603Z", "variants": [], "images": [{ "id": 139, "name": "32a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "30b225eb781448bb96b4eb0e585de1ba", "ext": ".jpg", "mime": "image/jpeg", "size": 33.87, "url": "/uploads/30b225eb781448bb96b4eb0e585de1ba.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T09:05:44.630Z", "updated_at": "2020-03-15T09:05:44.630Z" }, { "id": 140, "name": "32b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "d74002e783b441c4ae0bfd35b16a56fc", "ext": ".jpg", "mime": "image/jpeg", "size": 12.9, "url": "/uploads/d74002e783b441c4ae0bfd35b16a56fc.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T09:05:44.637Z", "updated_at": "2020-03-15T09:05:44.637Z" }, { "id": 141, "name": "32c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "f3f8a64c9ebd4035aa753650a4ed48d0", "ext": ".jpg", "mime": "image/jpeg", "size": 14.25, "url": "/uploads/f3f8a64c9ebd4035aa753650a4ed48d0.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T09:05:44.650Z", "updated_at": "2020-03-15T09:05:44.650Z" }, { "id": 142, "name": "32d.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "99e3308b7d1a4bbf814ce67329001c39", "ext": ".jpg", "mime": "image/jpeg", "size": 11.95, "url": "/uploads/99e3308b7d1a4bbf814ce67329001c39.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T09:05:44.658Z", "updated_at": "2020-03-15T09:05:44.658Z" }], "thumbnail": { "id": 138, "name": "4.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "27c756b633404bf6bc734557a90e3baa", "ext": ".jpg", "mime": "image/jpeg", "size": 6.52, "url": "/uploads/27c756b633404bf6bc734557a90e3baa.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T09:05:44.620Z", "updated_at": "2020-03-15T09:05:44.620Z" } }, { "id": 38, "title": "TCL 47-inch 4K Ultra HD Smart TV", "is_featured": false, "is_hot": false, "price": 670, "sale_price": 567.99, "vendor": "Go Pro", "review": 4, "is_out_of_stock": false, "depot": 70, "inventory": 80, "is_active": true, "is_sale": true, "created_at": "2020-03-15T09:43:05.580Z", "updated_at": "2020-03-18T12:58:10.870Z", "variants": [], "images": [{ "id": 158, "name": "12.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "5e0bff934b5d4a958af9122a1ee91d41", "ext": ".jpg", "mime": "image/jpeg", "size": 8.62, "url": "/uploads/5e0bff934b5d4a958af9122a1ee91d41.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T09:43:05.611Z", "updated_at": "2020-03-15T09:43:05.611Z" }], "thumbnail": { "id": 157, "name": "12.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "4e95e8c4956941099aa132a86b0086db", "ext": ".jpg", "mime": "image/jpeg", "size": 8.62, "url": "/uploads/4e95e8c4956941099aa132a86b0086db.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T09:43:05.600Z", "updated_at": "2020-03-15T09:43:05.600Z" } }, { "id": 41, "title": "Panasonic Invertr 900L Refrigerator", "is_featured": false, "is_hot": false, "price": 720, "sale_price": null, "vendor": "Global Office", "review": 4, "is_out_of_stock": false, "depot": 70, "inventory": 80, "is_active": true, "is_sale": false, "created_at": "2020-03-15T09:47:24.554Z", "updated_at": "2020-03-15T09:47:24.554Z", "variants": [], "images": [{ "id": 341, "name": "15.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "9778f73b10ad4a939769a79c0a877c43", "ext": ".jpg", "mime": "image/jpeg", "size": 4.09, "url": "/uploads/9778f73b10ad4a939769a79c0a877c43.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T12:47:55.740Z", "updated_at": "2020-03-18T12:47:55.740Z" }], "thumbnail": { "id": 340, "name": "15.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "a3381403e8474758922ee65bbf2eea22", "ext": ".jpg", "mime": "image/jpeg", "size": 4.09, "url": "/uploads/a3381403e8474758922ee65bbf2eea22.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T12:47:55.731Z", "updated_at": "2020-03-18T12:47:55.731Z" } }, { "id": 63, "title": "Samsung Gallaxy A8 8GB Ram Sliver Version", "is_featured": false, "is_hot": false, "price": 592, "sale_price": 642.99, "vendor": "Global Office", "review": 4, "is_out_of_stock": false, "depot": 70, "inventory": 80, "is_active": true, "is_sale": true, "created_at": "2020-03-18T05:33:26.161Z", "updated_at": "2020-03-18T05:33:26.161Z", "variants": [], "images": [{ "id": 249, "name": "65a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "0a3c28219fc74e499f3256ad77d94a55", "ext": ".jpg", "mime": "image/jpeg", "size": 59.99, "url": "/uploads/0a3c28219fc74e499f3256ad77d94a55.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T05:33:26.190Z", "updated_at": "2020-03-18T05:33:26.190Z" }, { "id": 250, "name": "65b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "30bd54763a8a4867bd1d5c3d786e26b5", "ext": ".jpg", "mime": "image/jpeg", "size": 17.47, "url": "/uploads/30bd54763a8a4867bd1d5c3d786e26b5.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T05:33:26.198Z", "updated_at": "2020-03-18T05:33:26.198Z" }, { "id": 251, "name": "65c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "4a17b2711b3b422694466bc5492ab828", "ext": ".jpg", "mime": "image/jpeg", "size": 13.59, "url": "/uploads/4a17b2711b3b422694466bc5492ab828.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T05:33:26.210Z", "updated_at": "2020-03-18T05:33:26.210Z" }, { "id": 252, "name": "65d.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "48971dad13ae4a4aa765ba6ae56951fa", "ext": ".jpg", "mime": "image/jpeg", "size": 27.08, "url": "/uploads/48971dad13ae4a4aa765ba6ae56951fa.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T05:33:26.217Z", "updated_at": "2020-03-18T05:33:26.217Z" }], "thumbnail": { "id": 248, "name": "7.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "86c8fe9d6d6648e99a6015727d421e27", "ext": ".jpg", "mime": "image/jpeg", "size": 11.72, "url": "/uploads/86c8fe9d6d6648e99a6015727d421e27.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T05:33:26.180Z", "updated_at": "2020-03-18T05:33:26.180Z" } }, { "id": 65, "title": "Yuntab K107 10.1 Inch Quad Core CPU MT6580", "is_featured": false, "is_hot": false, "price": 99.99, "sale_price": null, "vendor": "Global Office", "review": 4, "is_out_of_stock": false, "depot": 50, "inventory": 60, "is_active": true, "is_sale": false, "created_at": "2020-03-18T05:35:13.796Z", "updated_at": "2020-03-18T05:35:13.796Z", "variants": [], "images": [{ "id": 254, "name": "66a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "bc0584820ba146688921e5df66ef0aa1", "ext": ".jpg", "mime": "image/jpeg", "size": 79.12, "url": "/uploads/bc0584820ba146688921e5df66ef0aa1.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T05:35:13.827Z", "updated_at": "2020-03-18T05:35:13.827Z" }, { "id": 255, "name": "66b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "1838261f7afd46149a41e7b322955b7f", "ext": ".jpg", "mime": "image/jpeg", "size": 19.05, "url": "/uploads/1838261f7afd46149a41e7b322955b7f.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T05:35:13.835Z", "updated_at": "2020-03-18T05:35:13.835Z" }, { "id": 256, "name": "66c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "62ed690a4d744c6fa2a0d62c02159252", "ext": ".jpg", "mime": "image/jpeg", "size": 15.88, "url": "/uploads/62ed690a4d744c6fa2a0d62c02159252.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T05:35:13.843Z", "updated_at": "2020-03-18T05:35:13.843Z" }, { "id": 257, "name": "66d.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "ce7ad3a37f3f4acaadf8e5c9cf996792", "ext": ".jpg", "mime": "image/jpeg", "size": 6.33, "url": "/uploads/ce7ad3a37f3f4acaadf8e5c9cf996792.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T05:35:13.851Z", "updated_at": "2020-03-18T05:35:13.851Z" }], "thumbnail": { "id": 253, "name": "7.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "7df00b4c32074b9c85b464f3dbbbab2e", "ext": ".jpg", "mime": "image/jpeg", "size": 11.72, "url": "/uploads/7df00b4c32074b9c85b464f3dbbbab2e.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T05:35:13.815Z", "updated_at": "2020-03-18T05:35:13.815Z" } }, { "id": 68, "title": "iQOS 2.4 Plus Kit, Holder & Chargers Double Skull Exhaust System", "is_featured": false, "is_hot": true, "price": 1055.99, "sale_price": null, "vendor": "Global Office", "review": 4, "is_out_of_stock": false, "depot": 50, "inventory": 60, "is_active": true, "is_sale": false, "created_at": "2020-03-15T09:40:52.204Z", "updated_at": "2020-03-15T09:40:52.204Z", "variants": [], "images": [{ "id": 154, "name": "38a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "6e511bd80804431aadd15aeb29172d2d", "ext": ".jpg", "mime": "image/jpeg", "size": 30.42, "url": "/uploads/6e511bd80804431aadd15aeb29172d2d.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T09:40:52.241Z", "updated_at": "2020-03-15T09:40:52.241Z" }, { "id": 155, "name": "38b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "366848b6e7a343b5bc6dcc2f11672c8b", "ext": ".jpg", "mime": "image/jpeg", "size": 5.49, "url": "/uploads/366848b6e7a343b5bc6dcc2f11672c8b.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T09:40:52.252Z", "updated_at": "2020-03-15T09:40:52.252Z" }, { "id": 156, "name": "38c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "452ecfaa1e3c40d8ad417efe80a297e8", "ext": ".jpg", "mime": "image/jpeg", "size": 19.58, "url": "/uploads/452ecfaa1e3c40d8ad417efe80a297e8.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T09:40:52.263Z", "updated_at": "2020-03-15T09:40:52.263Z" }], "thumbnail": { "id": 153, "name": "6.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "1ebf2224f4724391a3a75a5f4dce4599", "ext": ".jpg", "mime": "image/jpeg", "size": 4.45, "url": "/uploads/1ebf2224f4724391a3a75a5f4dce4599.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T09:40:52.229Z", "updated_at": "2020-03-15T09:40:52.229Z" } }] }, { "id": 13, "name": "Gopro", "description": null, "slug": "gopro", "created_at": "2020-03-14T10:33:06.789Z", "updated_at": "2020-03-14T10:33:06.789Z", "products": [{ "id": 24, "title": "DJI Phantom 4 Quadcopter Camera", "is_featured": false, "is_hot": false, "price": 1207.15, "sale_price": 945.9, "vendor": "Go Pro", "review": 5, "is_out_of_stock": false, "depot": 65, "inventory": 70, "is_active": true, "is_sale": true, "created_at": "2020-03-15T07:06:17.229Z", "updated_at": "2020-03-15T07:06:17.229Z", "variants": [], "images": [{ "id": 108, "name": "25a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "c7f00eff80d744a3b4fbc96918deabb1", "ext": ".jpg", "mime": "image/jpeg", "size": 20.23, "url": "/uploads/c7f00eff80d744a3b4fbc96918deabb1.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T07:06:17.280Z", "updated_at": "2020-03-15T07:06:17.280Z" }, { "id": 109, "name": "25b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "6215cedde8354803817b8d0b46446865", "ext": ".jpg", "mime": "image/jpeg", "size": 7.75, "url": "/uploads/6215cedde8354803817b8d0b46446865.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T07:06:17.295Z", "updated_at": "2020-03-15T07:06:17.295Z" }, { "id": 110, "name": "25c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "8b54c00b8f244b87b9179e402a7639b2", "ext": ".jpg", "mime": "image/jpeg", "size": 6.46, "url": "/uploads/8b54c00b8f244b87b9179e402a7639b2.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T07:06:17.303Z", "updated_at": "2020-03-15T07:06:17.303Z" }, { "id": 111, "name": "25d.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "de6cc09f104f456b89c255b450655089", "ext": ".jpg", "mime": "image/jpeg", "size": 16.18, "url": "/uploads/de6cc09f104f456b89c255b450655089.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T07:06:17.310Z", "updated_at": "2020-03-15T07:06:17.310Z" }], "thumbnail": { "id": 107, "name": "23.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "f5e300388365470aae6f894f4f0f5c61", "ext": ".jpg", "mime": "image/jpeg", "size": 3.74, "url": "/uploads/f5e300388365470aae6f894f4f0f5c61.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T07:06:17.262Z", "updated_at": "2020-03-15T07:06:17.262Z" } }, { "id": 42, "title": "Gopro Hero 4 Sliver Wireless, 4k HD", "is_featured": false, "is_hot": false, "price": 510, "sale_price": 500.99, "vendor": "Go Pro", "review": 4, "is_out_of_stock": false, "depot": 70, "inventory": 80, "is_active": true, "is_sale": true, "created_at": "2020-03-15T09:49:14.357Z", "updated_at": "2020-03-15T09:49:14.357Z", "variants": [], "images": [{ "id": 164, "name": "18.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "c81b5f934b8842a19f80eb94b66dbacf", "ext": ".jpg", "mime": "image/jpeg", "size": 6.09, "url": "/uploads/c81b5f934b8842a19f80eb94b66dbacf.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T09:49:14.387Z", "updated_at": "2020-03-15T09:49:14.387Z" }], "thumbnail": { "id": 163, "name": "18.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "3a99112514724b59a18c48fa6a3569d3", "ext": ".jpg", "mime": "image/jpeg", "size": 6.09, "url": "/uploads/3a99112514724b59a18c48fa6a3569d3.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T09:49:14.376Z", "updated_at": "2020-03-15T09:49:14.376Z" } }, { "id": 70, "title": "GoPro Karman 4 Channels Quadcopter Drone", "is_featured": false, "is_hot": false, "price": 392.99, "sale_price": null, "vendor": "Young Shop", "review": 4, "is_out_of_stock": false, "depot": 70, "inventory": 80, "is_active": true, "is_sale": false, "created_at": "2020-03-18T05:43:57.333Z", "updated_at": "2020-03-18T05:43:57.333Z", "variants": [], "images": [{ "id": 278, "name": "71a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "997bc2778e25492fbd09c582bc98ad3b", "ext": ".jpg", "mime": "image/jpeg", "size": 33.13, "url": "/uploads/997bc2778e25492fbd09c582bc98ad3b.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T05:43:57.405Z", "updated_at": "2020-03-18T05:43:57.405Z" }, { "id": 279, "name": "71b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "a3da535f76ac43f5bd8fd82201144603", "ext": ".jpg", "mime": "image/jpeg", "size": 29.45, "url": "/uploads/a3da535f76ac43f5bd8fd82201144603.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T05:43:57.415Z", "updated_at": "2020-03-18T05:43:57.415Z" }, { "id": 280, "name": "71c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "1dc6a4b3b1434677be924e53e98297b2", "ext": ".jpg", "mime": "image/jpeg", "size": 19.21, "url": "/uploads/1dc6a4b3b1434677be924e53e98297b2.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T05:43:57.433Z", "updated_at": "2020-03-18T05:43:57.433Z" }, { "id": 281, "name": "71d.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "95d0cf75458a480ebc6c684af5dfd38c", "ext": ".jpg", "mime": "image/jpeg", "size": 74.06, "url": "/uploads/95d0cf75458a480ebc6c684af5dfd38c.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T05:43:57.444Z", "updated_at": "2020-03-18T05:43:57.444Z" }], "thumbnail": { "id": 277, "name": "16.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "72b77e04493342ab803b4f6bbc346072", "ext": ".jpg", "mime": "image/jpeg", "size": 5.24, "url": "/uploads/72b77e04493342ab803b4f6bbc346072.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T05:43:57.386Z", "updated_at": "2020-03-18T05:43:57.386Z" } }, { "id": 72, "title": "HP Chromebook CB 10014 Desktop", "is_featured": false, "is_hot": false, "price": 820.99, "sale_price": null, "vendor": "Global Office", "review": 4, "is_out_of_stock": false, "depot": 60, "inventory": 70, "is_active": true, "is_sale": false, "created_at": "2020-03-18T05:49:55.032Z", "updated_at": "2020-03-18T05:49:55.032Z", "variants": [], "images": [{ "id": 287, "name": "73a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "a71fa14e97ef4317ae248c78247720cf", "ext": ".jpg", "mime": "image/jpeg", "size": 25.14, "url": "/uploads/a71fa14e97ef4317ae248c78247720cf.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T05:49:55.087Z", "updated_at": "2020-03-18T05:49:55.087Z" }, { "id": 288, "name": "73b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "280d9fae269246568406ef5aac860795", "ext": ".jpg", "mime": "image/jpeg", "size": 27.11, "url": "/uploads/280d9fae269246568406ef5aac860795.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T05:49:55.099Z", "updated_at": "2020-03-18T05:49:55.099Z" }, { "id": 289, "name": "73c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "33a5e8a71e7841519f62ac215b3a3a50", "ext": ".jpg", "mime": "image/jpeg", "size": 7.13, "url": "/uploads/33a5e8a71e7841519f62ac215b3a3a50.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T05:49:55.119Z", "updated_at": "2020-03-18T05:49:55.119Z" }, { "id": 290, "name": "73d.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "ed02ef12245647ecbae125ad1d2c6049", "ext": ".jpg", "mime": "image/jpeg", "size": 6.4, "url": "/uploads/ed02ef12245647ecbae125ad1d2c6049.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T05:49:55.131Z", "updated_at": "2020-03-18T05:49:55.131Z" }], "thumbnail": { "id": 286, "name": "18.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "f73d332d3a074a44af99b073c922b24f", "ext": ".jpg", "mime": "image/jpeg", "size": 4.11, "url": "/uploads/f73d332d3a074a44af99b073c922b24f.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T05:49:55.070Z", "updated_at": "2020-03-18T05:49:55.070Z" } }] }, { "id": 14, "name": "Unilever", "description": null, "slug": "unilever", "created_at": "2020-03-14T10:33:14.118Z", "updated_at": "2020-03-14T10:33:14.118Z", "products": [{ "id": 56, "title": "Anna Sui Putty Mask Perfection", "is_featured": false, "is_hot": false, "price": 25, "sale_price": null, "vendor": "Global Office", "review": 5, "is_out_of_stock": false, "depot": 70, "inventory": 80, "is_active": true, "is_sale": false, "created_at": "2020-03-15T13:37:05.467Z", "updated_at": "2020-03-15T13:37:05.467Z", "variants": [], "images": [{ "id": 218, "name": "57a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "56986b9145c7497dbd31243e9cb48f87", "ext": ".jpg", "mime": "image/jpeg", "size": 53.69, "url": "/uploads/56986b9145c7497dbd31243e9cb48f87.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T13:37:05.508Z", "updated_at": "2020-03-15T13:37:05.508Z" }, { "id": 219, "name": "57b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "6ba127ca71074b539221a949ef26e701", "ext": ".jpg", "mime": "image/jpeg", "size": 21.12, "url": "/uploads/6ba127ca71074b539221a949ef26e701.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T13:37:05.520Z", "updated_at": "2020-03-15T13:37:05.520Z" }, { "id": 220, "name": "57c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "c378fc8a90004701811b388ce195a957", "ext": ".jpg", "mime": "image/jpeg", "size": 54.25, "url": "/uploads/c378fc8a90004701811b388ce195a957.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T13:37:05.528Z", "updated_at": "2020-03-15T13:37:05.528Z" }, { "id": 221, "name": "57d.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "2324c56372fc46998df8ce9f8a9cd847", "ext": ".jpg", "mime": "image/jpeg", "size": 12.77, "url": "/uploads/2324c56372fc46998df8ce9f8a9cd847.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T13:37:05.537Z", "updated_at": "2020-03-15T13:37:05.537Z" }], "thumbnail": { "id": 217, "name": "4.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "9ccbc5e9220e4768921afcb101c10459", "ext": ".jpg", "mime": "image/jpeg", "size": 8.02, "url": "/uploads/9ccbc5e9220e4768921afcb101c10459.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T13:37:05.487Z", "updated_at": "2020-03-15T13:37:05.487Z" } }, { "id": 28, "title": "Set 14-Piece Knife From KichiKit", "is_featured": false, "is_hot": false, "price": 85, "sale_price": null, "vendor": "Global Office", "review": 3, "is_out_of_stock": true, "depot": 50, "inventory": 60, "is_active": true, "is_sale": false, "created_at": "2020-03-15T07:28:12.906Z", "updated_at": "2020-03-18T13:03:00.440Z", "variants": [], "images": [{ "id": 128, "name": "29a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "8570a56296b2470caa2b397e5bc9bf6d", "ext": ".jpg", "mime": "image/jpeg", "size": 42.03, "url": "/uploads/8570a56296b2470caa2b397e5bc9bf6d.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T07:28:12.949Z", "updated_at": "2020-03-15T07:28:12.949Z" }, { "id": 129, "name": "29b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "b271346821b54da68da7abc985db2400", "ext": ".jpg", "mime": "image/jpeg", "size": 16.61, "url": "/uploads/b271346821b54da68da7abc985db2400.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T07:28:12.958Z", "updated_at": "2020-03-15T07:28:12.958Z" }, { "id": 130, "name": "29c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "c5b77535a1754dcb9ccaead467a354e6", "ext": ".jpg", "mime": "image/jpeg", "size": 18.64, "url": "/uploads/c5b77535a1754dcb9ccaead467a354e6.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T07:28:12.965Z", "updated_at": "2020-03-15T07:28:12.965Z" }, { "id": 131, "name": "29d.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "d58dd5cc5f824bd5af8e729503867653", "ext": ".jpg", "mime": "image/jpeg", "size": 17.77, "url": "/uploads/d58dd5cc5f824bd5af8e729503867653.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T07:28:12.977Z", "updated_at": "2020-03-15T07:28:12.977Z" }], "thumbnail": { "id": 127, "name": "5.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "e6965d2ab9ef4537ab17517394fe9ce4", "ext": ".jpg", "mime": "image/jpeg", "size": 8.32, "url": "/uploads/e6965d2ab9ef4537ab17517394fe9ce4.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T07:28:12.939Z", "updated_at": "2020-03-15T07:28:12.939Z" } }, { "id": 54, "title": "Aveeno Moisturizing Body Shower 450ml", "is_featured": false, "is_hot": false, "price": 59, "sale_price": 47.99, "vendor": "Young Shop", "review": 5, "is_out_of_stock": false, "depot": 70, "inventory": 80, "is_active": true, "is_sale": true, "created_at": "2020-03-15T13:33:17.935Z", "updated_at": "2020-03-15T13:33:17.935Z", "variants": [], "images": [{ "id": 208, "name": "55a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "383ed28ccd8c43b99de6d4de3031603d", "ext": ".jpg", "mime": "image/jpeg", "size": 49.14, "url": "/uploads/383ed28ccd8c43b99de6d4de3031603d.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T13:33:17.965Z", "updated_at": "2020-03-15T13:33:17.965Z" }, { "id": 209, "name": "55b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "be3321593fea4864addd3d73f35a8cee", "ext": ".jpg", "mime": "image/jpeg", "size": 11.5, "url": "/uploads/be3321593fea4864addd3d73f35a8cee.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T13:33:17.978Z", "updated_at": "2020-03-15T13:33:17.978Z" }, { "id": 210, "name": "55c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "9d091230599045ed97bcab3d7647127b", "ext": ".jpg", "mime": "image/jpeg", "size": 11.41, "url": "/uploads/9d091230599045ed97bcab3d7647127b.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T13:33:17.986Z", "updated_at": "2020-03-15T13:33:17.986Z" }, { "id": 211, "name": "55d.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "972459f675fd49c585e52fa5cc1d418e", "ext": ".jpg", "mime": "image/jpeg", "size": 13.43, "url": "/uploads/972459f675fd49c585e52fa5cc1d418e.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T13:33:18.001Z", "updated_at": "2020-03-15T13:33:18.001Z" }], "thumbnail": { "id": 207, "name": "1.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "0a029cb7870243c7b36c71922a55701a", "ext": ".jpg", "mime": "image/jpeg", "size": 5.38, "url": "/uploads/0a029cb7870243c7b36c71922a55701a.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T13:33:17.954Z", "updated_at": "2020-03-15T13:33:17.954Z" } }, { "id": 55, "title": "Baxter Care Hair Kit For Bearded Mens", "is_featured": false, "is_hot": false, "price": 60, "sale_price": 42, "vendor": "Young Shop", "review": 4, "is_out_of_stock": false, "depot": 70, "inventory": 80, "is_active": true, "is_sale": true, "created_at": "2020-03-15T13:35:28.855Z", "updated_at": "2020-03-15T13:35:28.855Z", "variants": [], "images": [{ "id": 213, "name": "56a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "1ca5fe0793e545669c16a8e7c7b68348", "ext": ".jpg", "mime": "image/jpeg", "size": 58.88, "url": "/uploads/1ca5fe0793e545669c16a8e7c7b68348.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T13:35:28.889Z", "updated_at": "2020-03-15T13:35:28.889Z" }, { "id": 214, "name": "56b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "2268da1843334f4c9e0757a16f0b8443", "ext": ".jpg", "mime": "image/jpeg", "size": 11.12, "url": "/uploads/2268da1843334f4c9e0757a16f0b8443.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T13:35:28.898Z", "updated_at": "2020-03-15T13:35:28.898Z" }, { "id": 215, "name": "56c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "d55cb74ae9d64a3a9d93ae4328b64475", "ext": ".jpg", "mime": "image/jpeg", "size": 13.79, "url": "/uploads/d55cb74ae9d64a3a9d93ae4328b64475.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T13:35:28.905Z", "updated_at": "2020-03-15T13:35:28.905Z" }, { "id": 216, "name": "56d.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "aa96424c1a8743929d92003f1f3b92cd", "ext": ".jpg", "mime": "image/jpeg", "size": 24.83, "url": "/uploads/aa96424c1a8743929d92003f1f3b92cd.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T13:35:28.913Z", "updated_at": "2020-03-15T13:35:28.913Z" }], "thumbnail": { "id": 212, "name": "3.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "ede2a4fddd3e439c87a0f471267b7838", "ext": ".jpg", "mime": "image/jpeg", "size": 10.03, "url": "/uploads/ede2a4fddd3e439c87a0f471267b7838.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T13:35:28.879Z", "updated_at": "2020-03-15T13:35:28.879Z" } }, { "id": 57, "title": "Set 30 Piece Korea StartSkin Natural Mask", "is_featured": false, "is_hot": false, "price": 85, "sale_price": null, "vendor": "Global Office", "review": 4, "is_out_of_stock": false, "depot": 70, "inventory": 80, "is_active": true, "is_sale": false, "created_at": "2020-03-15T14:26:12.340Z", "updated_at": "2020-03-15T14:26:12.340Z", "variants": [], "images": [{ "id": 223, "name": "58a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "cca7d31b5a85453ba4145a460f6c283b", "ext": ".jpg", "mime": "image/jpeg", "size": 32.51, "url": "/uploads/cca7d31b5a85453ba4145a460f6c283b.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T14:26:12.368Z", "updated_at": "2020-03-15T14:26:12.368Z" }, { "id": 224, "name": "58b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "5841d6e8f7104034935cd493547900ff", "ext": ".jpg", "mime": "image/jpeg", "size": 13.31, "url": "/uploads/5841d6e8f7104034935cd493547900ff.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T14:26:12.377Z", "updated_at": "2020-03-15T14:26:12.377Z" }, { "id": 225, "name": "58c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "537289a299f54d3b9ed8fc8763ee7b92", "ext": ".jpg", "mime": "image/jpeg", "size": 33.19, "url": "/uploads/537289a299f54d3b9ed8fc8763ee7b92.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T14:26:12.394Z", "updated_at": "2020-03-15T14:26:12.394Z" }], "thumbnail": { "id": 222, "name": "5.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "46e9f0df98c74d03b9089b73d5cb2a57", "ext": ".jpg", "mime": "image/jpeg", "size": 6.48, "url": "/uploads/46e9f0df98c74d03b9089b73d5cb2a57.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T14:26:12.359Z", "updated_at": "2020-03-15T14:26:12.359Z" } }, { "id": 58, "title": "Ciate Palemore Lipstick Bold Red Color", "is_featured": false, "is_hot": false, "price": 92, "sale_price": null, "vendor": "Global Store", "review": 5, "is_out_of_stock": false, "depot": 80, "inventory": 90, "is_active": true, "is_sale": false, "created_at": "2020-03-15T14:27:51.518Z", "updated_at": "2020-03-15T14:27:51.518Z", "variants": [], "images": [{ "id": 227, "name": "59a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "918f66e8a4be4029863149bd4c163dd6", "ext": ".jpg", "mime": "image/jpeg", "size": 68.14, "url": "/uploads/918f66e8a4be4029863149bd4c163dd6.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T14:27:51.550Z", "updated_at": "2020-03-15T14:27:51.550Z" }, { "id": 228, "name": "59b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "ed4f0cbafb9149138d06bfb72b458893", "ext": ".jpg", "mime": "image/jpeg", "size": 17.37, "url": "/uploads/ed4f0cbafb9149138d06bfb72b458893.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T14:27:51.564Z", "updated_at": "2020-03-15T14:27:51.564Z" }, { "id": 229, "name": "59c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "5ba79ea8093645c480eebe7b5083e483", "ext": ".jpg", "mime": "image/jpeg", "size": 48.51, "url": "/uploads/5ba79ea8093645c480eebe7b5083e483.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T14:27:51.572Z", "updated_at": "2020-03-15T14:27:51.572Z" }, { "id": 230, "name": "59d.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "9c1da7c5f0314c36ae1977c5b6caecab", "ext": ".jpg", "mime": "image/jpeg", "size": 16.61, "url": "/uploads/9c1da7c5f0314c36ae1977c5b6caecab.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T14:27:51.580Z", "updated_at": "2020-03-15T14:27:51.580Z" }], "thumbnail": { "id": 226, "name": "6.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "240695414ed64690878e38d7494d4592", "ext": ".jpg", "mime": "image/jpeg", "size": 7.04, "url": "/uploads/240695414ed64690878e38d7494d4592.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T14:27:51.539Z", "updated_at": "2020-03-15T14:27:51.539Z" } }] }, { "id": 15, "name": "fruits", "description": null, "slug": "fruits", "created_at": "2020-03-18T06:48:04.017Z", "updated_at": "2020-03-18T06:48:04.017Z", "products": [{ "id": 77, "title": "Locally Grown Strawberries, 1 Pint", "is_featured": false, "is_hot": false, "price": 26.95, "sale_price": null, "vendor": "Global Office", "review": 3, "is_out_of_stock": false, "depot": 50, "inventory": 60, "is_active": true, "is_sale": false, "created_at": "2020-03-18T06:46:38.548Z", "updated_at": "2020-03-18T06:46:38.548Z", "variants": [], "images": [{ "id": 311, "name": "78a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "48efb67ec1c743a39e370b43bbbd7c4f", "ext": ".jpg", "mime": "image/jpeg", "size": 583.8, "url": "/uploads/48efb67ec1c743a39e370b43bbbd7c4f.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T06:46:38.593Z", "updated_at": "2020-03-18T06:46:38.593Z" }, { "id": 312, "name": "78b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "39a87fcc433e4e8f95ef6a4f22926482", "ext": ".jpg", "mime": "image/jpeg", "size": 34.87, "url": "/uploads/39a87fcc433e4e8f95ef6a4f22926482.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T06:46:38.602Z", "updated_at": "2020-03-18T06:46:38.602Z" }], "thumbnail": { "id": 310, "name": "78a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "83d058602dee4b2d99ccef21300f8f35", "ext": ".jpg", "mime": "image/jpeg", "size": 583.8, "url": "/uploads/83d058602dee4b2d99ccef21300f8f35.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T06:46:38.580Z", "updated_at": "2020-03-18T06:46:38.580Z" } }, { "id": 78, "title": "Organic Oranges Valencia 1kg", "is_featured": false, "is_hot": false, "price": 25.99, "sale_price": null, "vendor": "Global Office", "review": 5, "is_out_of_stock": false, "depot": 50, "inventory": 60, "is_active": true, "is_sale": false, "created_at": "2020-03-18T06:49:57.368Z", "updated_at": "2020-03-18T06:49:57.368Z", "variants": [], "images": [{ "id": 314, "name": "79a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "8dc27d339178495793f41446e7e2f5be", "ext": ".jpg", "mime": "image/jpeg", "size": 305.41, "url": "/uploads/8dc27d339178495793f41446e7e2f5be.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T06:49:57.403Z", "updated_at": "2020-03-18T06:49:57.403Z" }], "thumbnail": { "id": 313, "name": "79a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "bbd8f6aa2a2849f3ba80d5c6f9337b51", "ext": ".jpg", "mime": "image/jpeg", "size": 305.41, "url": "/uploads/bbd8f6aa2a2849f3ba80d5c6f9337b51.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T06:49:57.391Z", "updated_at": "2020-03-18T06:49:57.391Z" } }, { "id": 79, "title": "Pineapple (Tropical Gold)", "is_featured": false, "is_hot": false, "price": 2.89, "sale_price": null, "vendor": "Global Office", "review": 4, "is_out_of_stock": false, "depot": 70, "inventory": 80, "is_active": true, "is_sale": false, "created_at": "2020-03-18T06:51:19.973Z", "updated_at": "2020-03-18T06:51:19.973Z", "variants": [], "images": [{ "id": 316, "name": "80a.jpeg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "baef1533117e4781890e15d0271a417a", "ext": ".jpeg", "mime": "image/jpeg", "size": 237.83, "url": "/uploads/baef1533117e4781890e15d0271a417a.jpeg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T06:51:20.007Z", "updated_at": "2020-03-18T06:51:20.007Z" }, { "id": 317, "name": "80b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "4acf953a04e04faf8a487c723d202eef", "ext": ".jpg", "mime": "image/jpeg", "size": 28.27, "url": "/uploads/4acf953a04e04faf8a487c723d202eef.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T06:51:20.023Z", "updated_at": "2020-03-18T06:51:20.023Z" }, { "id": 318, "name": "80c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "b62251ec55be493d987a32806f709d2d", "ext": ".jpg", "mime": "image/jpeg", "size": 41.26, "url": "/uploads/b62251ec55be493d987a32806f709d2d.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T06:51:20.033Z", "updated_at": "2020-03-18T06:51:20.033Z" }, { "id": 319, "name": "80d.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "e14ba895134e4f008f9cd5ed0df5a471", "ext": ".jpg", "mime": "image/jpeg", "size": 27.29, "url": "/uploads/e14ba895134e4f008f9cd5ed0df5a471.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T06:51:20.042Z", "updated_at": "2020-03-18T06:51:20.042Z" }], "thumbnail": { "id": 315, "name": "80a.jpeg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "72a1764a51f0415e8d7e8be260848e95", "ext": ".jpeg", "mime": "image/jpeg", "size": 237.83, "url": "/uploads/72a1764a51f0415e8d7e8be260848e95.jpeg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T06:51:19.995Z", "updated_at": "2020-03-18T06:51:19.995Z" } }, { "id": 81, "title": "MariGold 100% Juice Milk 350ml", "is_featured": false, "is_hot": false, "price": 3.95, "sale_price": null, "vendor": "Global Office", "review": 4, "is_out_of_stock": false, "depot": 60, "inventory": 70, "is_active": true, "is_sale": false, "created_at": "2020-03-18T06:56:10.273Z", "updated_at": "2020-03-18T06:56:10.273Z", "variants": [], "images": [{ "id": 323, "name": "82a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "9e488f0e25cf4501a4fe04838e708be9", "ext": ".jpg", "mime": "image/jpeg", "size": 98.07, "url": "/uploads/9e488f0e25cf4501a4fe04838e708be9.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T06:56:10.314Z", "updated_at": "2020-03-18T06:56:10.314Z" }], "thumbnail": { "id": 322, "name": "82a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "e10a8eeffbaa4bfab8898cb9342bb270", "ext": ".jpg", "mime": "image/jpeg", "size": 98.07, "url": "/uploads/e10a8eeffbaa4bfab8898cb9342bb270.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T06:56:10.292Z", "updated_at": "2020-03-18T06:56:10.292Z" } }, { "id": 82, "title": "HomeSoy Soya Milk Originall", "is_featured": false, "is_hot": false, "price": 9.85, "sale_price": null, "vendor": "Global Office", "review": 4, "is_out_of_stock": false, "depot": 60, "inventory": 70, "is_active": true, "is_sale": false, "created_at": "2020-03-18T06:57:16.979Z", "updated_at": "2020-03-18T06:57:16.979Z", "variants": [], "images": [{ "id": 325, "name": "83a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "f4fbe84e5b264982af03f806e044a621", "ext": ".jpg", "mime": "image/jpeg", "size": 107.59, "url": "/uploads/f4fbe84e5b264982af03f806e044a621.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T06:57:17.011Z", "updated_at": "2020-03-18T06:57:17.011Z" }], "thumbnail": { "id": 324, "name": "83a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "019276ce1e444623833b0c1808da707c", "ext": ".jpg", "mime": "image/jpeg", "size": 107.59, "url": "/uploads/019276ce1e444623833b0c1808da707c.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T06:57:17.002Z", "updated_at": "2020-03-18T06:57:17.002Z" } }, { "id": 83, "title": "Australia Banana 16 Pack 2.5 kg", "is_featured": false, "is_hot": false, "price": 12.85, "sale_price": null, "vendor": "Global Office", "review": 3, "is_out_of_stock": false, "depot": 60, "inventory": 70, "is_active": true, "is_sale": false, "created_at": "2020-03-18T06:58:34.168Z", "updated_at": "2020-03-18T06:58:34.168Z", "variants": [], "images": [{ "id": 327, "name": "84a.jpeg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "ffd65dab221a4146b8ddeb0bbf908573", "ext": ".jpeg", "mime": "image/jpeg", "size": 117.79, "url": "/uploads/ffd65dab221a4146b8ddeb0bbf908573.jpeg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T06:58:34.301Z", "updated_at": "2020-03-18T06:58:34.301Z" }], "thumbnail": { "id": 326, "name": "84a.jpeg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "3ea5019caa45409f8a9a770a02181fe2", "ext": ".jpeg", "mime": "image/jpeg", "size": 117.79, "url": "/uploads/3ea5019caa45409f8a9a770a02181fe2.jpeg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T06:58:34.289Z", "updated_at": "2020-03-18T06:58:34.289Z" } }, { "id": 84, "title": "Augason Farms Freeze Dried Beef Chunks", "is_featured": false, "is_hot": false, "price": 67.85, "sale_price": null, "vendor": "Global Office", "review": 5, "is_out_of_stock": false, "depot": 60, "inventory": 70, "is_active": true, "is_sale": false, "created_at": "2020-03-18T06:59:49.553Z", "updated_at": "2020-03-18T06:59:49.553Z", "variants": [], "images": [{ "id": 329, "name": "85a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "0e603357f01e40b3a3cd871a70ebe142", "ext": ".jpg", "mime": "image/jpeg", "size": 527.02, "url": "/uploads/0e603357f01e40b3a3cd871a70ebe142.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T06:59:49.615Z", "updated_at": "2020-03-18T06:59:49.615Z" }, { "id": 330, "name": "85b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "3c5cf1a734e4463a8332a0a0d908a0fe", "ext": ".jpg", "mime": "image/jpeg", "size": 43.85, "url": "/uploads/3c5cf1a734e4463a8332a0a0d908a0fe.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T06:59:49.628Z", "updated_at": "2020-03-18T06:59:49.628Z" }, { "id": 331, "name": "85c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "130a06e89e18489f997f89adb45df47c", "ext": ".jpg", "mime": "image/jpeg", "size": 61.59, "url": "/uploads/130a06e89e18489f997f89adb45df47c.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T06:59:49.638Z", "updated_at": "2020-03-18T06:59:49.638Z" }, { "id": 332, "name": "85d.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "956b710c05964593a93ea91052b7f7fe", "ext": ".jpg", "mime": "image/jpeg", "size": 63.88, "url": "/uploads/956b710c05964593a93ea91052b7f7fe.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T06:59:49.657Z", "updated_at": "2020-03-18T06:59:49.657Z" }], "thumbnail": { "id": 328, "name": "85a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "c57b47015b9a4c37a67b614f16202829", "ext": ".jpg", "mime": "image/jpeg", "size": 527.02, "url": "/uploads/c57b47015b9a4c37a67b614f16202829.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T06:59:49.590Z", "updated_at": "2020-03-18T06:59:49.590Z" } }, { "id": 85, "title": "Vita Coco Coconut Water (Pack of 12)", "is_featured": false, "is_hot": false, "price": 25.89, "sale_price": 20.08, "vendor": "Global Office", "review": 5, "is_out_of_stock": false, "depot": 60, "inventory": 70, "is_active": true, "is_sale": true, "created_at": "2020-03-18T07:01:10.046Z", "updated_at": "2020-03-18T07:01:10.046Z", "variants": [], "images": [{ "id": 334, "name": "86a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "3ca8ef0cc54d46ff87594b803cef3c43", "ext": ".jpg", "mime": "image/jpeg", "size": 227.87, "url": "/uploads/3ca8ef0cc54d46ff87594b803cef3c43.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T07:01:10.085Z", "updated_at": "2020-03-18T07:01:10.085Z" }, { "id": 335, "name": "86b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "6ed164482d6a4693a4e88c2c4ba3aead", "ext": ".jpg", "mime": "image/jpeg", "size": 23.17, "url": "/uploads/6ed164482d6a4693a4e88c2c4ba3aead.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T07:01:10.100Z", "updated_at": "2020-03-18T07:01:10.100Z" }, { "id": 336, "name": "86c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "9ca1dd76fe0f43d0aecf9fb2ca719c57", "ext": ".jpg", "mime": "image/jpeg", "size": 51.46, "url": "/uploads/9ca1dd76fe0f43d0aecf9fb2ca719c57.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T07:01:10.109Z", "updated_at": "2020-03-18T07:01:10.109Z" }, { "id": 337, "name": "86d.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "c56f54eb5103427680789de497ac94cb", "ext": ".jpg", "mime": "image/jpeg", "size": 12.31, "url": "/uploads/c56f54eb5103427680789de497ac94cb.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T07:01:10.117Z", "updated_at": "2020-03-18T07:01:10.117Z" }], "thumbnail": { "id": 333, "name": "86a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "39694a8b81124468a5de5e399483bf9e", "ext": ".jpg", "mime": "image/jpeg", "size": 227.87, "url": "/uploads/39694a8b81124468a5de5e399483bf9e.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T07:01:10.073Z", "updated_at": "2020-03-18T07:01:10.073Z" } }, { "id": 86, "title": "Vita Coco Coconut Water (Pack of 24)", "is_featured": false, "is_hot": false, "price": 19.22, "sale_price": 21.99, "vendor": "Young Shop", "review": 2, "is_out_of_stock": false, "depot": 100, "inventory": 200, "is_active": true, "is_sale": true, "created_at": "2020-04-18T08:42:13.577Z", "updated_at": "2020-04-18T08:42:13.577Z", "variants": [], "images": [{ "id": 350, "name": "86b", "alternativeText": null, "caption": null, "width": 600, "height": 600, "formats": { "thumbnail": { "hash": "thumbnail_86b_81b868f333", "ext": ".jpeg", "mime": "image/jpeg", "width": 156, "height": 156, "size": 2.53, "url": "/uploads/thumbnail_86b_81b868f333.jpeg" }, "small": { "hash": "small_86b_81b868f333", "ext": ".jpeg", "mime": "image/jpeg", "width": 500, "height": 500, "size": 15.08, "url": "/uploads/small_86b_81b868f333.jpeg" } }, "hash": "86b_81b868f333", "ext": ".jpeg", "mime": "image/jpeg", "size": 20.45, "url": "/uploads/86b_81b868f333.jpeg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-04-18T08:42:13.694Z", "updated_at": "2020-04-18T08:42:13.694Z" }, { "id": 351, "name": "86a", "alternativeText": null, "caption": null, "width": 800, "height": 800, "formats": { "thumbnail": { "hash": "thumbnail_86a_b29949194b", "ext": ".jpeg", "mime": "image/jpeg", "width": 156, "height": 156, "size": 3.61, "url": "/uploads/thumbnail_86a_b29949194b.jpeg" }, "medium": { "hash": "medium_86a_b29949194b", "ext": ".jpeg", "mime": "image/jpeg", "width": 750, "height": 750, "size": 45.53, "url": "/uploads/medium_86a_b29949194b.jpeg" }, "small": { "hash": "small_86a_b29949194b", "ext": ".jpeg", "mime": "image/jpeg", "width": 500, "height": 500, "size": 24.04, "url": "/uploads/small_86a_b29949194b.jpeg" } }, "hash": "86a_b29949194b", "ext": ".jpeg", "mime": "image/jpeg", "size": 52.58, "url": "/uploads/86a_b29949194b.jpeg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-04-18T08:42:13.713Z", "updated_at": "2020-04-18T08:42:13.713Z" }, { "id": 352, "name": "86c", "alternativeText": null, "caption": null, "width": 600, "height": 600, "formats": { "thumbnail": { "hash": "thumbnail_86c_fc3738188f", "ext": ".jpeg", "mime": "image/jpeg", "width": 156, "height": 156, "size": 4.3, "url": "/uploads/thumbnail_86c_fc3738188f.jpeg" }, "small": { "hash": "small_86c_fc3738188f", "ext": ".jpeg", "mime": "image/jpeg", "width": 500, "height": 500, "size": 34.07, "url": "/uploads/small_86c_fc3738188f.jpeg" } }, "hash": "86c_fc3738188f", "ext": ".jpeg", "mime": "image/jpeg", "size": 46.83, "url": "/uploads/86c_fc3738188f.jpeg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-04-18T08:42:13.725Z", "updated_at": "2020-04-18T08:42:13.725Z" }], "thumbnail": { "id": 353, "name": "86a", "alternativeText": null, "caption": null, "width": 800, "height": 800, "formats": { "thumbnail": { "hash": "thumbnail_86a_8cb6df1843", "ext": ".jpeg", "mime": "image/jpeg", "width": 156, "height": 156, "size": 3.61, "url": "/uploads/thumbnail_86a_8cb6df1843.jpeg" }, "medium": { "hash": "medium_86a_8cb6df1843", "ext": ".jpeg", "mime": "image/jpeg", "width": 750, "height": 750, "size": 45.53, "url": "/uploads/medium_86a_8cb6df1843.jpeg" }, "small": { "hash": "small_86a_8cb6df1843", "ext": ".jpeg", "mime": "image/jpeg", "width": 500, "height": 500, "size": 24.04, "url": "/uploads/small_86a_8cb6df1843.jpeg" } }, "hash": "86a_8cb6df1843", "ext": ".jpeg", "mime": "image/jpeg", "size": 52.58, "url": "/uploads/86a_8cb6df1843.jpeg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-04-18T08:42:13.735Z", "updated_at": "2020-04-18T08:42:13.735Z" } }] }, { "id": 16, "name": "meat", "description": null, "slug": "meat", "created_at": "2020-03-18T06:54:26.358Z", "updated_at": "2020-03-18T06:54:26.358Z", "products": [{ "id": 80, "title": "Tesco Eat Fresh Frozen Lamb Bone in Cube", "is_featured": false, "is_hot": false, "price": 21.89, "sale_price": null, "vendor": "Global Office", "review": 4, "is_out_of_stock": false, "depot": 60, "inventory": 70, "is_active": true, "is_sale": false, "created_at": "2020-03-18T06:54:02.670Z", "updated_at": "2020-03-18T06:54:02.670Z", "variants": [], "images": [{ "id": 321, "name": "81a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "d8e508fc912641f58f58138b16e792ce", "ext": ".jpg", "mime": "image/jpeg", "size": 109.76, "url": "/uploads/d8e508fc912641f58f58138b16e792ce.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T06:54:02.708Z", "updated_at": "2020-03-18T06:54:02.708Z" }], "thumbnail": { "id": 320, "name": "81a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "9f48e963891b43329a100e704a4ae84c", "ext": ".jpg", "mime": "image/jpeg", "size": 109.76, "url": "/uploads/9f48e963891b43329a100e704a4ae84c.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T06:54:02.693Z", "updated_at": "2020-03-18T06:54:02.693Z" } }, { "id": 86, "title": "Vita Coco Coconut Water (Pack of 24)", "is_featured": false, "is_hot": false, "price": 19.22, "sale_price": 21.99, "vendor": "Young Shop", "review": 2, "is_out_of_stock": false, "depot": 100, "inventory": 200, "is_active": true, "is_sale": true, "created_at": "2020-04-18T08:42:13.577Z", "updated_at": "2020-04-18T08:42:13.577Z", "variants": [], "images": [{ "id": 350, "name": "86b", "alternativeText": null, "caption": null, "width": 600, "height": 600, "formats": { "thumbnail": { "hash": "thumbnail_86b_81b868f333", "ext": ".jpeg", "mime": "image/jpeg", "width": 156, "height": 156, "size": 2.53, "url": "/uploads/thumbnail_86b_81b868f333.jpeg" }, "small": { "hash": "small_86b_81b868f333", "ext": ".jpeg", "mime": "image/jpeg", "width": 500, "height": 500, "size": 15.08, "url": "/uploads/small_86b_81b868f333.jpeg" } }, "hash": "86b_81b868f333", "ext": ".jpeg", "mime": "image/jpeg", "size": 20.45, "url": "/uploads/86b_81b868f333.jpeg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-04-18T08:42:13.694Z", "updated_at": "2020-04-18T08:42:13.694Z" }, { "id": 351, "name": "86a", "alternativeText": null, "caption": null, "width": 800, "height": 800, "formats": { "thumbnail": { "hash": "thumbnail_86a_b29949194b", "ext": ".jpeg", "mime": "image/jpeg", "width": 156, "height": 156, "size": 3.61, "url": "/uploads/thumbnail_86a_b29949194b.jpeg" }, "medium": { "hash": "medium_86a_b29949194b", "ext": ".jpeg", "mime": "image/jpeg", "width": 750, "height": 750, "size": 45.53, "url": "/uploads/medium_86a_b29949194b.jpeg" }, "small": { "hash": "small_86a_b29949194b", "ext": ".jpeg", "mime": "image/jpeg", "width": 500, "height": 500, "size": 24.04, "url": "/uploads/small_86a_b29949194b.jpeg" } }, "hash": "86a_b29949194b", "ext": ".jpeg", "mime": "image/jpeg", "size": 52.58, "url": "/uploads/86a_b29949194b.jpeg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-04-18T08:42:13.713Z", "updated_at": "2020-04-18T08:42:13.713Z" }, { "id": 352, "name": "86c", "alternativeText": null, "caption": null, "width": 600, "height": 600, "formats": { "thumbnail": { "hash": "thumbnail_86c_fc3738188f", "ext": ".jpeg", "mime": "image/jpeg", "width": 156, "height": 156, "size": 4.3, "url": "/uploads/thumbnail_86c_fc3738188f.jpeg" }, "small": { "hash": "small_86c_fc3738188f", "ext": ".jpeg", "mime": "image/jpeg", "width": 500, "height": 500, "size": 34.07, "url": "/uploads/small_86c_fc3738188f.jpeg" } }, "hash": "86c_fc3738188f", "ext": ".jpeg", "mime": "image/jpeg", "size": 46.83, "url": "/uploads/86c_fc3738188f.jpeg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-04-18T08:42:13.725Z", "updated_at": "2020-04-18T08:42:13.725Z" }], "thumbnail": { "id": 353, "name": "86a", "alternativeText": null, "caption": null, "width": 800, "height": 800, "formats": { "thumbnail": { "hash": "thumbnail_86a_8cb6df1843", "ext": ".jpeg", "mime": "image/jpeg", "width": 156, "height": 156, "size": 3.61, "url": "/uploads/thumbnail_86a_8cb6df1843.jpeg" }, "medium": { "hash": "medium_86a_8cb6df1843", "ext": ".jpeg", "mime": "image/jpeg", "width": 750, "height": 750, "size": 45.53, "url": "/uploads/medium_86a_8cb6df1843.jpeg" }, "small": { "hash": "small_86a_8cb6df1843", "ext": ".jpeg", "mime": "image/jpeg", "width": 500, "height": 500, "size": 24.04, "url": "/uploads/small_86a_8cb6df1843.jpeg" } }, "hash": "86a_8cb6df1843", "ext": ".jpeg", "mime": "image/jpeg", "size": 52.58, "url": "/uploads/86a_8cb6df1843.jpeg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-04-18T08:42:13.735Z", "updated_at": "2020-04-18T08:42:13.735Z" } }] }, { "id": 17, "name": "Book", "description": null, "slug": "book", "created_at": "2020-03-28T10:58:54.135Z", "updated_at": "2020-03-28T10:58:54.135Z", "products": [{ "id": 6, "title": "Grand Slam Indoor Of Show Jumping Novel", "is_featured": false, "is_hot": false, "price": 41.99, "sale_price": 32.99, "vendor": "Robert's Store", "review": 4, "is_out_of_stock": false, "depot": 68, "inventory": 90, "is_active": true, "is_sale": true, "created_at": "2020-03-15T06:04:35.781Z", "updated_at": "2020-04-14T10:46:09.145Z", "variants": [], "images": [{ "id": 24, "name": "6a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "5c7442b5104545afa78bfe819616d298", "ext": ".jpg", "mime": "image/jpeg", "size": 52.29, "url": "/uploads/5c7442b5104545afa78bfe819616d298.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:07:56.574Z", "updated_at": "2020-03-15T06:07:56.574Z" }, { "id": 25, "name": "6a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "0a9100b8791b44ff9629377856bab05a", "ext": ".jpg", "mime": "image/jpeg", "size": 52.29, "url": "/uploads/0a9100b8791b44ff9629377856bab05a.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:07:56.593Z", "updated_at": "2020-03-15T06:07:56.593Z" }], "thumbnail": { "id": 23, "name": "5.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "e2132e11d3c34da89511593297697922", "ext": ".jpg", "mime": "image/jpeg", "size": 10.17, "url": "/uploads/e2132e11d3c34da89511593297697922.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:07:56.562Z", "updated_at": "2020-03-15T06:07:56.562Z" } }] }]) 
   }, 

   products: (req, res, next) => { 
       res.send( 

           [{ "id": 2, "title": "Apple iPhone Retina 6s Plus 64GB", "is_featured": false, "is_hot": false, "price": 1150, "sale_price": null, "vendor": "Young Shop", "review": 4, "is_out_of_stock": false, "depot": 80, "inventory": 100, "is_active": true, "is_sale": false, "created_at": "2020-03-15T05:47:28.790Z", "updated_at": "2020-03-15T06:03:15.417Z", "variants": [], "images": [{ "id": 6, "name": "1a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "0e9b9750228b421aafe324f6f9b36304", "ext": ".jpg", "mime": "image/jpeg", "size": 8.78, "url": "/uploads/0e9b9750228b421aafe324f6f9b36304.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T05:47:28.833Z", "updated_at": "2020-03-15T05:47:28.833Z" }, { "id": 7, "name": "1b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "99cdb1e5a2874365bab8f49ea1fc7070", "ext": ".jpg", "mime": "image/jpeg", "size": 4.5, "url": "/uploads/99cdb1e5a2874365bab8f49ea1fc7070.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T05:47:28.857Z", "updated_at": "2020-03-15T05:47:28.857Z" }, { "id": 8, "name": "1c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "2ed1134b99b146feb6245f8e07201ec8", "ext": ".jpg", "mime": "image/jpeg", "size": 10.88, "url": "/uploads/2ed1134b99b146feb6245f8e07201ec8.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T05:47:28.869Z", "updated_at": "2020-03-15T05:47:28.869Z" }], "thumbnail": { "id": 5, "name": "1.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "4c07bca3f13444688823a1c099410884", "ext": ".jpg", "mime": "image/jpeg", "size": 9.04, "url": "/uploads/4c07bca3f13444688823a1c099410884.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T05:47:28.819Z", "updated_at": "2020-03-15T05:47:28.819Z" }, "product_categories": [{ "id": 7, "name": "Phones & Accessories", "slug": "phones-and-accessories", "description": null, "created_at": "2020-03-14T10:26:54.185Z", "updated_at": "2020-03-14T10:26:54.185Z" }], "brands": [{ "id": 1, "name": "Apple", "description": "", "slug": "apple", "created_at": "2020-03-14T10:30:03.468Z", "updated_at": "2020-03-14T10:30:31.584Z" }], "collections": [{ "id": 7, "name": "Top Deals Super Hot Today", "slug": "shop_top_deal_super_hot_today", "description": null, "created_at": "2020-04-12T06:34:11.408Z", "updated_at": "2020-04-12T06:48:38.472Z" }, { "id": 9, "name": "New Arrivals Products", "slug": "new_arrivals_products", "description": "New Arrivals Products", "created_at": "2020-04-12T06:36:23.687Z", "updated_at": "2020-04-14T12:07:12.421Z" }] }, { "id": 3, "title": "Marshall Kilburn Portable Wireless Speaker", "is_featured": false, "is_hot": false, "price": 42.99, "sale_price": null, "vendor": "Go Pro", "review": 5, "is_out_of_stock": false, "depot": 85, "inventory": 100, "is_active": true, "is_sale": false, "created_at": "2020-03-15T05:55:19.349Z", "updated_at": "2020-03-15T05:55:19.349Z", "variants": [], "images": [{ "id": 10, "name": "1.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "3398b7a330154c9390db4495b9e3d413", "ext": ".jpg", "mime": "image/jpeg", "size": 158.75, "url": "/uploads/3398b7a330154c9390db4495b9e3d413.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T05:55:19.403Z", "updated_at": "2020-03-15T05:55:19.403Z" }, { "id": 11, "name": "2.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "73b00542e06e4d008945bc701959472b", "ext": ".jpg", "mime": "image/jpeg", "size": 44.03, "url": "/uploads/73b00542e06e4d008945bc701959472b.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T05:55:19.415Z", "updated_at": "2020-03-15T05:55:19.415Z" }, { "id": 12, "name": "3.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "f0647af5998446e1a6a1906996014a0a", "ext": ".jpg", "mime": "image/jpeg", "size": 69.23, "url": "/uploads/f0647af5998446e1a6a1906996014a0a.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T05:55:19.425Z", "updated_at": "2020-03-15T05:55:19.425Z" }], "thumbnail": { "id": 9, "name": "2.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "feaeaa8c5d24474e943f57a7df55e921", "ext": ".jpg", "mime": "image/jpeg", "size": 15.15, "url": "/uploads/feaeaa8c5d24474e943f57a7df55e921.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T05:55:19.385Z", "updated_at": "2020-03-15T05:55:19.385Z" }, "product_categories": [{ "id": 3, "name": "Consumer Electrics", "slug": "consumer-electrics", "description": null, "created_at": "2020-03-14T10:25:39.408Z", "updated_at": "2020-03-14T10:25:39.408Z" }], "brands": [{ "id": 2, "name": "Marshall", "description": null, "slug": "marshall", "created_at": "2020-03-14T10:31:31.138Z", "updated_at": "2020-03-14T10:31:31.138Z" }], "collections": [{ "id": 6, "name": "Shop Recommend Items", "slug": "shop-recommend-items", "description": null, "created_at": "2020-04-05T05:37:37.071Z", "updated_at": "2020-04-05T05:37:49.638Z" }, { "id": 7, "name": "Top Deals Super Hot Today", "slug": "shop_top_deal_super_hot_today", "description": null, "created_at": "2020-04-12T06:34:11.408Z", "updated_at": "2020-04-12T06:48:38.472Z" }, { "id": 9, "name": "New Arrivals Products", "slug": "new_arrivals_products", "description": "New Arrivals Products", "created_at": "2020-04-12T06:36:23.687Z", "updated_at": "2020-04-14T12:07:12.421Z" }, { "id": 20, "name": "Customer Bought Products", "slug": "customer_bought", "description": "Customer Bought Products", "created_at": "2020-04-19T08:37:10.179Z", "updated_at": "2020-04-19T08:37:10.179Z" }, { "id": 21, "name": "Widget Same Brand", "slug": "widget_same_brand", "description": "Widget Same Brand Products", "created_at": "2020-04-19T09:36:13.121Z", "updated_at": "2020-04-19T09:36:13.121Z" }, { "id": 22, "name": "fullwidth_consumer_electronic_bestseller", "slug": "fullwidth_consumer_electronic_bestseller", "description": "Fullwidth best seller products", "created_at": "2020-06-21T10:58:15.313Z", "updated_at": "2020-06-21T10:58:15.313Z" }] }, { "id": 4, "title": "Herschel Leather Duffle Bag In Brown Color", "is_featured": false, "is_hot": false, "price": 125.3, "sale_price": null, "vendor": "Go Pro", "review": 4, "is_out_of_stock": false, "depot": 50, "inventory": 70, "is_active": true, "is_sale": false, "created_at": "2020-03-15T05:58:54.229Z", "updated_at": "2020-03-15T05:58:54.229Z", "variants": [], "images": [{ "id": 14, "name": "4a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "ff63a2eb476e45b1bfef05ee79115018", "ext": ".jpg", "mime": "image/jpeg", "size": 74.96, "url": "/uploads/ff63a2eb476e45b1bfef05ee79115018.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T05:58:54.276Z", "updated_at": "2020-03-15T05:58:54.276Z" }, { "id": 15, "name": "4b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "9b7e71c6299c456baceb165ec185687d", "ext": ".jpg", "mime": "image/jpeg", "size": 76.68, "url": "/uploads/9b7e71c6299c456baceb165ec185687d.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T05:58:54.287Z", "updated_at": "2020-03-15T05:58:54.287Z" }, { "id": 16, "name": "4c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "11591497e4ac4779981252032c8b0381", "ext": ".jpg", "mime": "image/jpeg", "size": 92.28, "url": "/uploads/11591497e4ac4779981252032c8b0381.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T05:58:54.300Z", "updated_at": "2020-03-15T05:58:54.300Z" }, { "id": 17, "name": "4d.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "bbc7b7c8745140e19653bc109965f9f4", "ext": ".jpg", "mime": "image/jpeg", "size": 26.43, "url": "/uploads/bbc7b7c8745140e19653bc109965f9f4.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T05:58:54.311Z", "updated_at": "2020-03-15T05:58:54.311Z" }], "thumbnail": { "id": 13, "name": "4a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "b5deb586612e4c808272da9913b8109b", "ext": ".jpg", "mime": "image/jpeg", "size": 74.96, "url": "/uploads/b5deb586612e4c808272da9913b8109b.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T05:58:54.262Z", "updated_at": "2020-03-15T05:58:54.262Z" }, "product_categories": [{ "id": 1, "name": "Clothing & Apparel", "slug": "clothing-and-parel", "description": null, "created_at": "2020-03-14T10:24:42.894Z", "updated_at": "2020-04-17T08:41:15.412Z" }], "brands": [{ "id": 8, "name": "Gucci", "description": null, "slug": "gucci", "created_at": "2020-03-14T10:32:29.669Z", "updated_at": "2020-03-14T10:32:29.669Z" }], "collections": [{ "id": 5, "name": "Shop Best Seller Items", "slug": "shop_best_sale_items", "description": null, "created_at": "2020-04-04T17:12:55.930Z", "updated_at": "2020-04-12T12:47:31.929Z" }, { "id": 2, "name": "Consumer Electronics", "slug": "consumer_electronics", "description": "Home 1 Consumer Electronics", "created_at": "2020-04-01T05:57:39.568Z", "updated_at": "2020-04-12T12:46:31.058Z" }, { "id": 3, "name": "Clothings", "slug": "clothings", "description": "Home 1 Clothings", "created_at": "2020-04-01T05:58:07.982Z", "updated_at": "2020-04-12T12:47:56.368Z" }, { "id": 9, "name": "New Arrivals Products", "slug": "new_arrivals_products", "description": "New Arrivals Products", "created_at": "2020-04-12T06:36:23.687Z", "updated_at": "2020-04-14T12:07:12.421Z" }, { "id": 20, "name": "Customer Bought Products", "slug": "customer_bought", "description": "Customer Bought Products", "created_at": "2020-04-19T08:37:10.179Z", "updated_at": "2020-04-19T08:37:10.179Z" }, { "id": 21, "name": "Widget Same Brand", "slug": "widget_same_brand", "description": "Widget Same Brand Products", "created_at": "2020-04-19T09:36:13.121Z", "updated_at": "2020-04-19T09:36:13.121Z" }, { "id": 24, "name": "fullwidth_clothing_bestseller", "slug": "fullwidth_clothing_bestseller", "description": "Home Fullwidth Bestseller", "created_at": "2020-06-21T13:02:36.388Z", "updated_at": "2020-06-21T13:02:36.388Z" }] }, { "id": 5, "title": "Xbox One Wireless Controller Black Color", "is_featured": false, "is_hot": true, "price": 55.99, "sale_price": null, "vendor": "Global Office", "review": 5, "is_out_of_stock": false, "depot": 70, "inventory": 80, "is_active": true, "is_sale": false, "created_at": "2020-03-15T06:02:06.677Z", "updated_at": "2020-03-15T06:02:06.677Z", "variants": [], "images": [{ "id": 19, "name": "5a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "1a15c64eb31a4bc2bbeff1961535519c", "ext": ".jpg", "mime": "image/jpeg", "size": 30.89, "url": "/uploads/1a15c64eb31a4bc2bbeff1961535519c.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:02:06.726Z", "updated_at": "2020-03-15T06:02:06.726Z" }, { "id": 20, "name": "5b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "bb6866b289d949338bf655c7351f9df8", "ext": ".jpg", "mime": "image/jpeg", "size": 24.88, "url": "/uploads/bb6866b289d949338bf655c7351f9df8.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:02:06.739Z", "updated_at": "2020-03-15T06:02:06.739Z" }, { "id": 21, "name": "5c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "d3a3d44ea16e439c9ff426a90e60acd2", "ext": ".jpg", "mime": "image/jpeg", "size": 21.5, "url": "/uploads/d3a3d44ea16e439c9ff426a90e60acd2.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:02:06.748Z", "updated_at": "2020-03-15T06:02:06.748Z" }, { "id": 22, "name": "5d.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "faa25ed3c1fd4ba3a904b2b6dd8bdc87", "ext": ".jpg", "mime": "image/jpeg", "size": 39.19, "url": "/uploads/faa25ed3c1fd4ba3a904b2b6dd8bdc87.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:02:06.765Z", "updated_at": "2020-03-15T06:02:06.765Z" }], "thumbnail": { "id": 18, "name": "5a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "8e2e4eff27414c719203df4ea88e68be", "ext": ".jpg", "mime": "image/jpeg", "size": 30.89, "url": "/uploads/8e2e4eff27414c719203df4ea88e68be.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:02:06.710Z", "updated_at": "2020-03-15T06:02:06.710Z" }, "product_categories": [{ "id": 5, "name": "Computers & Technologies", "slug": "computers-and-technologies", "description": null, "created_at": "2020-03-14T10:26:11.462Z", "updated_at": "2020-03-14T10:26:11.462Z" }], "brands": [{ "id": 4, "name": "Microsoft", "description": null, "slug": "microsoft", "created_at": "2020-03-14T10:31:45.382Z", "updated_at": "2020-03-14T10:31:45.382Z" }], "collections": [{ "id": 14, "name": "Electronics Best Sellers", "slug": "electronics_best_sellers", "description": "Electronics Best Sellers Products", "created_at": "2020-04-18T07:07:18.660Z", "updated_at": "2020-04-18T07:07:18.660Z" }, { "id": 9, "name": "New Arrivals Products", "slug": "new_arrivals_products", "description": "New Arrivals Products", "created_at": "2020-04-12T06:36:23.687Z", "updated_at": "2020-04-14T12:07:12.421Z" }, { "id": 22, "name": "fullwidth_consumer_electronic_bestseller", "slug": "fullwidth_consumer_electronic_bestseller", "description": "Fullwidth best seller products", "created_at": "2020-06-21T10:58:15.313Z", "updated_at": "2020-06-21T10:58:15.313Z" }] }, { "id": 6, "title": "Grand Slam Indoor Of Show Jumping Novel", "is_featured": false, "is_hot": false, "price": 41.99, "sale_price": 32.99, "vendor": "Robert's Store", "review": 4, "is_out_of_stock": false, "depot": 68, "inventory": 90, "is_active": true, "is_sale": true, "created_at": "2020-03-15T06:04:35.781Z", "updated_at": "2020-04-14T10:46:09.145Z", "variants": [], "images": [{ "id": 24, "name": "6a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "5c7442b5104545afa78bfe819616d298", "ext": ".jpg", "mime": "image/jpeg", "size": 52.29, "url": "/uploads/5c7442b5104545afa78bfe819616d298.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:07:56.574Z", "updated_at": "2020-03-15T06:07:56.574Z" }, { "id": 25, "name": "6a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "0a9100b8791b44ff9629377856bab05a", "ext": ".jpg", "mime": "image/jpeg", "size": 52.29, "url": "/uploads/0a9100b8791b44ff9629377856bab05a.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:07:56.593Z", "updated_at": "2020-03-15T06:07:56.593Z" }], "thumbnail": { "id": 23, "name": "5.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "e2132e11d3c34da89511593297697922", "ext": ".jpg", "mime": "image/jpeg", "size": 10.17, "url": "/uploads/e2132e11d3c34da89511593297697922.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:07:56.562Z", "updated_at": "2020-03-15T06:07:56.562Z" }, "product_categories": [{ "id": 10, "name": "Books & Office", "slug": "books-and-office", "description": null, "created_at": "2020-03-14T10:27:46.112Z", "updated_at": "2020-03-14T10:27:46.112Z" }, { "id": 14, "name": "Book", "slug": "book", "description": null, "created_at": "2020-03-28T10:59:05.002Z", "updated_at": "2020-03-28T10:59:05.002Z" }], "brands": [{ "id": 17, "name": "Book", "description": null, "slug": "book", "created_at": "2020-03-28T10:58:54.135Z", "updated_at": "2020-03-28T10:58:54.135Z" }], "collections": [{ "id": 5, "name": "Shop Best Seller Items", "slug": "shop_best_sale_items", "description": null, "created_at": "2020-04-04T17:12:55.930Z", "updated_at": "2020-04-12T12:47:31.929Z" }, { "id": 10, "name": "Deal Of the Day ", "slug": "deal_of_the_day", "description": "Home 1 Deal of the day section", "created_at": "2020-04-12T12:40:55.908Z", "updated_at": "2020-04-12T12:40:55.908Z" }, { "id": 2, "name": "Consumer Electronics", "slug": "consumer_electronics", "description": "Home 1 Consumer Electronics", "created_at": "2020-04-01T05:57:39.568Z", "updated_at": "2020-04-12T12:46:31.058Z" }, { "id": 9, "name": "New Arrivals Products", "slug": "new_arrivals_products", "description": "New Arrivals Products", "created_at": "2020-04-12T06:36:23.687Z", "updated_at": "2020-04-14T12:07:12.421Z" }] }, { "id": 7, "title": "Sound Intone I65 Earphone White Version", "is_featured": false, "is_hot": false, "price": 106.96, "sale_price": 100.99, "vendor": "Youngshop", "review": 5, "is_out_of_stock": false, "depot": 80, "inventory": 90, "is_active": true, "is_sale": true, "created_at": "2020-03-15T06:12:37.749Z", "updated_at": "2020-04-14T10:45:51.530Z", "variants": [], "images": [{ "id": 27, "name": "7a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "e98492a0c2b24ae5892641009bf21056", "ext": ".jpg", "mime": "image/jpeg", "size": 35.46, "url": "/uploads/e98492a0c2b24ae5892641009bf21056.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:12:37.787Z", "updated_at": "2020-03-15T06:12:37.787Z" }, { "id": 28, "name": "7b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "55fbf669c1804ea994ace81b7aa58896", "ext": ".jpg", "mime": "image/jpeg", "size": 44.24, "url": "/uploads/55fbf669c1804ea994ace81b7aa58896.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:12:37.797Z", "updated_at": "2020-03-15T06:12:37.797Z" }, { "id": 29, "name": "7c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "b6bf4ec3c620428ca2c3876d31b28252", "ext": ".jpg", "mime": "image/jpeg", "size": 35.55, "url": "/uploads/b6bf4ec3c620428ca2c3876d31b28252.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:12:37.807Z", "updated_at": "2020-03-15T06:12:37.807Z" }, { "id": 30, "name": "7d.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "dcdfd21d3ea44a6888d983d21852d961", "ext": ".jpg", "mime": "image/jpeg", "size": 30.8, "url": "/uploads/dcdfd21d3ea44a6888d983d21852d961.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:12:37.816Z", "updated_at": "2020-03-15T06:12:37.816Z" }], "thumbnail": { "id": 26, "name": "6.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "b097fdfb8b9d40fca83de9180de5a7ab", "ext": ".jpg", "mime": "image/jpeg", "size": 7.03, "url": "/uploads/b097fdfb8b9d40fca83de9180de5a7ab.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:12:37.775Z", "updated_at": "2020-03-15T06:12:37.775Z" }, "product_categories": [{ "id": 5, "name": "Computers & Technologies", "slug": "computers-and-technologies", "description": null, "created_at": "2020-03-14T10:26:11.462Z", "updated_at": "2020-03-14T10:26:11.462Z" }], "brands": [{ "id": 6, "name": "Sony", "description": null, "slug": "sony", "created_at": "2020-03-14T10:32:15.139Z", "updated_at": "2020-03-14T10:32:15.139Z" }], "collections": [{ "id": 6, "name": "Shop Recommend Items", "slug": "shop-recommend-items", "description": null, "created_at": "2020-04-05T05:37:37.071Z", "updated_at": "2020-04-05T05:37:49.638Z" }, { "id": 8, "name": "Best Seller Products", "slug": "best_seller_products", "description": "", "created_at": "2020-04-12T06:35:36.547Z", "updated_at": "2020-04-12T12:45:30.911Z" }, { "id": 9, "name": "New Arrivals Products", "slug": "new_arrivals_products", "description": "New Arrivals Products", "created_at": "2020-04-12T06:36:23.687Z", "updated_at": "2020-04-14T12:07:12.421Z" }, { "id": 10, "name": "Deal Of the Day ", "slug": "deal_of_the_day", "description": "Home 1 Deal of the day section", "created_at": "2020-04-12T12:40:55.908Z", "updated_at": "2020-04-12T12:40:55.908Z" }, { "id": 14, "name": "Electronics Best Sellers", "slug": "electronics_best_sellers", "description": "Electronics Best Sellers Products", "created_at": "2020-04-18T07:07:18.660Z", "updated_at": "2020-04-18T07:07:18.660Z" }, { "id": 15, "name": "Electronics Computer & Technology", "slug": "electronic_computer_technology", "description": "Electronics Computer & Technology Products", "created_at": "2020-04-18T07:23:51.233Z", "updated_at": "2020-04-18T07:23:51.233Z" }, { "id": 22, "name": "fullwidth_consumer_electronic_bestseller", "slug": "fullwidth_consumer_electronic_bestseller", "description": "Fullwidth best seller products", "created_at": "2020-06-21T10:58:15.313Z", "updated_at": "2020-06-21T10:58:15.313Z" }] }, { "id": 8, "title": "Korea Long Sofa Fabric In Blue Navy Color", "is_featured": false, "is_hot": false, "price": 670.2, "sale_price": 567.8, "vendor": "Youngshop", "review": 4, "is_out_of_stock": false, "depot": 85, "inventory": 79, "is_active": true, "is_sale": true, "created_at": "2020-03-15T06:15:55.939Z", "updated_at": "2020-03-15T06:15:55.939Z", "variants": [], "images": [{ "id": 32, "name": "8a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "caafb8f05561484a97923b235d2603f7", "ext": ".jpg", "mime": "image/jpeg", "size": 20.75, "url": "/uploads/caafb8f05561484a97923b235d2603f7.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:15:56.021Z", "updated_at": "2020-03-15T06:15:56.021Z" }, { "id": 33, "name": "8b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "ea26eeafaa1747b5857ee73c93430261", "ext": ".jpg", "mime": "image/jpeg", "size": 26.42, "url": "/uploads/ea26eeafaa1747b5857ee73c93430261.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:15:56.038Z", "updated_at": "2020-03-15T06:15:56.038Z" }, { "id": 34, "name": "8c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "97b54a32f4864342bc485c7929de6366", "ext": ".jpg", "mime": "image/jpeg", "size": 19.04, "url": "/uploads/97b54a32f4864342bc485c7929de6366.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:15:56.047Z", "updated_at": "2020-03-15T06:15:56.047Z" }, { "id": 35, "name": "8d.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "210d685d19f84c8b9e5de231176b4cf2", "ext": ".jpg", "mime": "image/jpeg", "size": 155.83, "url": "/uploads/210d685d19f84c8b9e5de231176b4cf2.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:15:56.057Z", "updated_at": "2020-03-15T06:15:56.057Z" }], "thumbnail": { "id": 31, "name": "7.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "04ec8d58423647c98d6dbd3544c1c355", "ext": ".jpg", "mime": "image/jpeg", "size": 3.63, "url": "/uploads/04ec8d58423647c98d6dbd3544c1c355.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:15:55.999Z", "updated_at": "2020-03-15T06:15:55.999Z" }, "product_categories": [{ "id": 2, "name": "Garden & Kitchen", "slug": "garden-and-kitchen", "description": null, "created_at": "2020-03-14T10:25:21.611Z", "updated_at": "2020-03-14T10:25:21.611Z" }], "brands": [{ "id": 7, "name": "Flat Funiture", "description": null, "slug": "flatfuniture", "created_at": "2020-03-14T10:32:23.182Z", "updated_at": "2020-03-14T10:32:23.182Z" }], "collections": [{ "id": 5, "name": "Shop Best Seller Items", "slug": "shop_best_sale_items", "description": null, "created_at": "2020-04-04T17:12:55.930Z", "updated_at": "2020-04-12T12:47:31.929Z" }, { "id": 10, "name": "Deal Of the Day ", "slug": "deal_of_the_day", "description": "Home 1 Deal of the day section", "created_at": "2020-04-12T12:40:55.908Z", "updated_at": "2020-04-12T12:40:55.908Z" }, { "id": 4, "name": "Home, Garden & Kitchen", "slug": "garden_and_kitchen", "description": "Home 1 Garden And Kitchen", "created_at": "2020-04-01T05:58:42.991Z", "updated_at": "2020-04-14T11:32:43.475Z" }, { "id": 18, "name": "Furniture Trending Products", "slug": "furniture_trending_products", "description": "Furniture Trending Products", "created_at": "2020-04-18T08:18:04.880Z", "updated_at": "2020-04-18T08:18:04.880Z" }, { "id": 9, "name": "New Arrivals Products", "slug": "new_arrivals_products", "description": "New Arrivals Products", "created_at": "2020-04-12T06:36:23.687Z", "updated_at": "2020-04-14T12:07:12.421Z" }, { "id": 26, "name": "fullwidth_kitchen_best_seller", "slug": "fullwidth_kitchen_best_seller", "description": "Home Fullwidth Kitchen Best Seller", "created_at": "2020-06-21T13:56:06.530Z", "updated_at": "2020-06-21T13:56:11.755Z" }, { "id": 27, "name": "fullwidth_kitchen_most_popular", "slug": "fullwidth_kitchen_most_popular", "description": "Home fullwidth Most Popular", "created_at": "2020-06-21T13:58:37.299Z", "updated_at": "2020-06-21T13:58:37.299Z" }] }, { "id": 9, "title": "Unero Military Classical Backpack", "is_featured": false, "is_hot": false, "price": 42.2, "sale_price": 35.89, "vendor": "Young shop", "review": 3, "is_out_of_stock": false, "depot": 70, "inventory": 80, "is_active": true, "is_sale": true, "created_at": "2020-03-15T06:18:20.414Z", "updated_at": "2020-03-15T06:18:20.414Z", "variants": [], "images": [{ "id": 37, "name": "9a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "13fc9fc391d64652a0139f54cdac5c2b", "ext": ".jpg", "mime": "image/jpeg", "size": 43.02, "url": "/uploads/13fc9fc391d64652a0139f54cdac5c2b.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:18:20.533Z", "updated_at": "2020-03-15T06:18:20.533Z" }, { "id": 38, "name": "9b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "3d3ef24143bc473eb75a5721228e1f6d", "ext": ".jpg", "mime": "image/jpeg", "size": 50.61, "url": "/uploads/3d3ef24143bc473eb75a5721228e1f6d.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:18:20.573Z", "updated_at": "2020-03-15T06:18:20.573Z" }, { "id": 39, "name": "9c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "7420bed7be764af19c26f762296ff27d", "ext": ".jpg", "mime": "image/jpeg", "size": 44.06, "url": "/uploads/7420bed7be764af19c26f762296ff27d.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:18:20.596Z", "updated_at": "2020-03-15T06:18:20.596Z" }, { "id": 40, "name": "9d.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "10c4fdf0f6124ab79e5ab46dc2c52e38", "ext": ".jpg", "mime": "image/jpeg", "size": 47.73, "url": "/uploads/10c4fdf0f6124ab79e5ab46dc2c52e38.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:18:20.607Z", "updated_at": "2020-03-15T06:18:20.607Z" }], "thumbnail": { "id": 36, "name": "8.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "1e1f0f78e33d4ce7828d21465e84da7d", "ext": ".jpg", "mime": "image/jpeg", "size": 8.13, "url": "/uploads/1e1f0f78e33d4ce7828d21465e84da7d.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:18:20.459Z", "updated_at": "2020-03-15T06:18:20.459Z" }, "product_categories": [{ "id": 1, "name": "Clothing & Apparel", "slug": "clothing-and-parel", "description": null, "created_at": "2020-03-14T10:24:42.894Z", "updated_at": "2020-04-17T08:41:15.412Z" }], "brands": [{ "id": 3, "name": "Herschel", "description": null, "slug": "herschel", "created_at": "2020-03-14T10:31:38.729Z", "updated_at": "2020-03-14T10:31:38.729Z" }], "collections": [{ "id": 5, "name": "Shop Best Seller Items", "slug": "shop_best_sale_items", "description": null, "created_at": "2020-04-04T17:12:55.930Z", "updated_at": "2020-04-12T12:47:31.929Z" }, { "id": 10, "name": "Deal Of the Day ", "slug": "deal_of_the_day", "description": "Home 1 Deal of the day section", "created_at": "2020-04-12T12:40:55.908Z", "updated_at": "2020-04-12T12:40:55.908Z" }, { "id": 3, "name": "Clothings", "slug": "clothings", "description": "Home 1 Clothings", "created_at": "2020-04-01T05:58:07.982Z", "updated_at": "2020-04-12T12:47:56.368Z" }, { "id": 24, "name": "fullwidth_clothing_bestseller", "slug": "fullwidth_clothing_bestseller", "description": "Home Fullwidth Bestseller", "created_at": "2020-06-21T13:02:36.388Z", "updated_at": "2020-06-21T13:02:36.388Z" }] }, { "id": 10, "title": "Rayban Rounded Sunglass Brown Color", "is_featured": false, "is_hot": false, "price": 35.89, "sale_price": null, "vendor": "Young shop", "review": 5, "is_out_of_stock": false, "depot": 50, "inventory": 60, "is_active": true, "is_sale": false, "created_at": "2020-03-15T06:20:39.867Z", "updated_at": "2020-03-15T06:20:39.867Z", "variants": [], "images": [{ "id": 42, "name": "10a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "0208616a8daa44cbb20f12eaebf8de53", "ext": ".jpg", "mime": "image/jpeg", "size": 21.67, "url": "/uploads/0208616a8daa44cbb20f12eaebf8de53.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:20:39.908Z", "updated_at": "2020-03-15T06:20:39.908Z" }, { "id": 43, "name": "10b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "cba8c25fcf0d41d1aac41f05d8f7ad8e", "ext": ".jpg", "mime": "image/jpeg", "size": 20.16, "url": "/uploads/cba8c25fcf0d41d1aac41f05d8f7ad8e.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:20:39.925Z", "updated_at": "2020-03-15T06:20:39.925Z" }, { "id": 44, "name": "10c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "f8f22b0f8be04b559439dd7e7a4b9631", "ext": ".jpg", "mime": "image/jpeg", "size": 14.77, "url": "/uploads/f8f22b0f8be04b559439dd7e7a4b9631.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:20:39.935Z", "updated_at": "2020-03-15T06:20:39.935Z" }], "thumbnail": { "id": 41, "name": "9.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "0f04c128bb2945608bed459cdff45b2d", "ext": ".jpg", "mime": "image/jpeg", "size": 4.7, "url": "/uploads/0f04c128bb2945608bed459cdff45b2d.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:20:39.893Z", "updated_at": "2020-03-15T06:20:39.893Z" }, "product_categories": [{ "id": 1, "name": "Clothing & Apparel", "slug": "clothing-and-parel", "description": null, "created_at": "2020-03-14T10:24:42.894Z", "updated_at": "2020-04-17T08:41:15.412Z" }], "brands": [{ "id": 8, "name": "Gucci", "description": null, "slug": "gucci", "created_at": "2020-03-14T10:32:29.669Z", "updated_at": "2020-03-14T10:32:29.669Z" }], "collections": [{ "id": 6, "name": "Shop Recommend Items", "slug": "shop-recommend-items", "description": null, "created_at": "2020-04-05T05:37:37.071Z", "updated_at": "2020-04-05T05:37:49.638Z" }, { "id": 3, "name": "Clothings", "slug": "clothings", "description": "Home 1 Clothings", "created_at": "2020-04-01T05:58:07.982Z", "updated_at": "2020-04-12T12:47:56.368Z" }, { "id": 24, "name": "fullwidth_clothing_bestseller", "slug": "fullwidth_clothing_bestseller", "description": "Home Fullwidth Bestseller", "created_at": "2020-06-21T13:02:36.388Z", "updated_at": "2020-06-21T13:02:36.388Z" }] }, { "id": 11, "title": "Sleeve Linen Blend Caro Pane Shirt", "is_featured": false, "is_hot": false, "price": 29.39, "sale_price": null, "vendor": "Go Pro", "review": 4, "is_out_of_stock": false, "depot": 65, "inventory": 80, "is_active": true, "is_sale": false, "created_at": "2020-03-15T06:22:44.237Z", "updated_at": "2020-03-15T06:22:44.237Z", "variants": [], "images": [{ "id": 46, "name": "11a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "ab27be4989234d5abcfb3f4ecc1af045", "ext": ".jpg", "mime": "image/jpeg", "size": 41.05, "url": "/uploads/ab27be4989234d5abcfb3f4ecc1af045.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:22:44.291Z", "updated_at": "2020-03-15T06:22:44.291Z" }, { "id": 47, "name": "11b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "fd27bd22be044fc89915d96cc85184a2", "ext": ".jpg", "mime": "image/jpeg", "size": 90.14, "url": "/uploads/fd27bd22be044fc89915d96cc85184a2.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:22:44.303Z", "updated_at": "2020-03-15T06:22:44.303Z" }, { "id": 48, "name": "11c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "d9860fd4f75847b08533072d216520a7", "ext": ".jpg", "mime": "image/jpeg", "size": 20.98, "url": "/uploads/d9860fd4f75847b08533072d216520a7.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:22:44.312Z", "updated_at": "2020-03-15T06:22:44.312Z" }, { "id": 49, "name": "11d.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "d25af4f6df2448579caf80399f625ec7", "ext": ".jpg", "mime": "image/jpeg", "size": 15.51, "url": "/uploads/d25af4f6df2448579caf80399f625ec7.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:22:44.321Z", "updated_at": "2020-03-15T06:22:44.321Z" }], "thumbnail": { "id": 45, "name": "10.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "77ac135e297b416388e2e10be368a898", "ext": ".jpg", "mime": "image/jpeg", "size": 13.67, "url": "/uploads/77ac135e297b416388e2e10be368a898.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:22:44.278Z", "updated_at": "2020-03-15T06:22:44.278Z" }, "product_categories": [{ "id": 1, "name": "Clothing & Apparel", "slug": "clothing-and-parel", "description": null, "created_at": "2020-03-14T10:24:42.894Z", "updated_at": "2020-04-17T08:41:15.412Z" }], "brands": [{ "id": 3, "name": "Herschel", "description": null, "slug": "herschel", "created_at": "2020-03-14T10:31:38.729Z", "updated_at": "2020-03-14T10:31:38.729Z" }], "collections": [{ "id": 8, "name": "Best Seller Products", "slug": "best_seller_products", "description": "", "created_at": "2020-04-12T06:35:36.547Z", "updated_at": "2020-04-12T12:45:30.911Z" }, { "id": 3, "name": "Clothings", "slug": "clothings", "description": "Home 1 Clothings", "created_at": "2020-04-01T05:58:07.982Z", "updated_at": "2020-04-12T12:47:56.368Z" }, { "id": 24, "name": "fullwidth_clothing_bestseller", "slug": "fullwidth_clothing_bestseller", "description": "Home Fullwidth Bestseller", "created_at": "2020-06-21T13:02:36.388Z", "updated_at": "2020-06-21T13:02:36.388Z" }, { "id": 25, "name": "fullwidth_clothing_most_popular", "slug": "fullwidth_clothing_most_popular", "description": "Home Fullwidth Cothing Most Popular", "created_at": "2020-06-21T13:53:58.811Z", "updated_at": "2020-06-21T13:53:58.811Z" }] }, { "id": 12, "title": "Mens Smith Sneaker InWhite Color", "is_featured": false, "is_hot": false, "price": 75.44, "sale_price": null, "vendor": "Global Office", "review": 4, "is_out_of_stock": false, "depot": 70, "inventory": 80, "is_active": true, "is_sale": false, "created_at": "2020-03-15T06:32:31.147Z", "updated_at": "2020-03-18T12:54:00.174Z", "variants": [], "images": [{ "id": 55, "name": "13a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "58092188da0c46858b8273fe7cfb16c1", "ext": ".jpg", "mime": "image/jpeg", "size": 33.4, "url": "/uploads/58092188da0c46858b8273fe7cfb16c1.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:32:31.197Z", "updated_at": "2020-03-15T06:32:31.197Z" }, { "id": 56, "name": "13b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "db91360ae9ac420c9172c2b797540c3f", "ext": ".jpg", "mime": "image/jpeg", "size": 10, "url": "/uploads/db91360ae9ac420c9172c2b797540c3f.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:32:31.215Z", "updated_at": "2020-03-15T06:32:31.215Z" }, { "id": 57, "name": "13c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "fd95618bdbc64b9fa835f03d4c992b63", "ext": ".jpg", "mime": "image/jpeg", "size": 23.2, "url": "/uploads/fd95618bdbc64b9fa835f03d4c992b63.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:32:31.223Z", "updated_at": "2020-03-15T06:32:31.223Z" }, { "id": 58, "name": "13d.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "974d2403fc62442db39bb155902fd6a0", "ext": ".jpg", "mime": "image/jpeg", "size": 13.81, "url": "/uploads/974d2403fc62442db39bb155902fd6a0.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:32:31.232Z", "updated_at": "2020-03-15T06:32:31.232Z" }], "thumbnail": { "id": 54, "name": "12.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "d903b17699d842f4ab1327eff18f04d0", "ext": ".jpg", "mime": "image/jpeg", "size": 4.9, "url": "/uploads/d903b17699d842f4ab1327eff18f04d0.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:32:31.177Z", "updated_at": "2020-03-15T06:32:31.177Z" }, "product_categories": [{ "id": 1, "name": "Clothing & Apparel", "slug": "clothing-and-parel", "description": null, "created_at": "2020-03-14T10:24:42.894Z", "updated_at": "2020-04-17T08:41:15.412Z" }], "brands": [{ "id": 8, "name": "Gucci", "description": null, "slug": "gucci", "created_at": "2020-03-14T10:32:29.669Z", "updated_at": "2020-03-14T10:32:29.669Z" }], "collections": [{ "id": 3, "name": "Clothings", "slug": "clothings", "description": "Home 1 Clothings", "created_at": "2020-04-01T05:58:07.982Z", "updated_at": "2020-04-12T12:47:56.368Z" }, { "id": 24, "name": "fullwidth_clothing_bestseller", "slug": "fullwidth_clothing_bestseller", "description": "Home Fullwidth Bestseller", "created_at": "2020-06-21T13:02:36.388Z", "updated_at": "2020-06-21T13:02:36.388Z" }] }] 

       ) 
   }, 
   countp: (req, res, next) => { 
       res.send("85") 
   }, 
   pcatagory: (req, res, next) => { 
       res.send([{ "id": 1, "name": "Clothing & Apparel", "slug": "clothing-and-parel", "description": null, "created_at": "2020-03-14T10:24:42.894Z", "updated_at": "2020-04-17T08:41:15.412Z", "products": [{ "id": 4, "title": "Herschel Leather Duffle Bag In Brown Color", "is_featured": false, "is_hot": false, "price": 125.3, "sale_price": null, "vendor": "Go Pro", "review": 4, "is_out_of_stock": false, "depot": 50, "inventory": 70, "is_active": true, "is_sale": false, "created_at": "2020-03-15T05:58:54.229Z", "updated_at": "2020-03-15T05:58:54.229Z", "variants": [], "images": [{ "id": 14, "name": "4a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "ff63a2eb476e45b1bfef05ee79115018", "ext": ".jpg", "mime": "image/jpeg", "size": 74.96, "url": "/uploads/ff63a2eb476e45b1bfef05ee79115018.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T05:58:54.276Z", "updated_at": "2020-03-15T05:58:54.276Z" }, { "id": 15, "name": "4b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "9b7e71c6299c456baceb165ec185687d", "ext": ".jpg", "mime": "image/jpeg", "size": 76.68, "url": "/uploads/9b7e71c6299c456baceb165ec185687d.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T05:58:54.287Z", "updated_at": "2020-03-15T05:58:54.287Z" }, { "id": 16, "name": "4c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "11591497e4ac4779981252032c8b0381", "ext": ".jpg", "mime": "image/jpeg", "size": 92.28, "url": "/uploads/11591497e4ac4779981252032c8b0381.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T05:58:54.300Z", "updated_at": "2020-03-15T05:58:54.300Z" }, { "id": 17, "name": "4d.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "bbc7b7c8745140e19653bc109965f9f4", "ext": ".jpg", "mime": "image/jpeg", "size": 26.43, "url": "/uploads/bbc7b7c8745140e19653bc109965f9f4.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T05:58:54.311Z", "updated_at": "2020-03-15T05:58:54.311Z" }], "thumbnail": { "id": 13, "name": "4a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "b5deb586612e4c808272da9913b8109b", "ext": ".jpg", "mime": "image/jpeg", "size": 74.96, "url": "/uploads/b5deb586612e4c808272da9913b8109b.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T05:58:54.262Z", "updated_at": "2020-03-15T05:58:54.262Z" } }, { "id": 9, "title": "Unero Military Classical Backpack", "is_featured": false, "is_hot": false, "price": 42.2, "sale_price": 35.89, "vendor": "Young shop", "review": 3, "is_out_of_stock": false, "depot": 70, "inventory": 80, "is_active": true, "is_sale": true, "created_at": "2020-03-15T06:18:20.414Z", "updated_at": "2020-03-15T06:18:20.414Z", "variants": [], "images": [{ "id": 37, "name": "9a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "13fc9fc391d64652a0139f54cdac5c2b", "ext": ".jpg", "mime": "image/jpeg", "size": 43.02, "url": "/uploads/13fc9fc391d64652a0139f54cdac5c2b.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:18:20.533Z", "updated_at": "2020-03-15T06:18:20.533Z" }, { "id": 38, "name": "9b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "3d3ef24143bc473eb75a5721228e1f6d", "ext": ".jpg", "mime": "image/jpeg", "size": 50.61, "url": "/uploads/3d3ef24143bc473eb75a5721228e1f6d.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:18:20.573Z", "updated_at": "2020-03-15T06:18:20.573Z" }, { "id": 39, "name": "9c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "7420bed7be764af19c26f762296ff27d", "ext": ".jpg", "mime": "image/jpeg", "size": 44.06, "url": "/uploads/7420bed7be764af19c26f762296ff27d.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:18:20.596Z", "updated_at": "2020-03-15T06:18:20.596Z" }, { "id": 40, "name": "9d.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "10c4fdf0f6124ab79e5ab46dc2c52e38", "ext": ".jpg", "mime": "image/jpeg", "size": 47.73, "url": "/uploads/10c4fdf0f6124ab79e5ab46dc2c52e38.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:18:20.607Z", "updated_at": "2020-03-15T06:18:20.607Z" }], "thumbnail": { "id": 36, "name": "8.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "1e1f0f78e33d4ce7828d21465e84da7d", "ext": ".jpg", "mime": "image/jpeg", "size": 8.13, "url": "/uploads/1e1f0f78e33d4ce7828d21465e84da7d.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:18:20.459Z", "updated_at": "2020-03-15T06:18:20.459Z" } }, { "id": 10, "title": "Rayban Rounded Sunglass Brown Color", "is_featured": false, "is_hot": false, "price": 35.89, "sale_price": null, "vendor": "Young shop", "review": 5, "is_out_of_stock": false, "depot": 50, "inventory": 60, "is_active": true, "is_sale": false, "created_at": "2020-03-15T06:20:39.867Z", "updated_at": "2020-03-15T06:20:39.867Z", "variants": [], "images": [{ "id": 42, "name": "10a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "0208616a8daa44cbb20f12eaebf8de53", "ext": ".jpg", "mime": "image/jpeg", "size": 21.67, "url": "/uploads/0208616a8daa44cbb20f12eaebf8de53.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:20:39.908Z", "updated_at": "2020-03-15T06:20:39.908Z" }, { "id": 43, "name": "10b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "cba8c25fcf0d41d1aac41f05d8f7ad8e", "ext": ".jpg", "mime": "image/jpeg", "size": 20.16, "url": "/uploads/cba8c25fcf0d41d1aac41f05d8f7ad8e.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:20:39.925Z", "updated_at": "2020-03-15T06:20:39.925Z" }, { "id": 44, "name": "10c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "f8f22b0f8be04b559439dd7e7a4b9631", "ext": ".jpg", "mime": "image/jpeg", "size": 14.77, "url": "/uploads/f8f22b0f8be04b559439dd7e7a4b9631.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:20:39.935Z", "updated_at": "2020-03-15T06:20:39.935Z" }], "thumbnail": { "id": 41, "name": "9.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "0f04c128bb2945608bed459cdff45b2d", "ext": ".jpg", "mime": "image/jpeg", "size": 4.7, "url": "/uploads/0f04c128bb2945608bed459cdff45b2d.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:20:39.893Z", "updated_at": "2020-03-15T06:20:39.893Z" } }, { "id": 11, "title": "Sleeve Linen Blend Caro Pane Shirt", "is_featured": false, "is_hot": false, "price": 29.39, "sale_price": null, "vendor": "Go Pro", "review": 4, "is_out_of_stock": false, "depot": 65, "inventory": 80, "is_active": true, "is_sale": false, "created_at": "2020-03-15T06:22:44.237Z", "updated_at": "2020-03-15T06:22:44.237Z", "variants": [], "images": [{ "id": 46, "name": "11a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "ab27be4989234d5abcfb3f4ecc1af045", "ext": ".jpg", "mime": "image/jpeg", "size": 41.05, "url": "/uploads/ab27be4989234d5abcfb3f4ecc1af045.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:22:44.291Z", "updated_at": "2020-03-15T06:22:44.291Z" }, { "id": 47, "name": "11b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "fd27bd22be044fc89915d96cc85184a2", "ext": ".jpg", "mime": "image/jpeg", "size": 90.14, "url": "/uploads/fd27bd22be044fc89915d96cc85184a2.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:22:44.303Z", "updated_at": "2020-03-15T06:22:44.303Z" }, { "id": 48, "name": "11c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "d9860fd4f75847b08533072d216520a7", "ext": ".jpg", "mime": "image/jpeg", "size": 20.98, "url": "/uploads/d9860fd4f75847b08533072d216520a7.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:22:44.312Z", "updated_at": "2020-03-15T06:22:44.312Z" }, { "id": 49, "name": "11d.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "d25af4f6df2448579caf80399f625ec7", "ext": ".jpg", "mime": "image/jpeg", "size": 15.51, "url": "/uploads/d25af4f6df2448579caf80399f625ec7.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:22:44.321Z", "updated_at": "2020-03-15T06:22:44.321Z" }], "thumbnail": { "id": 45, "name": "10.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "77ac135e297b416388e2e10be368a898", "ext": ".jpg", "mime": "image/jpeg", "size": 13.67, "url": "/uploads/77ac135e297b416388e2e10be368a898.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:22:44.278Z", "updated_at": "2020-03-15T06:22:44.278Z" } }, { "id": 12, "title": "Mens Smith Sneaker InWhite Color", "is_featured": false, "is_hot": false, "price": 75.44, "sale_price": null, "vendor": "Global Office", "review": 4, "is_out_of_stock": false, "depot": 70, "inventory": 80, "is_active": true, "is_sale": false, "created_at": "2020-03-15T06:32:31.147Z", "updated_at": "2020-03-18T12:54:00.174Z", "variants": [], "images": [{ "id": 55, "name": "13a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "58092188da0c46858b8273fe7cfb16c1", "ext": ".jpg", "mime": "image/jpeg", "size": 33.4, "url": "/uploads/58092188da0c46858b8273fe7cfb16c1.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:32:31.197Z", "updated_at": "2020-03-15T06:32:31.197Z" }, { "id": 56, "name": "13b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "db91360ae9ac420c9172c2b797540c3f", "ext": ".jpg", "mime": "image/jpeg", "size": 10, "url": "/uploads/db91360ae9ac420c9172c2b797540c3f.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:32:31.215Z", "updated_at": "2020-03-15T06:32:31.215Z" }, { "id": 57, "name": "13c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "fd95618bdbc64b9fa835f03d4c992b63", "ext": ".jpg", "mime": "image/jpeg", "size": 23.2, "url": "/uploads/fd95618bdbc64b9fa835f03d4c992b63.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:32:31.223Z", "updated_at": "2020-03-15T06:32:31.223Z" }, { "id": 58, "name": "13d.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "974d2403fc62442db39bb155902fd6a0", "ext": ".jpg", "mime": "image/jpeg", "size": 13.81, "url": "/uploads/974d2403fc62442db39bb155902fd6a0.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:32:31.232Z", "updated_at": "2020-03-15T06:32:31.232Z" }], "thumbnail": { "id": 54, "name": "12.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "d903b17699d842f4ab1327eff18f04d0", "ext": ".jpg", "mime": "image/jpeg", "size": 4.9, "url": "/uploads/d903b17699d842f4ab1327eff18f04d0.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:32:31.177Z", "updated_at": "2020-03-15T06:32:31.177Z" } }] }, { "id": 2, "name": "Garden & Kitchen", "slug": "garden-and-kitchen", "description": null, "created_at": "2020-03-14T10:25:21.611Z", "updated_at": "2020-03-14T10:25:21.611Z", "products": [{ "id": 8, "title": "Korea Long Sofa Fabric In Blue Navy Color", "is_featured": false, "is_hot": false, "price": 670.2, "sale_price": 567.8, "vendor": "Youngshop", "review": 4, "is_out_of_stock": false, "depot": 85, "inventory": 79, "is_active": true, "is_sale": true, "created_at": "2020-03-15T06:15:55.939Z", "updated_at": "2020-03-15T06:15:55.939Z", "variants": [], "images": [{ "id": 32, "name": "8a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "caafb8f05561484a97923b235d2603f7", "ext": ".jpg", "mime": "image/jpeg", "size": 20.75, "url": "/uploads/caafb8f05561484a97923b235d2603f7.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:15:56.021Z", "updated_at": "2020-03-15T06:15:56.021Z" }, { "id": 33, "name": "8b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "ea26eeafaa1747b5857ee73c93430261", "ext": ".jpg", "mime": "image/jpeg", "size": 26.42, "url": "/uploads/ea26eeafaa1747b5857ee73c93430261.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:15:56.038Z", "updated_at": "2020-03-15T06:15:56.038Z" }, { "id": 34, "name": "8c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "97b54a32f4864342bc485c7929de6366", "ext": ".jpg", "mime": "image/jpeg", "size": 19.04, "url": "/uploads/97b54a32f4864342bc485c7929de6366.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:15:56.047Z", "updated_at": "2020-03-15T06:15:56.047Z" }, { "id": 35, "name": "8d.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "210d685d19f84c8b9e5de231176b4cf2", "ext": ".jpg", "mime": "image/jpeg", "size": 155.83, "url": "/uploads/210d685d19f84c8b9e5de231176b4cf2.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:15:56.057Z", "updated_at": "2020-03-15T06:15:56.057Z" }], "thumbnail": { "id": 31, "name": "7.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "04ec8d58423647c98d6dbd3544c1c355", "ext": ".jpg", "mime": "image/jpeg", "size": 3.63, "url": "/uploads/04ec8d58423647c98d6dbd3544c1c355.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:15:55.999Z", "updated_at": "2020-03-15T06:15:55.999Z" } }, { "id": 26, "title": "Simple Plastice Chair In White Color", "is_featured": false, "is_hot": false, "price": 60, "sale_price": 42, "vendor": "Young Shop", "review": 2, "is_out_of_stock": false, "depot": 70, "inventory": 80, "is_active": true, "is_sale": true, "created_at": "2020-03-15T07:23:26.180Z", "updated_at": "2020-03-15T07:23:26.180Z", "variants": [], "images": [{ "id": 118, "name": "27a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "e8c3cd4a32bd4baa9772aa080594d756", "ext": ".jpg", "mime": "image/jpeg", "size": 22.57, "url": "/uploads/e8c3cd4a32bd4baa9772aa080594d756.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T07:23:26.212Z", "updated_at": "2020-03-15T07:23:26.212Z" }, { "id": 119, "name": "27b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "4f482d2091c94fe6b2f9216e1652ad11", "ext": ".jpg", "mime": "image/jpeg", "size": 15.18, "url": "/uploads/4f482d2091c94fe6b2f9216e1652ad11.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T07:23:26.222Z", "updated_at": "2020-03-15T07:23:26.222Z" }, { "id": 120, "name": "27c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "fe5b2973ad694105b20eee9917e1491c", "ext": ".jpg", "mime": "image/jpeg", "size": 17.18, "url": "/uploads/fe5b2973ad694105b20eee9917e1491c.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T07:23:26.237Z", "updated_at": "2020-03-15T07:23:26.237Z" }, { "id": 121, "name": "27d.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "6b8716a6edc84d0191c9411e84335189", "ext": ".jpg", "mime": "image/jpeg", "size": 46.91, "url": "/uploads/6b8716a6edc84d0191c9411e84335189.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T07:23:26.251Z", "updated_at": "2020-03-15T07:23:26.251Z" }], "thumbnail": { "id": 117, "name": "3.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "c9bc200f332d47e48d4cfa68018c415c", "ext": ".jpg", "mime": "image/jpeg", "size": 4.33, "url": "/uploads/c9bc200f332d47e48d4cfa68018c415c.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T07:23:26.200Z", "updated_at": "2020-03-15T07:23:26.200Z" } }, { "id": 27, "title": "Korea Fabric Chair In Brown Color", "is_featured": false, "is_hot": false, "price": 320, "sale_price": null, "vendor": "Global Office", "review": 1, "is_out_of_stock": true, "depot": 65, "inventory": 80, "is_active": true, "is_sale": false, "created_at": "2020-03-15T07:26:02.264Z", "updated_at": "2020-03-15T07:26:02.264Z", "variants": [], "images": [{ "id": 123, "name": "28a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "8d2cd1d8755348b6bbd46c4216599640", "ext": ".jpg", "mime": "image/jpeg", "size": 145.11, "url": "/uploads/8d2cd1d8755348b6bbd46c4216599640.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T07:26:02.297Z", "updated_at": "2020-03-15T07:26:02.297Z" }, { "id": 124, "name": "28b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "925471220e1d47d082cd932b253e6666", "ext": ".jpg", "mime": "image/jpeg", "size": 37.46, "url": "/uploads/925471220e1d47d082cd932b253e6666.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T07:26:02.305Z", "updated_at": "2020-03-15T07:26:02.305Z" }, { "id": 125, "name": "28c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "a92af1e9436d4bdea3c0bef7ab6beccb", "ext": ".jpg", "mime": "image/jpeg", "size": 46.35, "url": "/uploads/a92af1e9436d4bdea3c0bef7ab6beccb.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T07:26:02.316Z", "updated_at": "2020-03-15T07:26:02.316Z" }, { "id": 126, "name": "28d.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "43ffb2ae9d3a4fd28097c7ba63dd5b22", "ext": ".jpg", "mime": "image/jpeg", "size": 64.39, "url": "/uploads/43ffb2ae9d3a4fd28097c7ba63dd5b22.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T07:26:02.324Z", "updated_at": "2020-03-15T07:26:02.324Z" }], "thumbnail": { "id": 122, "name": "4.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "afd6ccaff3fe4895903ec49b51b181d0", "ext": ".jpg", "mime": "image/jpeg", "size": 9.48, "url": "/uploads/afd6ccaff3fe4895903ec49b51b181d0.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T07:26:02.287Z", "updated_at": "2020-03-15T07:26:02.287Z" } }, { "id": 28, "title": "Set 14-Piece Knife From KichiKit", "is_featured": false, "is_hot": false, "price": 85, "sale_price": null, "vendor": "Global Office", "review": 3, "is_out_of_stock": true, "depot": 50, "inventory": 60, "is_active": true, "is_sale": false, "created_at": "2020-03-15T07:28:12.906Z", "updated_at": "2020-03-18T13:03:00.440Z", "variants": [], "images": [{ "id": 128, "name": "29a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "8570a56296b2470caa2b397e5bc9bf6d", "ext": ".jpg", "mime": "image/jpeg", "size": 42.03, "url": "/uploads/8570a56296b2470caa2b397e5bc9bf6d.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T07:28:12.949Z", "updated_at": "2020-03-15T07:28:12.949Z" }, { "id": 129, "name": "29b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "b271346821b54da68da7abc985db2400", "ext": ".jpg", "mime": "image/jpeg", "size": 16.61, "url": "/uploads/b271346821b54da68da7abc985db2400.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T07:28:12.958Z", "updated_at": "2020-03-15T07:28:12.958Z" }, { "id": 130, "name": "29c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "c5b77535a1754dcb9ccaead467a354e6", "ext": ".jpg", "mime": "image/jpeg", "size": 18.64, "url": "/uploads/c5b77535a1754dcb9ccaead467a354e6.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T07:28:12.965Z", "updated_at": "2020-03-15T07:28:12.965Z" }, { "id": 131, "name": "29d.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "d58dd5cc5f824bd5af8e729503867653", "ext": ".jpg", "mime": "image/jpeg", "size": 17.77, "url": "/uploads/d58dd5cc5f824bd5af8e729503867653.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T07:28:12.977Z", "updated_at": "2020-03-15T07:28:12.977Z" }], "thumbnail": { "id": 127, "name": "5.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "e6965d2ab9ef4537ab17517394fe9ce4", "ext": ".jpg", "mime": "image/jpeg", "size": 8.32, "url": "/uploads/e6965d2ab9ef4537ab17517394fe9ce4.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T07:28:12.939Z", "updated_at": "2020-03-15T07:28:12.939Z" } }, { "id": 30, "title": "Letter Printed Cushion Cover Cotton", "is_featured": false, "is_hot": false, "price": 60, "sale_price": 42, "vendor": "Young Shop", "review": 2, "is_out_of_stock": false, "depot": 60, "inventory": 80, "is_active": true, "is_sale": true, "created_at": "2020-03-15T09:01:33.601Z", "updated_at": "2020-03-15T09:01:33.601Z", "variants": [], "images": [{ "id": 137, "name": "7.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "cca3c5bbc1f4412aad6cf03cf87d81e8", "ext": ".jpg", "mime": "image/jpeg", "size": 11.61, "url": "/uploads/cca3c5bbc1f4412aad6cf03cf87d81e8.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T09:01:33.634Z", "updated_at": "2020-03-15T09:01:33.634Z" }], "thumbnail": { "id": 136, "name": "7.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "aefd853e2fd942bb860b9eb4d8b8d7c0", "ext": ".jpg", "mime": "image/jpeg", "size": 11.61, "url": "/uploads/aefd853e2fd942bb860b9eb4d8b8d7c0.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T09:01:33.622Z", "updated_at": "2020-03-15T09:01:33.622Z" } }, { "id": 45, "title": "Wood Simple Tea Table", "is_featured": false, "is_hot": false, "price": 393.38, "sale_price": null, "vendor": "Global Office", "review": 3, "is_out_of_stock": false, "depot": 70, "inventory": 80, "is_active": true, "is_sale": false, "created_at": "2020-03-15T12:49:54.993Z", "updated_at": "2020-03-15T12:49:54.993Z", "variants": [], "images": [{ "id": 176, "name": "46a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "21b0d78f72b64f3e8b92cf194e499b7a", "ext": ".jpg", "mime": "image/jpeg", "size": 36.64, "url": "/uploads/21b0d78f72b64f3e8b92cf194e499b7a.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T12:49:55.046Z", "updated_at": "2020-03-15T12:49:55.046Z" }, { "id": 177, "name": "46b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "c9c68e1ace634ee69ced00590d3e4aa1", "ext": ".jpg", "mime": "image/jpeg", "size": 13.92, "url": "/uploads/c9c68e1ace634ee69ced00590d3e4aa1.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T12:49:55.055Z", "updated_at": "2020-03-15T12:49:55.055Z" }, { "id": 178, "name": "46c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "6ee8e30510df4e88a2807b38e38838ed", "ext": ".jpg", "mime": "image/jpeg", "size": 13.48, "url": "/uploads/6ee8e30510df4e88a2807b38e38838ed.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T12:49:55.065Z", "updated_at": "2020-03-15T12:49:55.065Z" }, { "id": 179, "name": "46d.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "61f9d89dc3cf4161b157d7b969111cc9", "ext": ".jpg", "mime": "image/jpeg", "size": 93.96, "url": "/uploads/61f9d89dc3cf4161b157d7b969111cc9.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T12:49:55.075Z", "updated_at": "2020-03-15T12:49:55.075Z" }], "thumbnail": { "id": 175, "name": "8.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "3192b332d84248d0870b62db15ea79b6", "ext": ".jpg", "mime": "image/jpeg", "size": 3.97, "url": "/uploads/3192b332d84248d0870b62db15ea79b6.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T12:49:55.032Z", "updated_at": "2020-03-15T12:49:55.032Z" } }, { "id": 46, "title": "Simple Plastic Chair In Gray Color", "is_featured": false, "is_hot": false, "price": 50, "sale_price": 25, "vendor": "Young Shop", "review": 5, "is_out_of_stock": false, "depot": 70, "inventory": 80, "is_active": true, "is_sale": true, "created_at": "2020-03-15T12:50:58.066Z", "updated_at": "2020-03-15T12:50:58.066Z", "variants": [], "images": [{ "id": 343, "name": "47a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "c34777c27dd44d6ab517cf5e5f0d3e67", "ext": ".jpg", "mime": "image/jpeg", "size": 76.72, "url": "/uploads/c34777c27dd44d6ab517cf5e5f0d3e67.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T12:49:00.500Z", "updated_at": "2020-03-18T12:49:00.500Z" }, { "id": 344, "name": "47b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "f5ca8fbda1cd45ccaa57e0dcf1692fb3", "ext": ".jpg", "mime": "image/jpeg", "size": 14.54, "url": "/uploads/f5ca8fbda1cd45ccaa57e0dcf1692fb3.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T12:49:00.510Z", "updated_at": "2020-03-18T12:49:00.510Z" }, { "id": 345, "name": "47c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "c3add993354d431c8f96405755a8099c", "ext": ".jpg", "mime": "image/jpeg", "size": 21.15, "url": "/uploads/c3add993354d431c8f96405755a8099c.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T12:49:00.524Z", "updated_at": "2020-03-18T12:49:00.524Z" }, { "id": 346, "name": "47d.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "b0cefaa6a3d24a82a5e4cb2c1c4bb134", "ext": ".jpg", "mime": "image/jpeg", "size": 66.49, "url": "/uploads/b0cefaa6a3d24a82a5e4cb2c1c4bb134.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T12:49:00.535Z", "updated_at": "2020-03-18T12:49:00.535Z" }], "thumbnail": { "id": 342, "name": "10.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "72190536af1245b48cac7925c4318e37", "ext": ".jpg", "mime": "image/jpeg", "size": 6.38, "url": "/uploads/72190536af1245b48cac7925c4318e37.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T12:49:00.488Z", "updated_at": "2020-03-18T12:49:00.488Z" } }, { "id": 47, "title": "Korea Small Wood 4 Boxes Storage", "is_featured": false, "is_hot": false, "price": 64, "sale_price": null, "vendor": "Global Office", "review": 4, "is_out_of_stock": false, "depot": 70, "inventory": 90, "is_active": true, "is_sale": false, "created_at": "2020-03-15T12:54:01.621Z", "updated_at": "2020-03-15T12:54:01.621Z", "variants": [], "images": [{ "id": 181, "name": "48a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "58cb2976791443a496b80e3cd5d55a4e", "ext": ".jpg", "mime": "image/jpeg", "size": 78.37, "url": "/uploads/58cb2976791443a496b80e3cd5d55a4e.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T12:54:01.663Z", "updated_at": "2020-03-15T12:54:01.663Z" }, { "id": 182, "name": "48b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "89cc985082fa4ca7b8cb455f13e7c3eb", "ext": ".jpg", "mime": "image/jpeg", "size": 23.31, "url": "/uploads/89cc985082fa4ca7b8cb455f13e7c3eb.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T12:54:01.676Z", "updated_at": "2020-03-15T12:54:01.676Z" }, { "id": 183, "name": "48c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "b51695a23f704bb0bc62a97e154efba5", "ext": ".jpg", "mime": "image/jpeg", "size": 23.12, "url": "/uploads/b51695a23f704bb0bc62a97e154efba5.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T12:54:01.686Z", "updated_at": "2020-03-15T12:54:01.686Z" }, { "id": 184, "name": "48d.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "05982ca9a3a64d6391366bc6103884e6", "ext": ".jpg", "mime": "image/jpeg", "size": 22.18, "url": "/uploads/05982ca9a3a64d6391366bc6103884e6.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T12:54:01.696Z", "updated_at": "2020-03-15T12:54:01.696Z" }], "thumbnail": { "id": 180, "name": "9.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "664f3ea44e7f44b5bb726d0a78a6eaec", "ext": ".jpg", "mime": "image/jpeg", "size": 8.13, "url": "/uploads/664f3ea44e7f44b5bb726d0a78a6eaec.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T12:54:01.652Z", "updated_at": "2020-03-15T12:54:01.652Z" } }, { "id": 49, "title": "Claure Austin Lover Round Chair White Wooden", "is_featured": false, "is_hot": false, "price": 99.59, "sale_price": null, "vendor": "Global Office", "review": 5, "is_out_of_stock": false, "depot": 70, "inventory": 80, "is_active": true, "is_sale": false, "created_at": "2020-03-15T12:57:21.759Z", "updated_at": "2020-03-15T12:57:21.759Z", "variants": [], "images": [{ "id": 191, "name": "50a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "f8bb5ccd1eb5459e9fc33d2f45b74e60", "ext": ".jpg", "mime": "image/jpeg", "size": 33.03, "url": "/uploads/f8bb5ccd1eb5459e9fc33d2f45b74e60.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T12:57:21.788Z", "updated_at": "2020-03-15T12:57:21.788Z" }, { "id": 192, "name": "50b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "82c418256f2e4264a3e9aed0c9264335", "ext": ".jpg", "mime": "image/jpeg", "size": 10.77, "url": "/uploads/82c418256f2e4264a3e9aed0c9264335.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T12:57:21.796Z", "updated_at": "2020-03-15T12:57:21.796Z" }, { "id": 193, "name": "50c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "65550a2a55ce4f9ea2d4599c9cffd43a", "ext": ".jpg", "mime": "image/jpeg", "size": 12.36, "url": "/uploads/65550a2a55ce4f9ea2d4599c9cffd43a.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T12:57:21.805Z", "updated_at": "2020-03-15T12:57:21.805Z" }, { "id": 194, "name": "50d.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "a18fd4de58f34496abb40f38d3dacdf9", "ext": ".jpg", "mime": "image/jpeg", "size": 11.28, "url": "/uploads/a18fd4de58f34496abb40f38d3dacdf9.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T12:57:21.812Z", "updated_at": "2020-03-15T12:57:21.812Z" }], "thumbnail": { "id": 190, "name": "1.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "d36aa60d7915475abcbb346de7274cac", "ext": ".jpg", "mime": "image/jpeg", "size": 5.79, "url": "/uploads/d36aa60d7915475abcbb346de7274cac.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T12:57:21.777Z", "updated_at": "2020-03-15T12:57:21.777Z" } }, { "id": 50, "title": "Letter Printed Cushion Cover Cotton Throw Pillow", "is_featured": false, "is_hot": false, "price": 13.59, "sale_price": null, "vendor": "Global Office", "review": 4, "is_out_of_stock": false, "depot": 70, "inventory": 80, "is_active": true, "is_sale": false, "created_at": "2020-03-15T12:59:25.253Z", "updated_at": "2020-03-15T12:59:25.253Z", "variants": [], "images": [{ "id": 196, "name": "4.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "5a21858f28fe470bab05f9e839eedbdf", "ext": ".jpg", "mime": "image/jpeg", "size": 11.61, "url": "/uploads/5a21858f28fe470bab05f9e839eedbdf.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T12:59:25.285Z", "updated_at": "2020-03-15T12:59:25.285Z" }], "thumbnail": { "id": 195, "name": "4.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "e446cc5b6ed3433f9ef5aa3c1373bf18", "ext": ".jpg", "mime": "image/jpeg", "size": 11.61, "url": "/uploads/e446cc5b6ed3433f9ef5aa3c1373bf18.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T12:59:25.275Z", "updated_at": "2020-03-15T12:59:25.275Z" } }, { "id": 51, "title": "Simple Short TV Board Combine Book Shelf", "is_featured": false, "is_hot": false, "price": 13.59, "sale_price": null, "vendor": "Global Office", "review": 5, "is_out_of_stock": false, "depot": 50, "inventory": 60, "is_active": true, "is_sale": false, "created_at": "2020-03-15T13:00:41.375Z", "updated_at": "2020-03-15T13:00:41.375Z", "variants": [], "images": [{ "id": 198, "name": "5.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "a1a08a0b292846089662206d92c858bf", "ext": ".jpg", "mime": "image/jpeg", "size": 5.07, "url": "/uploads/a1a08a0b292846089662206d92c858bf.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T13:01:18.571Z", "updated_at": "2020-03-15T13:01:18.571Z" }], "thumbnail": { "id": 197, "name": "5.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "2af891b3cc034320b2ef6b792542cba4", "ext": ".jpg", "mime": "image/jpeg", "size": 5.07, "url": "/uploads/2af891b3cc034320b2ef6b792542cba4.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T13:01:18.560Z", "updated_at": "2020-03-15T13:01:18.560Z" } }, { "id": 52, "title": "Simple Tea Teable With Glass Surface", "is_featured": false, "is_hot": false, "price": 249.59, "sale_price": null, "vendor": "Global Office", "review": 5, "is_out_of_stock": false, "depot": 70, "inventory": 80, "is_active": true, "is_sale": false, "created_at": "2020-03-15T13:28:05.503Z", "updated_at": "2020-03-15T13:28:05.503Z", "variants": [], "images": [{ "id": 200, "name": "53a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "4ad7f87094984babac0a22a9f8447eb2", "ext": ".jpg", "mime": "image/jpeg", "size": 24.93, "url": "/uploads/4ad7f87094984babac0a22a9f8447eb2.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T13:28:05.541Z", "updated_at": "2020-03-15T13:28:05.541Z" }, { "id": 201, "name": "53b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "8929c017e8324986911ae5b70798728e", "ext": ".jpg", "mime": "image/jpeg", "size": 16.98, "url": "/uploads/8929c017e8324986911ae5b70798728e.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T13:28:05.551Z", "updated_at": "2020-03-15T13:28:05.551Z" }, { "id": 202, "name": "53c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "500e7a2bbf424d6ab4c3b7ec70af33e5", "ext": ".jpg", "mime": "image/jpeg", "size": 25.08, "url": "/uploads/500e7a2bbf424d6ab4c3b7ec70af33e5.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T13:28:05.559Z", "updated_at": "2020-03-15T13:28:05.559Z" }], "thumbnail": { "id": 199, "name": "6.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "98b96e736fa744a5ab7ed83354d97536", "ext": ".jpg", "mime": "image/jpeg", "size": 3.93, "url": "/uploads/98b96e736fa744a5ab7ed83354d97536.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T13:28:05.531Z", "updated_at": "2020-03-15T13:28:05.531Z" } }] }, { "id": 3, "name": "Consumer Electrics", "slug": "consumer-electrics", "description": null, "created_at": "2020-03-14T10:25:39.408Z", "updated_at": "2020-03-14T10:25:39.408Z", "products": [{ "id": 3, "title": "Marshall Kilburn Portable Wireless Speaker", "is_featured": false, "is_hot": false, "price": 42.99, "sale_price": null, "vendor": "Go Pro", "review": 5, "is_out_of_stock": false, "depot": 85, "inventory": 100, "is_active": true, "is_sale": false, "created_at": "2020-03-15T05:55:19.349Z", "updated_at": "2020-03-15T05:55:19.349Z", "variants": [], "images": [{ "id": 10, "name": "1.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "3398b7a330154c9390db4495b9e3d413", "ext": ".jpg", "mime": "image/jpeg", "size": 158.75, "url": "/uploads/3398b7a330154c9390db4495b9e3d413.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T05:55:19.403Z", "updated_at": "2020-03-15T05:55:19.403Z" }, { "id": 11, "name": "2.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "73b00542e06e4d008945bc701959472b", "ext": ".jpg", "mime": "image/jpeg", "size": 44.03, "url": "/uploads/73b00542e06e4d008945bc701959472b.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T05:55:19.415Z", "updated_at": "2020-03-15T05:55:19.415Z" }, { "id": 12, "name": "3.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "f0647af5998446e1a6a1906996014a0a", "ext": ".jpg", "mime": "image/jpeg", "size": 69.23, "url": "/uploads/f0647af5998446e1a6a1906996014a0a.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T05:55:19.425Z", "updated_at": "2020-03-15T05:55:19.425Z" }], "thumbnail": { "id": 9, "name": "2.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "feaeaa8c5d24474e943f57a7df55e921", "ext": ".jpg", "mime": "image/jpeg", "size": 15.15, "url": "/uploads/feaeaa8c5d24474e943f57a7df55e921.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T05:55:19.385Z", "updated_at": "2020-03-15T05:55:19.385Z" } }, { "id": 19, "title": "EPSION Plaster Printer", "is_featured": false, "is_hot": false, "price": 233.28, "sale_price": null, "vendor": "Robert's Store", "review": 4, "is_out_of_stock": false, "depot": 40, "inventory": 50, "is_active": true, "is_sale": false, "created_at": "2020-03-15T06:46:44.313Z", "updated_at": "2020-03-15T06:46:44.313Z", "variants": [], "images": [{ "id": 85, "name": "19a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "d9a512ac366049e79ed4430f63258646", "ext": ".jpg", "mime": "image/jpeg", "size": 36.78, "url": "/uploads/d9a512ac366049e79ed4430f63258646.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:46:44.345Z", "updated_at": "2020-03-15T06:46:44.345Z" }, { "id": 86, "name": "19b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "37e8bc461d034b42886a2f5a675c723b", "ext": ".jpg", "mime": "image/jpeg", "size": 10.65, "url": "/uploads/37e8bc461d034b42886a2f5a675c723b.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:46:44.353Z", "updated_at": "2020-03-15T06:46:44.353Z" }, { "id": 87, "name": "19c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "0db1b9f735034ad9927e5544d4c2f916", "ext": ".jpg", "mime": "image/jpeg", "size": 12.91, "url": "/uploads/0db1b9f735034ad9927e5544d4c2f916.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:46:44.361Z", "updated_at": "2020-03-15T06:46:44.361Z" }, { "id": 88, "name": "19d.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "2d276d5621274050b2126bd8d2c6f3d2", "ext": ".jpg", "mime": "image/jpeg", "size": 14.67, "url": "/uploads/2d276d5621274050b2126bd8d2c6f3d2.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:46:44.369Z", "updated_at": "2020-03-15T06:46:44.369Z" }], "thumbnail": { "id": 84, "name": "19.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "6feffd7531c2463f9289a1dbe6cf0eb2", "ext": ".jpg", "mime": "image/jpeg", "size": 8.32, "url": "/uploads/6feffd7531c2463f9289a1dbe6cf0eb2.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:46:44.335Z", "updated_at": "2020-03-15T06:46:44.335Z" } }, { "id": 20, "title": "EPSION Plaster Printer 2", "is_featured": false, "is_hot": false, "price": 299.28, "sale_price": null, "vendor": "Robert's Store", "review": 4, "is_out_of_stock": false, "depot": 70, "inventory": 80, "is_active": true, "is_sale": false, "created_at": "2020-03-15T06:51:40.586Z", "updated_at": "2020-03-15T06:51:40.586Z", "variants": [], "images": [{ "id": 90, "name": "19a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "c1445934392c4fa2a247db732b39930b", "ext": ".jpg", "mime": "image/jpeg", "size": 36.78, "url": "/uploads/c1445934392c4fa2a247db732b39930b.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:51:40.623Z", "updated_at": "2020-03-15T06:51:40.623Z" }, { "id": 91, "name": "19b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "94a5b77dccdc43d79683a092ffa12adc", "ext": ".jpg", "mime": "image/jpeg", "size": 10.65, "url": "/uploads/94a5b77dccdc43d79683a092ffa12adc.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:51:40.643Z", "updated_at": "2020-03-15T06:51:40.643Z" }, { "id": 92, "name": "19c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "aea18f347cb34f54add389580fd52e53", "ext": ".jpg", "mime": "image/jpeg", "size": 12.91, "url": "/uploads/aea18f347cb34f54add389580fd52e53.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:51:40.653Z", "updated_at": "2020-03-15T06:51:40.653Z" }, { "id": 93, "name": "19d.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "c3ed6617023f458d99388ca01f6af619", "ext": ".jpg", "mime": "image/jpeg", "size": 14.67, "url": "/uploads/c3ed6617023f458d99388ca01f6af619.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:51:40.670Z", "updated_at": "2020-03-15T06:51:40.670Z" }], "thumbnail": { "id": 89, "name": "19.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "9c3e74c3b8e04684ba6c8cd333bdc8ec", "ext": ".jpg", "mime": "image/jpeg", "size": 8.32, "url": "/uploads/9c3e74c3b8e04684ba6c8cd333bdc8ec.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:51:40.609Z", "updated_at": "2020-03-15T06:51:40.609Z" } }, { "id": 21, "title": "LG White Front Load Steam Washer", "is_featured": false, "is_hot": false, "price": 1422.7, "sale_price": 1025.5, "vendor": "Young Shop", "review": 5, "is_out_of_stock": false, "depot": 65, "inventory": 75, "is_active": true, "is_sale": true, "created_at": "2020-03-15T06:54:51.696Z", "updated_at": "2020-03-15T06:54:51.696Z", "variants": [], "images": [{ "id": 95, "name": "21a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "a88b749bd3bb49a6be93a362099c8295", "ext": ".jpg", "mime": "image/jpeg", "size": 46.36, "url": "/uploads/a88b749bd3bb49a6be93a362099c8295.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:54:51.730Z", "updated_at": "2020-03-15T06:54:51.730Z" }, { "id": 96, "name": "22a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "8fcfcb5d0c694660b1906eda13290a82", "ext": ".jpg", "mime": "image/jpeg", "size": 68.23, "url": "/uploads/8fcfcb5d0c694660b1906eda13290a82.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:54:51.739Z", "updated_at": "2020-03-15T06:54:51.739Z" }], "thumbnail": { "id": 94, "name": "20.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "95aa7cb09ba04ce2b529ebceabb6f02c", "ext": ".jpg", "mime": "image/jpeg", "size": 8.71, "url": "/uploads/95aa7cb09ba04ce2b529ebceabb6f02c.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:54:51.718Z", "updated_at": "2020-03-15T06:54:51.718Z" } }, { "id": 25, "title": "Aroma Rice Cooker", "is_featured": false, "is_hot": false, "price": 101.99, "sale_price": null, "vendor": "Global Office", "review": 1, "is_out_of_stock": true, "depot": 50, "inventory": 60, "is_active": true, "is_sale": false, "created_at": "2020-03-15T07:09:29.699Z", "updated_at": "2020-03-15T07:09:29.699Z", "variants": [], "images": [{ "id": 113, "name": "26a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "696dd71cf0fc48dca751de388cc8613f", "ext": ".jpg", "mime": "image/jpeg", "size": 40.83, "url": "/uploads/696dd71cf0fc48dca751de388cc8613f.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T07:09:29.746Z", "updated_at": "2020-03-15T07:09:29.746Z" }, { "id": 114, "name": "26b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "d350a3a6a0044d83bc72c68176dcb5ab", "ext": ".jpg", "mime": "image/jpeg", "size": 25.9, "url": "/uploads/d350a3a6a0044d83bc72c68176dcb5ab.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T07:09:29.758Z", "updated_at": "2020-03-15T07:09:29.758Z" }, { "id": 115, "name": "26c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "fa26ea0d67e846b3af930df9f02c96d1", "ext": ".jpg", "mime": "image/jpeg", "size": 32.9, "url": "/uploads/fa26ea0d67e846b3af930df9f02c96d1.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T07:09:29.767Z", "updated_at": "2020-03-15T07:09:29.767Z" }, { "id": 116, "name": "26d.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "c5e80f9757f94639ba6c70a974cddd39", "ext": ".jpg", "mime": "image/jpeg", "size": 16.87, "url": "/uploads/c5e80f9757f94639ba6c70a974cddd39.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T07:09:29.774Z", "updated_at": "2020-03-15T07:09:29.774Z" }], "thumbnail": { "id": 112, "name": "2.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "d5c5d5570e1046f080ad62c7e35fe56d", "ext": ".jpg", "mime": "image/jpeg", "size": 9.06, "url": "/uploads/d5c5d5570e1046f080ad62c7e35fe56d.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T07:09:29.729Z", "updated_at": "2020-03-15T07:09:29.729Z" } }, { "id": 29, "title": "Magic Bullet NutriBullet Pro 900 Series Blender", "is_featured": false, "is_hot": false, "price": 92, "sale_price": null, "vendor": "Global Store", "review": 1, "is_out_of_stock": true, "depot": 80, "inventory": 90, "is_active": true, "is_sale": false, "created_at": "2020-03-15T07:29:47.468Z", "updated_at": "2020-03-18T12:51:46.229Z", "variants": [], "images": [{ "id": 132, "name": "30a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "a6ac678bb7224277b0ba5b57bd274704", "ext": ".jpg", "mime": "image/jpeg", "size": 46.73, "url": "/uploads/a6ac678bb7224277b0ba5b57bd274704.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T07:29:47.489Z", "updated_at": "2020-03-15T07:29:47.489Z" }, { "id": 133, "name": "30b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "9de8de5d5f774d518615bda72a646796", "ext": ".jpg", "mime": "image/jpeg", "size": 10.44, "url": "/uploads/9de8de5d5f774d518615bda72a646796.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T07:29:47.498Z", "updated_at": "2020-03-15T07:29:47.498Z" }, { "id": 134, "name": "30c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "db40275d06b04adc828ba08708062ad8", "ext": ".jpg", "mime": "image/jpeg", "size": 11.1, "url": "/uploads/db40275d06b04adc828ba08708062ad8.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T07:29:47.507Z", "updated_at": "2020-03-15T07:29:47.507Z" }, { "id": 135, "name": "30d.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "e4b8c056a206487a8bbf279727e2ed1e", "ext": ".jpg", "mime": "image/jpeg", "size": 8.84, "url": "/uploads/e4b8c056a206487a8bbf279727e2ed1e.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T07:29:47.523Z", "updated_at": "2020-03-15T07:29:47.523Z" }], "thumbnail": { "id": 347, "name": "6.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "20c71a1cecd047928f943f23a58c05f8", "ext": ".jpg", "mime": "image/jpeg", "size": 9.74, "url": "/uploads/20c71a1cecd047928f943f23a58c05f8.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T12:51:46.247Z", "updated_at": "2020-03-18T12:51:46.247Z" } }, { "id": 38, "title": "TCL 47-inch 4K Ultra HD Smart TV", "is_featured": false, "is_hot": false, "price": 670, "sale_price": 567.99, "vendor": "Go Pro", "review": 4, "is_out_of_stock": false, "depot": 70, "inventory": 80, "is_active": true, "is_sale": true, "created_at": "2020-03-15T09:43:05.580Z", "updated_at": "2020-03-18T12:58:10.870Z", "variants": [], "images": [{ "id": 158, "name": "12.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "5e0bff934b5d4a958af9122a1ee91d41", "ext": ".jpg", "mime": "image/jpeg", "size": 8.62, "url": "/uploads/5e0bff934b5d4a958af9122a1ee91d41.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T09:43:05.611Z", "updated_at": "2020-03-15T09:43:05.611Z" }], "thumbnail": { "id": 157, "name": "12.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "4e95e8c4956941099aa132a86b0086db", "ext": ".jpg", "mime": "image/jpeg", "size": 8.62, "url": "/uploads/4e95e8c4956941099aa132a86b0086db.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T09:43:05.600Z", "updated_at": "2020-03-15T09:43:05.600Z" } }, { "id": 40, "title": "LG Electrolux 500L Inverte Washing Machine", "is_featured": false, "is_hot": false, "price": 360, "sale_price": 342, "vendor": "Young Shop", "review": 4, "is_out_of_stock": false, "depot": 70, "inventory": 80, "is_active": true, "is_sale": true, "created_at": "2020-03-15T09:46:00.538Z", "updated_at": "2020-03-15T09:46:00.538Z", "variants": [], "images": [{ "id": 162, "name": "7.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "46f0cfa3ec174e42b98e26e000dda8f1", "ext": ".jpg", "mime": "image/jpeg", "size": 8.71, "url": "/uploads/46f0cfa3ec174e42b98e26e000dda8f1.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T09:46:00.580Z", "updated_at": "2020-03-15T09:46:00.580Z" }], "thumbnail": { "id": 161, "name": "7.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "158cc93d2c404e53b93b06c64997d02f", "ext": ".jpg", "mime": "image/jpeg", "size": 8.71, "url": "/uploads/158cc93d2c404e53b93b06c64997d02f.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T09:46:00.568Z", "updated_at": "2020-03-15T09:46:00.568Z" } }, { "id": 41, "title": "Panasonic Invertr 900L Refrigerator", "is_featured": false, "is_hot": false, "price": 720, "sale_price": null, "vendor": "Global Office", "review": 4, "is_out_of_stock": false, "depot": 70, "inventory": 80, "is_active": true, "is_sale": false, "created_at": "2020-03-15T09:47:24.554Z", "updated_at": "2020-03-15T09:47:24.554Z", "variants": [], "images": [{ "id": 341, "name": "15.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "9778f73b10ad4a939769a79c0a877c43", "ext": ".jpg", "mime": "image/jpeg", "size": 4.09, "url": "/uploads/9778f73b10ad4a939769a79c0a877c43.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T12:47:55.740Z", "updated_at": "2020-03-18T12:47:55.740Z" }], "thumbnail": { "id": 340, "name": "15.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "a3381403e8474758922ee65bbf2eea22", "ext": ".jpg", "mime": "image/jpeg", "size": 4.09, "url": "/uploads/a3381403e8474758922ee65bbf2eea22.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T12:47:55.731Z", "updated_at": "2020-03-18T12:47:55.731Z" } }, { "id": 53, "title": "Stadler Form Otto African Sapele Wood", "is_featured": false, "is_hot": false, "price": 127.59, "sale_price": null, "vendor": "Global Office", "review": 4, "is_out_of_stock": false, "depot": 70, "inventory": 80, "is_active": true, "is_sale": false, "created_at": "2020-03-15T13:29:47.964Z", "updated_at": "2020-03-15T13:29:47.964Z", "variants": [], "images": [{ "id": 204, "name": "54a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "0cc34763c9cc4957a77b5578cfd3147b", "ext": ".jpg", "mime": "image/jpeg", "size": 504.06, "url": "/uploads/0cc34763c9cc4957a77b5578cfd3147b.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T13:29:48.003Z", "updated_at": "2020-03-15T13:29:48.003Z" }, { "id": 205, "name": "54b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "e4b335c24d1544bfb20410b1f95d7149", "ext": ".jpg", "mime": "image/jpeg", "size": 20.85, "url": "/uploads/e4b335c24d1544bfb20410b1f95d7149.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T13:29:48.012Z", "updated_at": "2020-03-15T13:29:48.012Z" }, { "id": 206, "name": "54c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "01d38872ce5a4a51b40f6ab4b3f927ee", "ext": ".jpg", "mime": "image/jpeg", "size": 27.41, "url": "/uploads/01d38872ce5a4a51b40f6ab4b3f927ee.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T13:29:48.020Z", "updated_at": "2020-03-15T13:29:48.020Z" }], "thumbnail": { "id": 203, "name": "7.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "acf14989504d4099ac8a56d0b4e2aca9", "ext": ".jpg", "mime": "image/jpeg", "size": 11.5, "url": "/uploads/acf14989504d4099ac8a56d0b4e2aca9.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T13:29:47.988Z", "updated_at": "2020-03-15T13:29:47.988Z" } }, { "id": 69, "title": "Apple TV 4k 10.2 Inch", "is_featured": false, "is_hot": false, "price": 332.38, "sale_price": null, "vendor": "Young Shop", "review": 4, "is_out_of_stock": false, "depot": 60, "inventory": 80, "is_active": true, "is_sale": false, "created_at": "2020-03-15T06:40:02.790Z", "updated_at": "2020-03-15T06:40:02.790Z", "variants": [], "images": [{ "id": 70, "name": "16a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "4ef330f9bd3a4bb1ba9c2b23f70772df", "ext": ".jpg", "mime": "image/jpeg", "size": 29.52, "url": "/uploads/4ef330f9bd3a4bb1ba9c2b23f70772df.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:40:02.823Z", "updated_at": "2020-03-15T06:40:02.823Z" }, { "id": 71, "name": "16b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "1eff5ff12c48444dac8ba28ac12c0790", "ext": ".jpg", "mime": "image/jpeg", "size": 14.26, "url": "/uploads/1eff5ff12c48444dac8ba28ac12c0790.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:40:02.833Z", "updated_at": "2020-03-15T06:40:02.833Z" }, { "id": 72, "name": "16c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "a25ae077a45444528b12b13c7c7c2b1e", "ext": ".jpg", "mime": "image/jpeg", "size": 13.58, "url": "/uploads/a25ae077a45444528b12b13c7c7c2b1e.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:40:02.843Z", "updated_at": "2020-03-15T06:40:02.843Z" }, { "id": 73, "name": "16d.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "f71d017b2b3d46ebbacec60d7b63f9ff", "ext": ".jpg", "mime": "image/jpeg", "size": 14.61, "url": "/uploads/f71d017b2b3d46ebbacec60d7b63f9ff.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:40:02.852Z", "updated_at": "2020-03-15T06:40:02.852Z" }], "thumbnail": { "id": 69, "name": "15.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "6b2dca15a8f14f3f9b4f95cd6b3a6711", "ext": ".jpg", "mime": "image/jpeg", "size": 6, "url": "/uploads/6b2dca15a8f14f3f9b4f95cd6b3a6711.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:40:02.813Z", "updated_at": "2020-03-15T06:40:02.813Z" } }, { "id": 17, "title": "Apple Macbook Retina Display 12", "is_featured": false, "is_hot": false, "price": 1362.99, "sale_price": 1200, "vendor": "Young Shop", "review": 4, "is_out_of_stock": false, "depot": 70, "inventory": 80, "is_active": true, "is_sale": true, "created_at": "2020-03-15T06:42:37.444Z", "updated_at": "2020-03-18T12:54:14.665Z", "variants": [], "images": [{ "id": 75, "name": "17a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "2c1147dfe0994cdb980fcd6f216ac3a9", "ext": ".jpg", "mime": "image/jpeg", "size": 47.41, "url": "/uploads/2c1147dfe0994cdb980fcd6f216ac3a9.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:42:37.506Z", "updated_at": "2020-03-15T06:42:37.506Z" }, { "id": 76, "name": "17b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "f403deba2d2f4137bce66171471e896b", "ext": ".jpg", "mime": "image/jpeg", "size": 23.48, "url": "/uploads/f403deba2d2f4137bce66171471e896b.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:42:37.521Z", "updated_at": "2020-03-15T06:42:37.521Z" }, { "id": 77, "name": "17c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "c80df855abc949908f9dfb9bf5b96de9", "ext": ".jpg", "mime": "image/jpeg", "size": 14.98, "url": "/uploads/c80df855abc949908f9dfb9bf5b96de9.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:42:37.530Z", "updated_at": "2020-03-15T06:42:37.530Z" }, { "id": 78, "name": "17d.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "1df60e151e7940059d2949c313bccb84", "ext": ".jpg", "mime": "image/jpeg", "size": 5.54, "url": "/uploads/1df60e151e7940059d2949c313bccb84.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:42:37.539Z", "updated_at": "2020-03-15T06:42:37.539Z" }], "thumbnail": { "id": 74, "name": "16.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "a85ac7daaa614747b209894c37a0bdbd", "ext": ".jpg", "mime": "image/jpeg", "size": 7.59, "url": "/uploads/a85ac7daaa614747b209894c37a0bdbd.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:42:37.485Z", "updated_at": "2020-03-15T06:42:37.485Z" } }, { "id": 18, "title": "Samsung UHD TV 24inch", "is_featured": false, "is_hot": false, "price": 599, "sale_price": null, "vendor": "Robert's Store", "review": 4, "is_out_of_stock": false, "depot": 40, "inventory": 60, "is_active": true, "is_sale": false, "created_at": "2020-03-15T06:44:46.172Z", "updated_at": "2020-03-15T06:44:46.172Z", "variants": [], "images": [{ "id": 80, "name": "18a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "2fa613328d4e4ef69fb36a281057da25", "ext": ".jpg", "mime": "image/jpeg", "size": 72.3, "url": "/uploads/2fa613328d4e4ef69fb36a281057da25.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:44:46.202Z", "updated_at": "2020-03-15T06:44:46.202Z" }, { "id": 81, "name": "18b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "298c7187ba2e4459a4427149fc1c77c5", "ext": ".jpg", "mime": "image/jpeg", "size": 27.69, "url": "/uploads/298c7187ba2e4459a4427149fc1c77c5.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:44:46.211Z", "updated_at": "2020-03-15T06:44:46.211Z" }, { "id": 82, "name": "18c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "ecdd5aa1e85146e5b7fe7b07b7fb84f1", "ext": ".jpg", "mime": "image/jpeg", "size": 27.7, "url": "/uploads/ecdd5aa1e85146e5b7fe7b07b7fb84f1.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:44:46.219Z", "updated_at": "2020-03-15T06:44:46.219Z" }, { "id": 83, "name": "18d.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "bcd5916387a348d592994740de295881", "ext": ".jpg", "mime": "image/jpeg", "size": 4.42, "url": "/uploads/bcd5916387a348d592994740de295881.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:44:46.227Z", "updated_at": "2020-03-15T06:44:46.227Z" }], "thumbnail": { "id": 79, "name": "18.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "a48664eaed094c769046b4128dd341e4", "ext": ".jpg", "mime": "image/jpeg", "size": 11.29, "url": "/uploads/a48664eaed094c769046b4128dd341e4.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:44:46.192Z", "updated_at": "2020-03-15T06:44:46.192Z" } }, { "id": 23, "title": "Amcrest Security Camera in White Color", "is_featured": false, "is_hot": false, "price": 62.99, "sale_price": 45.9, "vendor": "Global Office", "review": 4, "is_out_of_stock": false, "depot": 60, "inventory": 80, "is_active": true, "is_sale": true, "created_at": "2020-03-15T07:00:52.871Z", "updated_at": "2020-03-15T07:00:52.871Z", "variants": [], "images": [{ "id": 103, "name": "24a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "4fcbfdb675614342a172da1be483724e", "ext": ".jpg", "mime": "image/jpeg", "size": 38.76, "url": "/uploads/4fcbfdb675614342a172da1be483724e.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T07:00:52.919Z", "updated_at": "2020-03-15T07:00:52.919Z" }, { "id": 104, "name": "24b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "ba0feb269ff041e9ba8489b63c0ad79d", "ext": ".jpg", "mime": "image/jpeg", "size": 19.41, "url": "/uploads/ba0feb269ff041e9ba8489b63c0ad79d.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T07:00:52.927Z", "updated_at": "2020-03-15T07:00:52.927Z" }, { "id": 105, "name": "24c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "7ed9a1fcc0814f78bf3ce9941fffcc5c", "ext": ".jpg", "mime": "image/jpeg", "size": 20.22, "url": "/uploads/7ed9a1fcc0814f78bf3ce9941fffcc5c.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T07:00:52.935Z", "updated_at": "2020-03-15T07:00:52.935Z" }, { "id": 106, "name": "24d.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "48f249386e604cb69c56a6dfd893d364", "ext": ".jpg", "mime": "image/jpeg", "size": 15.15, "url": "/uploads/48f249386e604cb69c56a6dfd893d364.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T07:00:52.943Z", "updated_at": "2020-03-15T07:00:52.943Z" }], "thumbnail": { "id": 102, "name": "22.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "bb783d18223044cca198d84a4e0e3191", "ext": ".jpg", "mime": "image/jpeg", "size": 7.24, "url": "/uploads/bb783d18223044cca198d84a4e0e3191.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T07:00:52.903Z", "updated_at": "2020-03-15T07:00:52.903Z" } }, { "id": 24, "title": "DJI Phantom 4 Quadcopter Camera", "is_featured": false, "is_hot": false, "price": 1207.15, "sale_price": 945.9, "vendor": "Go Pro", "review": 5, "is_out_of_stock": false, "depot": 65, "inventory": 70, "is_active": true, "is_sale": true, "created_at": "2020-03-15T07:06:17.229Z", "updated_at": "2020-03-15T07:06:17.229Z", "variants": [], "images": [{ "id": 108, "name": "25a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "c7f00eff80d744a3b4fbc96918deabb1", "ext": ".jpg", "mime": "image/jpeg", "size": 20.23, "url": "/uploads/c7f00eff80d744a3b4fbc96918deabb1.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T07:06:17.280Z", "updated_at": "2020-03-15T07:06:17.280Z" }, { "id": 109, "name": "25b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "6215cedde8354803817b8d0b46446865", "ext": ".jpg", "mime": "image/jpeg", "size": 7.75, "url": "/uploads/6215cedde8354803817b8d0b46446865.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T07:06:17.295Z", "updated_at": "2020-03-15T07:06:17.295Z" }, { "id": 110, "name": "25c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "8b54c00b8f244b87b9179e402a7639b2", "ext": ".jpg", "mime": "image/jpeg", "size": 6.46, "url": "/uploads/8b54c00b8f244b87b9179e402a7639b2.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T07:06:17.303Z", "updated_at": "2020-03-15T07:06:17.303Z" }, { "id": 111, "name": "25d.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "de6cc09f104f456b89c255b450655089", "ext": ".jpg", "mime": "image/jpeg", "size": 16.18, "url": "/uploads/de6cc09f104f456b89c255b450655089.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T07:06:17.310Z", "updated_at": "2020-03-15T07:06:17.310Z" }], "thumbnail": { "id": 107, "name": "23.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "f5e300388365470aae6f894f4f0f5c61", "ext": ".jpg", "mime": "image/jpeg", "size": 3.74, "url": "/uploads/f5e300388365470aae6f894f4f0f5c61.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T07:06:17.262Z", "updated_at": "2020-03-15T07:06:17.262Z" } }, { "id": 31, "title": "Samsung Gear VR Virtual Reality Headset", "is_featured": false, "is_hot": false, "price": 320, "sale_price": null, "vendor": "Global Office", "review": 1, "is_out_of_stock": false, "depot": 70, "inventory": 80, "is_active": true, "is_sale": false, "created_at": "2020-03-15T09:05:44.603Z", "updated_at": "2020-03-15T09:05:44.603Z", "variants": [], "images": [{ "id": 139, "name": "32a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "30b225eb781448bb96b4eb0e585de1ba", "ext": ".jpg", "mime": "image/jpeg", "size": 33.87, "url": "/uploads/30b225eb781448bb96b4eb0e585de1ba.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T09:05:44.630Z", "updated_at": "2020-03-15T09:05:44.630Z" }, { "id": 140, "name": "32b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "d74002e783b441c4ae0bfd35b16a56fc", "ext": ".jpg", "mime": "image/jpeg", "size": 12.9, "url": "/uploads/d74002e783b441c4ae0bfd35b16a56fc.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T09:05:44.637Z", "updated_at": "2020-03-15T09:05:44.637Z" }, { "id": 141, "name": "32c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "f3f8a64c9ebd4035aa753650a4ed48d0", "ext": ".jpg", "mime": "image/jpeg", "size": 14.25, "url": "/uploads/f3f8a64c9ebd4035aa753650a4ed48d0.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T09:05:44.650Z", "updated_at": "2020-03-15T09:05:44.650Z" }, { "id": 142, "name": "32d.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "99e3308b7d1a4bbf814ce67329001c39", "ext": ".jpg", "mime": "image/jpeg", "size": 11.95, "url": "/uploads/99e3308b7d1a4bbf814ce67329001c39.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T09:05:44.658Z", "updated_at": "2020-03-15T09:05:44.658Z" }], "thumbnail": { "id": 138, "name": "4.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "27c756b633404bf6bc734557a90e3baa", "ext": ".jpg", "mime": "image/jpeg", "size": 6.52, "url": "/uploads/27c756b633404bf6bc734557a90e3baa.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T09:05:44.620Z", "updated_at": "2020-03-15T09:05:44.620Z" } }, { "id": 42, "title": "Gopro Hero 4 Sliver Wireless, 4k HD", "is_featured": false, "is_hot": false, "price": 510, "sale_price": 500.99, "vendor": "Go Pro", "review": 4, "is_out_of_stock": false, "depot": 70, "inventory": 80, "is_active": true, "is_sale": true, "created_at": "2020-03-15T09:49:14.357Z", "updated_at": "2020-03-15T09:49:14.357Z", "variants": [], "images": [{ "id": 164, "name": "18.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "c81b5f934b8842a19f80eb94b66dbacf", "ext": ".jpg", "mime": "image/jpeg", "size": 6.09, "url": "/uploads/c81b5f934b8842a19f80eb94b66dbacf.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T09:49:14.387Z", "updated_at": "2020-03-15T09:49:14.387Z" }], "thumbnail": { "id": 163, "name": "18.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "3a99112514724b59a18c48fa6a3569d3", "ext": ".jpg", "mime": "image/jpeg", "size": 6.09, "url": "/uploads/3a99112514724b59a18c48fa6a3569d3.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T09:49:14.376Z", "updated_at": "2020-03-15T09:49:14.376Z" } }, { "id": 61, "title": "Apple MacBook Air Retina 13.3-Inch Laptop", "is_featured": false, "is_hot": false, "price": 1120, "sale_price": 1020.99, "vendor": "Global Office", "review": 4, "is_out_of_stock": false, "depot": 60, "inventory": 70, "is_active": true, "is_sale": true, "created_at": "2020-03-18T04:29:19.122Z", "updated_at": "2020-03-18T04:29:19.122Z", "variants": [], "images": [{ "id": 240, "name": "3.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "6323ba741e89407abde3c2b813a7b958", "ext": ".jpg", "mime": "image/jpeg", "size": 7.53, "url": "/uploads/6323ba741e89407abde3c2b813a7b958.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T04:29:19.153Z", "updated_at": "2020-03-18T04:29:19.153Z" }], "thumbnail": { "id": 239, "name": "3.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "a4dc298d307e401c9f829d269a9a97a4", "ext": ".jpg", "mime": "image/jpeg", "size": 7.53, "url": "/uploads/a4dc298d307e401c9f829d269a9a97a4.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T04:29:19.140Z", "updated_at": "2020-03-18T04:29:19.140Z" } }, { "id": 66, "title": "Apple MacBook Air Retina 12-Inch Laptop", "is_featured": false, "is_hot": false, "price": 942.99, "sale_price": null, "vendor": "Global Office", "review": 4, "is_out_of_stock": false, "depot": 50, "inventory": 60, "is_active": true, "is_sale": false, "created_at": "2020-03-18T05:37:01.843Z", "updated_at": "2020-03-18T05:37:01.843Z", "variants": [], "images": [{ "id": 259, "name": "67a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "6dc62d368b0a4a77803c7abd30ecc540", "ext": ".jpg", "mime": "image/jpeg", "size": 61.32, "url": "/uploads/6dc62d368b0a4a77803c7abd30ecc540.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T05:37:01.873Z", "updated_at": "2020-03-18T05:37:01.873Z" }, { "id": 260, "name": "67b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "69dd0520caba4f14b8630e4db8db4e86", "ext": ".jpg", "mime": "image/jpeg", "size": 4.22, "url": "/uploads/69dd0520caba4f14b8630e4db8db4e86.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T05:37:01.882Z", "updated_at": "2020-03-18T05:37:01.882Z" }, { "id": 261, "name": "67c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "161c3e2cf6b6407aa96e0a7570358146", "ext": ".jpg", "mime": "image/jpeg", "size": 22.04, "url": "/uploads/161c3e2cf6b6407aa96e0a7570358146.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T05:37:01.890Z", "updated_at": "2020-03-18T05:37:01.890Z" }, { "id": 262, "name": "67d.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "b4cfc0a8e6f64b96b3f6f5ccf6eac770", "ext": ".jpg", "mime": "image/jpeg", "size": 4.66, "url": "/uploads/b4cfc0a8e6f64b96b3f6f5ccf6eac770.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T05:37:01.898Z", "updated_at": "2020-03-18T05:37:01.898Z" }], "thumbnail": { "id": 258, "name": "12.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "b8c8108591324725abc436cc899df220", "ext": ".jpg", "mime": "image/jpeg", "size": 7.56, "url": "/uploads/b8c8108591324725abc436cc899df220.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T05:37:01.862Z", "updated_at": "2020-03-18T05:37:01.862Z" } }, { "id": 72, "title": "HP Chromebook CB 10014 Desktop", "is_featured": false, "is_hot": false, "price": 820.99, "sale_price": null, "vendor": "Global Office", "review": 4, "is_out_of_stock": false, "depot": 60, "inventory": 70, "is_active": true, "is_sale": false, "created_at": "2020-03-18T05:49:55.032Z", "updated_at": "2020-03-18T05:49:55.032Z", "variants": [], "images": [{ "id": 287, "name": "73a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "a71fa14e97ef4317ae248c78247720cf", "ext": ".jpg", "mime": "image/jpeg", "size": 25.14, "url": "/uploads/a71fa14e97ef4317ae248c78247720cf.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T05:49:55.087Z", "updated_at": "2020-03-18T05:49:55.087Z" }, { "id": 288, "name": "73b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "280d9fae269246568406ef5aac860795", "ext": ".jpg", "mime": "image/jpeg", "size": 27.11, "url": "/uploads/280d9fae269246568406ef5aac860795.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T05:49:55.099Z", "updated_at": "2020-03-18T05:49:55.099Z" }, { "id": 289, "name": "73c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "33a5e8a71e7841519f62ac215b3a3a50", "ext": ".jpg", "mime": "image/jpeg", "size": 7.13, "url": "/uploads/33a5e8a71e7841519f62ac215b3a3a50.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T05:49:55.119Z", "updated_at": "2020-03-18T05:49:55.119Z" }, { "id": 290, "name": "73d.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "ed02ef12245647ecbae125ad1d2c6049", "ext": ".jpg", "mime": "image/jpeg", "size": 6.4, "url": "/uploads/ed02ef12245647ecbae125ad1d2c6049.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T05:49:55.131Z", "updated_at": "2020-03-18T05:49:55.131Z" }], "thumbnail": { "id": 286, "name": "18.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "f73d332d3a074a44af99b073c922b24f", "ext": ".jpg", "mime": "image/jpeg", "size": 4.11, "url": "/uploads/f73d332d3a074a44af99b073c922b24f.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T05:49:55.070Z", "updated_at": "2020-03-18T05:49:55.070Z" } }] }, { "id": 6, "name": "Jewelry & Watches", "slug": "jewelry-and-watches", "description": null, "created_at": "2020-03-14T10:26:39.769Z", "updated_at": "2020-03-14T10:26:39.769Z", "products": [{ "id": 14, "title": "MVMTH Classical Leather Watch In Black", "is_featured": false, "is_hot": false, "price": 62.99, "sale_price": 57.99, "vendor": "Young Shop", "review": 5, "is_out_of_stock": false, "depot": 60, "inventory": 70, "is_active": true, "is_sale": true, "created_at": "2020-03-15T06:34:26.192Z", "updated_at": "2020-03-15T06:34:26.192Z", "variants": [], "images": [{ "id": 60, "name": "14a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "3ac851d95c86433b8fcc50600c917036", "ext": ".jpg", "mime": "image/jpeg", "size": 37.78, "url": "/uploads/3ac851d95c86433b8fcc50600c917036.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:34:26.237Z", "updated_at": "2020-03-15T06:34:26.237Z" }, { "id": 61, "name": "14b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "ebe0db165640431d9c8fd683f3258663", "ext": ".jpg", "mime": "image/jpeg", "size": 22.93, "url": "/uploads/ebe0db165640431d9c8fd683f3258663.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:34:26.244Z", "updated_at": "2020-03-15T06:34:26.244Z" }, { "id": 62, "name": "14c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "3f385d0f210e4ee88ed91de38d36470e", "ext": ".jpg", "mime": "image/jpeg", "size": 16.68, "url": "/uploads/3f385d0f210e4ee88ed91de38d36470e.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:34:26.262Z", "updated_at": "2020-03-15T06:34:26.262Z" }], "thumbnail": { "id": 59, "name": "13.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "5a88e8516a6e44cb86ba41516dca0d56", "ext": ".jpg", "mime": "image/jpeg", "size": 7.62, "url": "/uploads/5a88e8516a6e44cb86ba41516dca0d56.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:34:26.226Z", "updated_at": "2020-03-15T06:34:26.226Z" } }] }, { "id": 7, "name": "Phones & Accessories", "slug": "phones-and-accessories", "description": null, "created_at": "2020-03-14T10:26:54.185Z", "updated_at": "2020-03-14T10:26:54.185Z", "products": [{ "id": 1, "title": "Apple iPhone Retina 6s Plus 32GB", "is_featured": null, "is_hot": null, "price": 640.5, "sale_price": null, "vendor": "ROBERT White", "is_featured": false, "is_hot": false, "price": 62.99, "sale_price": 57.99, "vendor": "Global Office", "review": 5, "is_out_of_stock": false, "depot": 50, "inventory": 80, "is_active": true, "is_sale": true, "created_at": "2020-03-15T06:37:17.824Z", "updated_at": "2020-03-15T06:37:17.824Z", "variants": [], "images": [{ "id": 64, "name": "1.png", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "bbb75430607f4d43ad26e4467ebdc524", "ext": ".png", "mime": "image/png", "size": 2.55, "url": "/uploads/bbb75430607f4d43ad26e4467ebdc524.png", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:37:17.869Z", "updated_at": "2020-03-15T06:37:17.869Z" }, { "id": 65, "name": "2.png", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "8df2b7bc798c43e3a56ba6b59c5be53a", "ext": ".png", "mime": "image/png", "size": 2.55, "url": "/uploads/8df2b7bc798c43e3a56ba6b59c5be53a.png", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:37:17.878Z", "updated_at": "2020-03-15T06:37:17.878Z" }, { "id": 66, "name": "4.png", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "88eb11d6018e498aa7f97d41d4a434d2", "ext": ".png", "mime": "image/png", "size": 2.55, "url": "/uploads/88eb11d6018e498aa7f97d41d4a434d2.png", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:37:17.887Z", "updated_at": "2020-03-15T06:37:17.887Z" }, { "id": 67, "name": "5.png", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "9e94caa14f78425aaaaa699d8412a8cb", "ext": ".png", "mime": "image/png", "size": 2.55, "url": "/uploads/9e94caa14f78425aaaaa699d8412a8cb.png", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:37:17.896Z", "updated_at": "2020-03-15T06:37:17.896Z" }, { "id": 68, "name": "3.png", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "35afd31625dc46a48050b0f918897eaf", "ext": ".png", "mime": "image/png", "size": 2.55, "url": "/uploads/35afd31625dc46a48050b0f918897eaf.png", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:37:17.912Z", "updated_at": "2020-03-15T06:37:17.912Z" }], "thumbnail": { "id": 63, "name": "14.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "3ca33b80916943f49a5af0a84ab2ef15", "ext": ".jpg", "mime": "image/jpeg", "size": 6.24, "url": "/uploads/3ca33b80916943f49a5af0a84ab2ef15.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:37:17.857Z", "updated_at": "2020-03-15T06:37:17.857Z" } }, { "id": 22, "title": "Edifier Powered Bookshelf Speakers", "is_featured": false, "is_hot": false, "price": 96, "sale_price": 85, "vendor": "Young Shop", "review": 5, "is_out_of_stock": false, "depot": 50, "inventory": 65, "is_active": true, "is_sale": true, "created_at": "2020-03-15T06:57:47.163Z", "updated_at": "2020-03-15T06:57:47.163Z", "variants": [], "images": [{ "id": 98, "name": "22a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "8781ca71d80847979441fe7dc8b94fa9", "ext": ".jpg", "mime": "image/jpeg", "size": 68.23, "url": "/uploads/8781ca71d80847979441fe7dc8b94fa9.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:57:47.213Z", "updated_at": "2020-03-15T06:57:47.213Z" }, { "id": 99, "name": "22b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "bde411ee582c4c86812e06dd5252c188", "ext": ".jpg", "mime": "image/jpeg", "size": 24.46, "url": "/uploads/bde411ee582c4c86812e06dd5252c188.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:57:47.230Z", "updated_at": "2020-03-15T06:57:47.230Z" }, { "id": 100, "name": "22c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "f2a178431d59495791d2030dc6900304", "ext": ".jpg", "mime": "image/jpeg", "size": 38.11, "url": "/uploads/f2a178431d59495791d2030dc6900304.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:57:47.237Z", "updated_at": "2020-03-15T06:57:47.237Z" }, { "id": 101, "name": "22d.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "2bb3160bbb234b93b2210ff505090e87", "ext": ".jpg", "mime": "image/jpeg", "size": 18.81, "url": "/uploads/2bb3160bbb234b93b2210ff505090e87.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:57:47.245Z", "updated_at": "2020-03-15T06:57:47.245Z" }], "thumbnail": { "id": 97, "name": "21.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "51a0ff71f98649af8b17284ed14f955d", "ext": ".jpg", "mime": "image/jpeg", "size": 10, "url": "/uploads/51a0ff71f98649af8b17284ed14f955d.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:57:47.203Z", "updated_at": "2020-03-15T06:57:47.203Z" } }, { "id": 43, "title": "Nikon Coolpix 24 Megapixel Camera", "is_featured": false, "is_hot": false, "price": 393.38, "sale_price": null, "vendor": "Global Office", "review": 5, "is_out_of_stock": false, "depot": 70, "inventory": 80, "is_active": true, "is_sale": false, "created_at": "2020-03-15T09:51:05.087Z", "updated_at": "2020-03-15T09:51:05.087Z", "variants": [], "images": [{ "id": 166, "name": "44a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "c8ff3afb2eef49b99c8abc0f1bbf3563", "ext": ".jpg", "mime": "image/jpeg", "size": 41.72, "url": "/uploads/c8ff3afb2eef49b99c8abc0f1bbf3563.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T09:51:05.119Z", "updated_at": "2020-03-15T09:51:05.119Z" }, { "id": 167, "name": "44b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "56596cdb7d034c3e99ff9daf3c464128", "ext": ".jpg", "mime": "image/jpeg", "size": 12.31, "url": "/uploads/56596cdb7d034c3e99ff9daf3c464128.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T09:51:05.129Z", "updated_at": "2020-03-15T09:51:05.129Z" }, { "id": 168, "name": "44c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "92d14dc17dbe44169c3daa3c6f8bddd0", "ext": ".jpg", "mime": "image/jpeg", "size": 13.54, "url": "/uploads/92d14dc17dbe44169c3daa3c6f8bddd0.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T09:51:05.139Z", "updated_at": "2020-03-15T09:51:05.139Z" }, { "id": 169, "name": "44d.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "d9fdd2a79c1540b68ae3ee84d9523a70", "ext": ".jpg", "mime": "image/jpeg", "size": 13.63, "url": "/uploads/d9fdd2a79c1540b68ae3ee84d9523a70.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T09:51:05.147Z", "updated_at": "2020-03-15T09:51:05.147Z" }], "thumbnail": { "id": 165, "name": "19.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "d8125ce8ae8b46cb926e01daae0c0fb2", "ext": ".jpg", "mime": "image/jpeg", "size": 6.5, "url": "/uploads/d8125ce8ae8b46cb926e01daae0c0fb2.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T09:51:05.108Z", "updated_at": "2020-03-15T09:51:05.108Z" } }, { "id": 44, "title": "Sony HD 1080, 13.5MP, White Version", "is_featured": false, "is_hot": false, "price": 760, "sale_price": 625, "vendor": "Young Shop", "review": 5, "is_out_of_stock": false, "depot": 70, "inventory": 80, "is_active": true, "is_sale": true, "created_at": "2020-03-15T09:55:33.399Z", "updated_at": "2020-03-15T09:55:33.399Z", "variants": [], "images": [{ "id": 171, "name": "45a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "6dab2ac788b04a5cbca7400ec03d8a38", "ext": ".jpg", "mime": "image/jpeg", "size": 28.26, "url": "/uploads/6dab2ac788b04a5cbca7400ec03d8a38.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T09:55:33.428Z", "updated_at": "2020-03-15T09:55:33.428Z" }, { "id": 172, "name": "45b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "1c026df89da0490bbe2a7afc5a99195a", "ext": ".jpg", "mime": "image/jpeg", "size": 9.88, "url": "/uploads/1c026df89da0490bbe2a7afc5a99195a.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T09:55:33.438Z", "updated_at": "2020-03-15T09:55:33.438Z" }, { "id": 173, "name": "45c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "4c1c99e28c794b26a047a0c87a679f98", "ext": ".jpg", "mime": "image/jpeg", "size": 7.65, "url": "/uploads/4c1c99e28c794b26a047a0c87a679f98.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T09:55:33.446Z", "updated_at": "2020-03-15T09:55:33.446Z" }, { "id": 174, "name": "45d.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "0de96474e26645699609477fdd64b21e", "ext": ".jpg", "mime": "image/jpeg", "size": 5.76, "url": "/uploads/0de96474e26645699609477fdd64b21e.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T09:55:33.455Z", "updated_at": "2020-03-15T09:55:33.455Z" }], "thumbnail": { "id": 170, "name": "20.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "d8789adf571d46f19ce9065da0cf64a3", "ext": ".jpg", "mime": "image/jpeg", "size": 3.72, "url": "/uploads/d8789adf571d46f19ce9065da0cf64a3.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T09:55:33.416Z", "updated_at": "2020-03-15T09:55:33.416Z" } }, { "id": 59, "title": "Apple iPhone X 256GB T-Mobile Red Color", "is_featured": false, "is_hot": false, "price": 893, "sale_price": 820.99, "vendor": "Global Office", "review": 4, "is_out_of_stock": false, "depot": 70, "inventory": 80, "is_active": true, "is_sale": true, "created_at": "2020-03-18T04:27:45.620Z", "updated_at": "2020-03-18T04:27:45.620Z", "variants": [], "images": [{ "id": 236, "name": "1a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "8683d4e9c40f4c3bb003123ad3b3233a", "ext": ".jpg", "mime": "image/jpeg", "size": 8.78, "url": "/uploads/8683d4e9c40f4c3bb003123ad3b3233a.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T04:27:45.663Z", "updated_at": "2020-03-18T04:27:45.663Z" }, { "id": 237, "name": "1b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "ef8b92ddea1649d7a708b82b94e1547d", "ext": ".jpg", "mime": "image/jpeg", "size": 4.5, "url": "/uploads/ef8b92ddea1649d7a708b82b94e1547d.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T04:27:45.676Z", "updated_at": "2020-03-18T04:27:45.676Z" }, { "id": 238, "name": "1c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "7c4bc2eb18aa467bb5ac730b51a1ca5b", "ext": ".jpg", "mime": "image/jpeg", "size": 10.88, "url": "/uploads/7c4bc2eb18aa467bb5ac730b51a1ca5b.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T04:27:45.688Z", "updated_at": "2020-03-18T04:27:45.688Z" }], "thumbnail": { "id": 235, "name": "2.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "490bd709c0be4545b29121b244ff4516", "ext": ".jpg", "mime": "image/jpeg", "size": 6.91, "url": "/uploads/490bd709c0be4545b29121b244ff4516.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T04:27:45.648Z", "updated_at": "2020-03-18T04:27:45.648Z" } }, { "id": 63, "title": "Samsung Gallaxy A8 8GB Ram Sliver Version", "is_featured": false, "is_hot": false, "price": 592, "sale_price": 642.99, "vendor": "Global Office", "review": 4, "is_out_of_stock": false, "depot": 70, "inventory": 80, "is_active": true, "is_sale": true, "created_at": "2020-03-18T05:33:26.161Z", "updated_at": "2020-03-18T05:33:26.161Z", "variants": [], "images": [{ "id": 249, "name": "65a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "0a3c28219fc74e499f3256ad77d94a55", "ext": ".jpg", "mime": "image/jpeg", "size": 59.99, "url": "/uploads/0a3c28219fc74e499f3256ad77d94a55.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T05:33:26.190Z", "updated_at": "2020-03-18T05:33:26.190Z" }, { "id": 250, "name": "65b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "30bd54763a8a4867bd1d5c3d786e26b5", "ext": ".jpg", "mime": "image/jpeg", "size": 17.47, "url": "/uploads/30bd54763a8a4867bd1d5c3d786e26b5.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T05:33:26.198Z", "updated_at": "2020-03-18T05:33:26.198Z" }, { "id": 251, "name": "65c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "4a17b2711b3b422694466bc5492ab828", "ext": ".jpg", "mime": "image/jpeg", "size": 13.59, "url": "/uploads/4a17b2711b3b422694466bc5492ab828.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T05:33:26.210Z", "updated_at": "2020-03-18T05:33:26.210Z" }, { "id": 252, "name": "65d.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "48971dad13ae4a4aa765ba6ae56951fa", "ext": ".jpg", "mime": "image/jpeg", "size": 27.08, "url": "/uploads/48971dad13ae4a4aa765ba6ae56951fa.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T05:33:26.217Z", "updated_at": "2020-03-18T05:33:26.217Z" }], "thumbnail": { "id": 248, "name": "7.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "86c8fe9d6d6648e99a6015727d421e27", "ext": ".jpg", "mime": "image/jpeg", "size": 11.72, "url": "/uploads/86c8fe9d6d6648e99a6015727d421e27.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T05:33:26.180Z", "updated_at": "2020-03-18T05:33:26.180Z" } }, { "id": 65, "title": "Yuntab K107 10.1 Inch Quad Core CPU MT6580", "is_featured": false, "is_hot": false, "price": 99.99, "sale_price": null, "vendor": "Global Office", "review": 4, "is_out_of_stock": false, "depot": 50, "inventory": 60, "is_active": true, "is_sale": false, "created_at": "2020-03-18T05:35:13.796Z", "updated_at": "2020-03-18T05:35:13.796Z", "variants": [], "images": [{ "id": 254, "name": "66a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "bc0584820ba146688921e5df66ef0aa1", "ext": ".jpg", "mime": "image/jpeg", "size": 79.12, "url": "/uploads/bc0584820ba146688921e5df66ef0aa1.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T05:35:13.827Z", "updated_at": "2020-03-18T05:35:13.827Z" }, { "id": 255, "name": "66b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "1838261f7afd46149a41e7b322955b7f", "ext": ".jpg", "mime": "image/jpeg", "size": 19.05, "url": "/uploads/1838261f7afd46149a41e7b322955b7f.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T05:35:13.835Z", "updated_at": "2020-03-18T05:35:13.835Z" }, { "id": 256, "name": "66c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "62ed690a4d744c6fa2a0d62c02159252", "ext": ".jpg", "mime": "image/jpeg", "size": 15.88, "url": "/uploads/62ed690a4d744c6fa2a0d62c02159252.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T05:35:13.843Z", "updated_at": "2020-03-18T05:35:13.843Z" }, { "id": 257, "name": "66d.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "ce7ad3a37f3f4acaadf8e5c9cf996792", "ext": ".jpg", "mime": "image/jpeg", "size": 6.33, "url": "/uploads/ce7ad3a37f3f4acaadf8e5c9cf996792.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T05:35:13.851Z", "updated_at": "2020-03-18T05:35:13.851Z" }], "thumbnail": { "id": 253, "name": "7.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "7df00b4c32074b9c85b464f3dbbbab2e", "ext": ".jpg", "mime": "image/jpeg", "size": 11.72, "url": "/uploads/7df00b4c32074b9c85b464f3dbbbab2e.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T05:35:13.815Z", "updated_at": "2020-03-18T05:35:13.815Z" } }, { "id": 67, "title": "Bose Ear-Phone Bluetooth & Wireless", "is_featured": false, "is_hot": false, "price": 392.99, "sale_price": null, "vendor": "Young Shop", "review": 4, "is_out_of_stock": false, "depot": 60, "inventory": 70, "is_active": true, "is_sale": false, "created_at": "2020-03-18T05:38:55.759Z", "updated_at": "2020-03-18T05:38:55.759Z", "variants": [], "images": [{ "id": 264, "name": "68a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "20898b1b75ff4fcd9967794e6def5d28", "ext": ".jpg", "mime": "image/jpeg", "size": 47.86, "url": "/uploads/20898b1b75ff4fcd9967794e6def5d28.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T05:38:55.790Z", "updated_at": "2020-03-18T05:38:55.790Z" }, { "id": 265, "name": "68b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "7a5d1d5dfc4e4c7f98dd19899c4da4da", "ext": ".jpg", "mime": "image/jpeg", "size": 8.04, "url": "/uploads/7a5d1d5dfc4e4c7f98dd19899c4da4da.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T05:38:55.800Z", "updated_at": "2020-03-18T05:38:55.800Z" }, { "id": 266, "name": "68c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "05a1dc53fdf6423884f70e1693bb7451", "ext": ".jpg", "mime": "image/jpeg", "size": 14.82, "url": "/uploads/05a1dc53fdf6423884f70e1693bb7451.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T05:38:55.813Z", "updated_at": "2020-03-18T05:38:55.813Z" }, { "id": 267, "name": "68d.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "e343e6de894e4428adc482f129f96d8f", "ext": ".jpg", "mime": "image/jpeg", "size": 22.57, "url": "/uploads/e343e6de894e4428adc482f129f96d8f.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T05:38:55.837Z", "updated_at": "2020-03-18T05:38:55.837Z" }], "thumbnail": { "id": 348, "name": "68a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "9807d7efbaba430b9c90fc2aaa9ec175", "ext": ".jpg", "mime": "image/jpeg", "size": 47.86, "url": "/uploads/9807d7efbaba430b9c90fc2aaa9ec175.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-28T12:09:41.868Z", "updated_at": "2020-03-28T12:09:41.868Z" } }, { "id": 68, "title": "iQOS 2.4 Plus Kit, Holder & Chargers Custom Hood", "is_featured": false, "is_hot": false, "price": 1050.5, "sale_price": 990.99, "vendor": "ROBERTS STORE", "review": 4, "is_out_of_stock": false, "depot": 70, "inventory": 80, "is_active": true, "is_sale": true, "created_at": "2020-03-15T09:21:27.133Z", "updated_at": "2020-03-15T09:21:27.133Z", "variants": [], "images": [{ "id": 144, "name": "2.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "7719665337f64edc831081e186aefef4", "ext": ".jpg", "mime": "image/jpeg", "size": 12.38, "url": "/uploads/7719665337f64edc831081e186aefef4.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T09:21:27.184Z", "updated_at": "2020-03-15T09:21:27.184Z" }], "thumbnail": { "id": 143, "name": "2.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "4d89105ae491400eba47e0c4ab805f4b", "ext": ".jpg", "mime": "image/jpeg", "size": 12.38, "url": "/uploads/4d89105ae491400eba47e0c4ab805f4b.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T09:21:27.159Z", "updated_at": "2020-03-15T09:21:27.159Z" } }, { "id": 34, "title": "Depo Black Housing Tail Lights Frs Brz 86", "is_featured": false, "is_hot": false, "price": 120.5, "sale_price": 100.99, "vendor": "Young Shop", "review": 4, "is_out_of_stock": false, "depot": 60, "inventory": 70, "is_active": true, "is_sale": true, "created_at": "2020-03-15T09:34:41.156Z", "updated_at": "2020-03-18T12:57:42.304Z", "variants": [], "images": [{ "id": 146, "name": "3.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "74575909382f435ab65cd3ea2ab6e390", "ext": ".jpg", "mime": "image/jpeg", "size": 9.03, "url": "/uploads/74575909382f435ab65cd3ea2ab6e390.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T09:34:41.193Z", "updated_at": "2020-03-15T09:34:41.193Z" }], "thumbnail": { "id": 145, "name": "3.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "1dd340948bc0400289c6c03bc644e99e", "ext": ".jpg", "mime": "image/jpeg", "size": 9.03, "url": "/uploads/1dd340948bc0400289c6c03bc644e99e.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T09:34:41.182Z", "updated_at": "2020-03-15T09:34:41.182Z" } }, { "id": 35, "title": "Anderson Composites Double Skull Exhaust System", "is_featured": false, "is_hot": true, "price": 1055.99, "sale_price": null, "vendor": "Global Office", "review": 4, "is_out_of_stock": false, "depot": 50, "inventory": 60, "is_active": true, "is_sale": false, "created_at": "2020-03-15T09:40:52.204Z", "updated_at": "2020-03-15T09:40:52.204Z", "variants": [], "images": [{ "id": 154, "name": "38a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "6e511bd80804431aadd15aeb29172d2d", "ext": ".jpg", "mime": "image/jpeg", "size": 30.42, "url": "/uploads/6e511bd80804431aadd15aeb29172d2d.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T09:40:52.241Z", "updated_at": "2020-03-15T09:40:52.241Z" }, { "id": 155, "name": "38b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "366848b6e7a343b5bc6dcc2f11672c8b", "ext": ".jpg", "mime": "image/jpeg", "size": 5.49, "url": "/uploads/366848b6e7a343b5bc6dcc2f11672c8b.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T09:40:52.252Z", "updated_at": "2020-03-15T09:40:52.252Z" }, { "id": 156, "name": "38c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "452ecfaa1e3c40d8ad417efe80a297e8", "ext": ".jpg", "mime": "image/jpeg", "size": 19.58, "url": "/uploads/452ecfaa1e3c40d8ad417efe80a297e8.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T09:40:52.263Z", "updated_at": "2020-03-15T09:40:52.263Z" }], "thumbnail": { "id": 153, "name": "6.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "1ebf2224f4724391a3a75a5f4dce4599", "ext": ".jpg", "mime": "image/jpeg", "size": 4.45, "url": "/uploads/1ebf2224f4724391a3a75a5f4dce4599.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T09:40:52.229Z", "updated_at": "2020-03-15T09:40:52.229Z" } }] }, { "id": 12, "name": "Fruits", "slug": "fruits", "description": null, "created_at": "2020-03-18T06:46:56.197Z", "updated_at": "2020-04-17T07:04:19.973Z", "products": [{ "id": 77, "title": "Locally Grown Strawberries, 1 Pint", "is_featured": false, "is_hot": false, "price": 26.95, "sale_price": null, "vendor": "Global Office", "review": 3, "is_out_of_stock": false, "depot": 50, "inventory": 60, "is_active": true, "is_sale": false, "created_at": "2020-03-18T06:46:38.548Z", "updated_at": "2020-03-18T06:46:38.548Z", "variants": [], "images": [{ "id": 311, "name": "78a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "48efb67ec1c743a39e370b43bbbd7c4f", "ext": ".jpg", "mime": "image/jpeg", "size": 583.8, "url": "/uploads/48efb67ec1c743a39e370b43bbbd7c4f.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T06:46:38.593Z", "updated_at": "2020-03-18T06:46:38.593Z" }, { "id": 312, "name": "78b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "39a87fcc433e4e8f95ef6a4f22926482", "ext": ".jpg", "mime": "image/jpeg", "size": 34.87, "url": "/uploads/39a87fcc433e4e8f95ef6a4f22926482.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T06:46:38.602Z", "updated_at": "2020-03-18T06:46:38.602Z" }], "thumbnail": { "id": 310, "name": "78a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "83d058602dee4b2d99ccef21300f8f35", "ext": ".jpg", "mime": "image/jpeg", "size": 583.8, "url": "/uploads/83d058602dee4b2d99ccef21300f8f35.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T06:46:38.580Z", "updated_at": "2020-03-18T06:46:38.580Z" } }, { "id": 78, "title": "Organic Oranges Valencia 1kg", "is_featured": false, "is_hot": false, "price": 25.99, "sale_price": null, "vendor": "Global Office", "review": 5, "is_out_of_stock": false, "depot": 50, "inventory": 60, "is_active": true, "is_sale": false, "created_at": "2020-03-18T06:49:57.368Z", "updated_at": "2020-03-18T06:49:57.368Z", "variants": [], "images": [{ "id": 314, "name": "79a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "8dc27d339178495793f41446e7e2f5be", "ext": ".jpg", "mime": "image/jpeg", "size": 305.41, "url": "/uploads/8dc27d339178495793f41446e7e2f5be.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T06:49:57.403Z", "updated_at": "2020-03-18T06:49:57.403Z" }], "thumbnail": { "id": 313, "name": "79a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "bbd8f6aa2a2849f3ba80d5c6f9337b51", "ext": ".jpg", "mime": "image/jpeg", "size": 305.41, "url": "/uploads/bbd8f6aa2a2849f3ba80d5c6f9337b51.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T06:49:57.391Z", "updated_at": "2020-03-18T06:49:57.391Z" } }, { "id": 79, "title": "Pineapple (Tropical Gold)", "is_featured": false, "is_hot": false, "price": 2.89, "sale_price": null, "vendor": "Global Office", "review": 4, "is_out_of_stock": false, "depot": 70, "inventory": 80, "is_active": true, "is_sale": false, "created_at": "2020-03-18T06:51:19.973Z", "updated_at": "2020-03-18T06:51:19.973Z", "variants": [], "images": [{ "id": 316, "name": "80a.jpeg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "baef1533117e4781890e15d0271a417a", "ext": ".jpeg", "mime": "image/jpeg", "size": 237.83, "url": "/uploads/baef1533117e4781890e15d0271a417a.jpeg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T06:51:20.007Z", "updated_at": "2020-03-18T06:51:20.007Z" }, { "id": 317, "name": "80b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "4acf953a04e04faf8a487c723d202eef", "ext": ".jpg", "mime": "image/jpeg", "size": 28.27, "url": "/uploads/4acf953a04e04faf8a487c723d202eef.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T06:51:20.023Z", "updated_at": "2020-03-18T06:51:20.023Z" }, { "id": 318, "name": "80c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "b62251ec55be493d987a32806f709d2d", "ext": ".jpg", "mime": "image/jpeg", "size": 41.26, "url": "/uploads/b62251ec55be493d987a32806f709d2d.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T06:51:20.033Z", "updated_at": "2020-03-18T06:51:20.033Z" }, { "id": 319, "name": "80d.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "e14ba895134e4f008f9cd5ed0df5a471", "ext": ".jpg", "mime": "image/jpeg", "size": 27.29, "url": "/uploads/e14ba895134e4f008f9cd5ed0df5a471.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T06:51:20.042Z", "updated_at": "2020-03-18T06:51:20.042Z" }], "thumbnail": { "id": 315, "name": "80a.jpeg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "72a1764a51f0415e8d7e8be260848e95", "ext": ".jpeg", "mime": "image/jpeg", "size": 237.83, "url": "/uploads/72a1764a51f0415e8d7e8be260848e95.jpeg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T06:51:19.995Z", "updated_at": "2020-03-18T06:51:19.995Z" } }, { "id": 81, "title": "MariGold 100% Juice Milk 350ml", "is_featured": false, "is_hot": false, "price": 3.95, "sale_price": null, "vendor": "Global Office", "review": 4, "is_out_of_stock": false, "depot": 60, "inventory": 70, "is_active": true, "is_sale": false, "created_at": "2020-03-18T06:56:10.273Z", "updated_at": "2020-03-18T06:56:10.273Z", "variants": [], "images": [{ "id": 323, "name": "82a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "9e488f0e25cf4501a4fe04838e708be9", "ext": ".jpg", "mime": "image/jpeg", "size": 98.07, "url": "/uploads/9e488f0e25cf4501a4fe04838e708be9.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T06:56:10.314Z", "updated_at": "2020-03-18T06:56:10.314Z" }], "thumbnail": { "id": 322, "name": "82a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "e10a8eeffbaa4bfab8898cb9342bb270", "ext": ".jpg", "mime": "image/jpeg", "size": 98.07, "url": "/uploads/e10a8eeffbaa4bfab8898cb9342bb270.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T06:56:10.292Z", "updated_at": "2020-03-18T06:56:10.292Z" } }, { "id": 82, "title": "HomeSoy Soya Milk Originall", "is_featured": false, "is_hot": false, "price": 9.85, "sale_price": null, "vendor": "Global Office", "review": 4, "is_out_of_stock": false, "depot": 60, "inventory": 70, "is_active": true, "is_sale": false, "created_at": "2020-03-18T06:57:16.979Z", "updated_at": "2020-03-18T06:57:16.979Z", "variants": [], "images": [{ "id": 325, "name": "83a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "f4fbe84e5b264982af03f806e044a621", "ext": ".jpg", "mime": "image/jpeg", "size": 107.59, "url": "/uploads/f4fbe84e5b264982af03f806e044a621.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T06:57:17.011Z", "updated_at": "2020-03-18T06:57:17.011Z" }], "thumbnail": { "id": 324, "name": "83a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "019276ce1e444623833b0c1808da707c", "ext": ".jpg", "mime": "image/jpeg", "size": 107.59, "url": "/uploads/019276ce1e444623833b0c1808da707c.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T06:57:17.002Z", "updated_at": "2020-03-18T06:57:17.002Z" } }, { "id": 83, "title": "Australia Banana 16 Pack 2.5 kg", "is_featured": false, "is_hot": false, "price": 12.85, "sale_price": null, "vendor": "Global Office", "review": 3, "is_out_of_stock": false, "depot": 60, "inventory": 70, "is_active": true, "is_sale": false, "created_at": "2020-03-18T06:58:34.168Z", "updated_at": "2020-03-18T06:58:34.168Z", "variants": [], "images": [{ "id": 327, "name": "84a.jpeg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "ffd65dab221a4146b8ddeb0bbf908573", "ext": ".jpeg", "mime": "image/jpeg", "size": 117.79, "url": "/uploads/ffd65dab221a4146b8ddeb0bbf908573.jpeg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T06:58:34.301Z", "updated_at": "2020-03-18T06:58:34.301Z" }], "thumbnail": { "id": 326, "name": "84a.jpeg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "3ea5019caa45409f8a9a770a02181fe2", "ext": ".jpeg", "mime": "image/jpeg", "size": 117.79, "url": "/uploads/3ea5019caa45409f8a9a770a02181fe2.jpeg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T06:58:34.289Z", "updated_at": "2020-03-18T06:58:34.289Z" } }, { "id": 84, "title": "Augason Farms Freeze Dried Beef Chunks", "is_featured": false, "is_hot": false, "price": 67.85, "sale_price": null, "vendor": "Global Office", "review": 5, "is_out_of_stock": false, "depot": 60, "inventory": 70, "is_active": true, "is_sale": false, "created_at": "2020-03-18T06:59:49.553Z", "updated_at": "2020-03-18T06:59:49.553Z", "variants": [], "images": [{ "id": 329, "name": "85a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "0e603357f01e40b3a3cd871a70ebe142", "ext": ".jpg", "mime": "image/jpeg", "size": 527.02, "url": "/uploads/0e603357f01e40b3a3cd871a70ebe142.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T06:59:49.615Z", "updated_at": "2020-03-18T06:59:49.615Z" }, { "id": 330, "name": "85b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "3c5cf1a734e4463a8332a0a0d908a0fe", "ext": ".jpg", "mime": "image/jpeg", "size": 43.85, "url": "/uploads/3c5cf1a734e4463a8332a0a0d908a0fe.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T06:59:49.628Z", "updated_at": "2020-03-18T06:59:49.628Z" }, { "id": 331, "name": "85c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "130a06e89e18489f997f89adb45df47c", "ext": ".jpg", "mime": "image/jpeg", "size": 61.59, "url": "/uploads/130a06e89e18489f997f89adb45df47c.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T06:59:49.638Z", "updated_at": "2020-03-18T06:59:49.638Z" }, { "id": 332, "name": "85d.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "956b710c05964593a93ea91052b7f7fe", "ext": ".jpg", "mime": "image/jpeg", "size": 63.88, "url": "/uploads/956b710c05964593a93ea91052b7f7fe.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T06:59:49.657Z", "updated_at": "2020-03-18T06:59:49.657Z" }], "thumbnail": { "id": 328, "name": "85a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "c57b47015b9a4c37a67b614f16202829", "ext": ".jpg", "mime": "image/jpeg", "size": 527.02, "url": "/uploads/c57b47015b9a4c37a67b614f16202829.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T06:59:49.590Z", "updated_at": "2020-03-18T06:59:49.590Z" } }, { "id": 85, "title": "Vita Coco Coconut Water (Pack of 12)", "is_featured": false, "is_hot": false, "price": 25.89, "sale_price": 20.08, "vendor": "Global Office", "review": 5, "is_out_of_stock": false, "depot": 60, "inventory": 70, "is_active": true, "is_sale": true, "created_at": "2020-03-18T07:01:10.046Z", "updated_at": "2020-03-18T07:01:10.046Z", "variants": [], "images": [{ "id": 334, "name": "86a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "3ca8ef0cc54d46ff87594b803cef3c43", "ext": ".jpg", "mime": "image/jpeg", "size": 227.87, "url": "/uploads/3ca8ef0cc54d46ff87594b803cef3c43.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T07:01:10.085Z", "updated_at": "2020-03-18T07:01:10.085Z" }, { "id": 335, "name": "86b.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "6ed164482d6a4693a4e88c2c4ba3aead", "ext": ".jpg", "mime": "image/jpeg", "size": 23.17, "url": "/uploads/6ed164482d6a4693a4e88c2c4ba3aead.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T07:01:10.100Z", "updated_at": "2020-03-18T07:01:10.100Z" }, { "id": 336, "name": "86c.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "9ca1dd76fe0f43d0aecf9fb2ca719c57", "ext": ".jpg", "mime": "image/jpeg", "size": 51.46, "url": "/uploads/9ca1dd76fe0f43d0aecf9fb2ca719c57.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T07:01:10.109Z", "updated_at": "2020-03-18T07:01:10.109Z" }, { "id": 337, "name": "86d.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "c56f54eb5103427680789de497ac94cb", "ext": ".jpg", "mime": "image/jpeg", "size": 12.31, "url": "/uploads/c56f54eb5103427680789de497ac94cb.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T07:01:10.117Z", "updated_at": "2020-03-18T07:01:10.117Z" }], "thumbnail": { "id": 333, "name": "86a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "39694a8b81124468a5de5e399483bf9e", "ext": ".jpg", "mime": "image/jpeg", "size": 227.87, "url": "/uploads/39694a8b81124468a5de5e399483bf9e.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T07:01:10.073Z", "updated_at": "2020-03-18T07:01:10.073Z" } }, { "id": 86, "title": "Vita Coco Coconut Water (Pack of 24)", "is_featured": false, "is_hot": false, "price": 19.22, "sale_price": 21.99, "vendor": "Young Shop", "review": 2, "is_out_of_stock": false, "depot": 100, "inventory": 200, "is_active": true, "is_sale": true, "created_at": "2020-04-18T08:42:13.577Z", "updated_at": "2020-04-18T08:42:13.577Z", "variants": [], "images": [{ "id": 350, "name": "86b", "alternativeText": null, "caption": null, "width": 600, "height": 600, "formats": { "thumbnail": { "hash": "thumbnail_86b_81b868f333", "ext": ".jpeg", "mime": "image/jpeg", "width": 156, "height": 156, "size": 2.53, "url": "/uploads/thumbnail_86b_81b868f333.jpeg" }, "small": { "hash": "small_86b_81b868f333", "ext": ".jpeg", "mime": "image/jpeg", "width": 500, "height": 500, "size": 15.08, "url": "/uploads/small_86b_81b868f333.jpeg" } }, "hash": "86b_81b868f333", "ext": ".jpeg", "mime": "image/jpeg", "size": 20.45, "url": "/uploads/86b_81b868f333.jpeg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-04-18T08:42:13.694Z", "updated_at": "2020-04-18T08:42:13.694Z" }, { "id": 351, "name": "86a", "alternativeText": null, "caption": null, "width": 800, "height": 800, "formats": { "thumbnail": { "hash": "thumbnail_86a_b29949194b", "ext": ".jpeg", "mime": "image/jpeg", "width": 156, "height": 156, "size": 3.61, "url": "/uploads/thumbnail_86a_b29949194b.jpeg" }, "medium": { "hash": "medium_86a_b29949194b", "ext": ".jpeg", "mime": "image/jpeg", "width": 750, "height": 750, "size": 45.53, "url": "/uploads/medium_86a_b29949194b.jpeg" }, "small": { "hash": "small_86a_b29949194b", "ext": ".jpeg", "mime": "image/jpeg", "width": 500, "height": 500, "size": 24.04, "url": "/uploads/small_86a_b29949194b.jpeg" } }, "hash": "86a_b29949194b", "ext": ".jpeg", "mime": "image/jpeg", "size": 52.58, "url": "/uploads/86a_b29949194b.jpeg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-04-18T08:42:13.713Z", "updated_at": "2020-04-18T08:42:13.713Z" }, { "id": 352, "name": "86c", "alternativeText": null, "caption": null, "width": 600, "height": 600, "formats": { "thumbnail": { "hash": "thumbnail_86c_fc3738188f", "ext": ".jpeg", "mime": "image/jpeg", "width": 156, "height": 156, "size": 4.3, "url": "/uploads/thumbnail_86c_fc3738188f.jpeg" }, "small": { "hash": "small_86c_fc3738188f", "ext": ".jpeg", "mime": "image/jpeg", "width": 500, "height": 500, "size": 34.07, "url": "/uploads/small_86c_fc3738188f.jpeg" } }, "hash": "86c_fc3738188f", "ext": ".jpeg", "mime": "image/jpeg", "size": 46.83, "url": "/uploads/86c_fc3738188f.jpeg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-04-18T08:42:13.725Z", "updated_at": "2020-04-18T08:42:13.725Z" }], "thumbnail": { "id": 353, "name": "86a", "alternativeText": null, "caption": null, "width": 800, "height": 800, "formats": { "thumbnail": { "hash": "thumbnail_86a_8cb6df1843", "ext": ".jpeg", "mime": "image/jpeg", "width": 156, "height": 156, "size": 3.61, "url": "/uploads/thumbnail_86a_8cb6df1843.jpeg" }, "medium": { "hash": "medium_86a_8cb6df1843", "ext": ".jpeg", "mime": "image/jpeg", "width": 750, "height": 750, "size": 45.53, "url": "/uploads/medium_86a_8cb6df1843.jpeg" }, "small": { "hash": "small_86a_8cb6df1843", "ext": ".jpeg", "mime": "image/jpeg", "width": 500, "height": 500, "size": 24.04, "url": "/uploads/small_86a_8cb6df1843.jpeg" } }, "hash": "86a_8cb6df1843", "ext": ".jpeg", "mime": "image/jpeg", "size": 52.58, "url": "/uploads/86a_8cb6df1843.jpeg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-04-18T08:42:13.735Z", "updated_at": "2020-04-18T08:42:13.735Z" } }] }, { "id": 13, "name": "Meat", "slug": "meat", "description": null, "created_at": "2020-03-18T06:54:20.047Z", "updated_at": "2020-04-12T06:44:14.588Z", "products": [{ "id": 80, "title": "Tesco Eat Fresh Frozen Lamb Bone in Cube", "is_featured": false, "is_hot": false, "price": 21.89, "sale_price": null, "vendor": "Global Office", "review": 4, "is_out_of_stock": false, "depot": 60, "inventory": 70, "is_active": true, "is_sale": false, "created_at": "2020-03-18T06:54:02.670Z", "updated_at": "2020-03-18T06:54:02.670Z", "variants": [], "images": [{ "id": 321, "name": "81a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "d8e508fc912641f58f58138b16e792ce", "ext": ".jpg", "mime": "image/jpeg", "size": 109.76, "url": "/uploads/d8e508fc912641f58f58138b16e792ce.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T06:54:02.708Z", "updated_at": "2020-03-18T06:54:02.708Z" }], "thumbnail": { "id": 320, "name": "81a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "9f48e963891b43329a100e704a4ae84c", "ext": ".jpg", "mime": "image/jpeg", "size": 109.76, "url": "/uploads/9f48e963891b43329a100e704a4ae84c.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-18T06:54:02.693Z", "updated_at": "2020-03-18T06:54:02.693Z" } }] }, { "id": 14, "name": "Book", "slug": "book", "description": null, "created_at": "2020-03-28T10:59:05.002Z", "updated_at": "2020-03-28T10:59:05.002Z", "products": [{ "id": 6, "title": "Grand Slam Indoor Of Show Jumping Novel", "is_featured": false, "is_hot": false, "price": 41.99, "sale_price": 32.99, "vendor": "Robert's Store", "review": 4, "is_out_of_stock": false, "depot": 68, "inventory": 90, "is_active": true, "is_sale": true, "created_at": "2020-03-15T06:04:35.781Z", "updated_at": "2020-04-14T10:46:09.145Z", "variants": [], "images": [{ "id": 24, "name": "6a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "5c7442b5104545afa78bfe819616d298", "ext": ".jpg", "mime": "image/jpeg", "size": 52.29, "url": "/uploads/5c7442b5104545afa78bfe819616d298.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:07:56.574Z", "updated_at": "2020-03-15T06:07:56.574Z" }, { "id": 25, "name": "6a.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "0a9100b8791b44ff9629377856bab05a", "ext": ".jpg", "mime": "image/jpeg", "size": 52.29, "url": "/uploads/0a9100b8791b44ff9629377856bab05a.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:07:56.593Z", "updated_at": "2020-03-15T06:07:56.593Z" }], "thumbnail": { "id": 23, "name": "5.jpg", "alternativeText": null, "caption": null, "width": null, "height": null, "formats": null, "hash": "e2132e11d3c34da89511593297697922", "ext": ".jpg", "mime": "image/jpeg", "size": 10.17, "url": "/uploads/e2132e11d3c34da89511593297697922.jpg", "previewUrl": null, "provider": "local", "provider_metadata": null, "created_at": "2020-03-15T06:07:56.562Z", "updated_at": "2020-03-15T06:07:56.562Z" } }] }]) 
   }, 
   collections: (req, res, next) => { 
       Category.aggregate([{ $lookup: { 'from': 'products', "localField": "_id", "foreignField": "category", as: 'products' } }]).then(d => { 
           res.send(d); 
       }).catch(e => { 
           res.send(e); 
       }) 
   }, 
   uploadExcel: (req, res, next) => { 

       //console.log(path.extname(req.files[0].originalname).toLowerCase()); 

       if (path.extname(req.files[0].originalname).toLowerCase() != '.xlsx') { 
           res.send({ status: false, message: "please upload excel file with 'xlsx' ext." }) 
           return; 
       } 

       var obj = xlsx.parse(path.join(__dirname, '../', req.files[0].path)); 
       // console.log(obj[0].data) 
       tempProdArray = obj[0].data; 

       prodArray = []; 


       tempProdArray.map((i, j) => { 
           if (j == 0) { 

           } else { 
               let tp = { 
                   title: i[0], 
                   is_featured: i[1], 
                   is_hot: i[2], 
                   is_sale: i[3], 
                   is_active: i[4], 
                   price: i[5], 
                   sale_price: i[6], 
                   vendor: i[7], 
                   inventory: i[8], 
                   description: i[9], 
                   loginid: req.user._id 
               } 

               prodArray.push(tp); 
           } 
       }) 

       console.log(prodArray); 

       //  p={  
       //     title, 
       //     is_featured, 
       //     is_hot:is_hot||0, 
       //     is_sale:is_sale||0, 
       //     is_active:is_active||0, 
       //     price, 
       //     sale_price:sale_price||0, 
       //     vendor, 
       //     reviewcount:reviewcount||0, 
       //     is_out_of_stock:is_out_of_stock||0, 
       //     depot:depot||0, 
       //     inventory:inventory||0, 
       //     variants:variants, 
       //     category:category, 
       //     images:images||[], 
       //     thumbnail:thumbnail||[], 
       //     loginid, 
       //     description, 
       //     spec, 
       //     color:color||[], 
       //             location:location||[], 
       //             keywords:keywords||[], 
       //             rewardpoint:rewardpoint||0 
       // } 


       Product.create(prodArray).then((data) => { 
           res.send({ status: true, data }) 
           return; 
       }) 
           .catch((e) => { 
               console.log(e) 
               res.send({ status: false, message: e, message: 'please provide correct file' }); 
           }) 

   }, 
   productDetail: async (req, res, next) => { 
       try { 

           if (req.body.id !== '' && typeof req.body.id !== 'undefined') { 
               // let products=await Product.aggregate([ 
               //      {$match:{_id:mongoose.Types.ObjectId(req.body.id)}}, 
               //      {$lookup:{from:'review',localField:'_id',foreignField:'product_id',as:'review'}}, 
               //      {$lookup:{from:'review',localField:'loginid',foreignField:'seller_id',as:'seller_review'}} 
               //  ])  
               let products = await Product.findOne({ _id: req.body.id }).lean().exec(); 

               if (products) { 

                   const Varients = []; 
                   products.variants.forEach(E => { 
                       const v = { 
                           label: E.label, 
                           value: E.value.split(',') 
                       } 
                       Varients.push(v); 
                   }); 

                   products.variants = Varients; 

                   let review = await Review.find({ product_id: req.body.id }) 
                   let sellerreview = await Review.find({ loginid: products.loginid }) 
                   let category = await Category.find({ _id: { $in: products.category } }, { name: 1 }) 
                   let check = products; 
                   check.review = review ? review : []; 
                   check.sellerreview = sellerreview ? sellerreview : [] 
                   check.category_name = category.length > 0 ? category.map(obj => obj['name']) : [] 
                   res.send({ status: true, check }); 
                   return; 
               } else { 
                   res.send({ status: false, message: 'no data found!' }) 
                   return; 
               } 
           } else { 
               res.send({ status: false, message: 'Enter all required fields!' }); 
           } 

       } catch (e) { 
           console.log(e) 
           res.send({ status: false, message: e, message: e.message }); 
       } 
   }, 
   relatedProducts: async (req, res, next) => { 
       try { 
           if (req.body.id !== '' && typeof req.body.id !== 'undefined') { 
               let products = await Product.findOne({ _id: req.body.id }) 
               if (products) { 

                   let use = products.toJSON() 
                   console.log(use) 
                   let search_key = ".*" + use.title + ".*"; 
                   let expression = `/^${use.name}/`; 
                   // console.log(search_key) 
                   let relatedProducts = await Product.find({ _id: { $nin: [req.body.id] } }) 
                   console.log(relatedProducts) 
                   if (relatedProducts.length > 0) { 
                       res.send({ status: true, result: relatedProducts }) 
                       return; 
                   } else { 
                       res.send({ status: false, message: 'Not found!' }); 
                       return; 
                   } 
               } else { 
                   res.send({ status: false, message: 'Not found!' }); 
                   return; 
               } 
           } else { 
               res.send({ status: false, message: 'Enter all required fields!' }); 
           } 

       } catch (e) { 
           res.send({ status: false, message: e.message }); 
       } 
   }, 
   contactUs: async (req, res, next) => { 
       try { 
           if (typeof req.body.name !== 'undefined' && typeof req.body.email !== 'undefined' && typeof req.body.subject !== 'undefined' && typeof req.body.message !== 'undefined') { 
               let data = { 
                   name: req.body.name, 
                   email: req.body.email, 
                   subject: req.body.subject, 
                   message: req.body.message 
               } 
               Contact.create(data).then(user => { 
                   var mailOptions = { 
                       from: 'no-reply@gmail.com', 
                       to: adminEmail, 
                       subject: 'Contact Us', 
                       text: `${JSON.stringify(data)}` 
                   }; 
                   transporter.sendMail(mailOptions, function (error, info) { 
                       if (error) { 
                           console.log(error); 
                       } else { 
                           console.log('Email sent: ' + info.response); 
                       } 
                   }); 
                   res.send({ status: true, result: user }) 
                   return; 
               }).catch(err => { 
                   res.send({ status: false, message: 'Something went wrong!' }); 
               }) 
           } else { 
               res.send({ status: false, message: 'Enter all required fields!' }); 
           } 
       } catch (e) { 
           res.send({ status: false, message: e.message }); 
       } 
   }, 
   newsLetterSubscribe: async (req, res, next) => { 
       try { 
           const { email } = req.body; 
           if (!email) { 
               res.send({ status: false, message: 'Enter all required fields!' }); 
               return; 
           } 
           let news = await Newsletter.findOne({ email: req.body.email }) 
           if (news) { 
               res.send({ status: false, message: 'You are already subscribed!' }); 
               return; 
           } 
           Newsletter.create({ email: req.body.email }).then(user => { 
               res.send({ status: true, message: 'You are successfully subscribed' }); 
           }).catch(err => { 
               res.send({ status: false, message: e.message }); 
           }) 
       } catch (e) { 
           res.send({ status: false, message: e.message }); 
       } 
   }, 

   newsLetterUnSubscribe: async (req, res, next) => { 
       try { 
           const { email } = req.body; 
           if (!email) { 
               res.send({ status: false, message: 'Enter all required fields!' }); 
               return; 
           } 
           Newsletter.deleteMany({ email: req.body.email }).then(user => { 
               res.send({ status: true, message: 'You are successfully Unsubscribed' }); 
           }).catch(err => { 
               res.send({ status: false, message: e.message }); 
           }) 
       } catch (e) { 
           res.send({ status: false, message: e.message }); 
       } 
   }, 

   loginHistory: async (req, res, next) => { 
       try { 
           const reqBody = req.body; 
           const Limit = parseInt(reqBody.limit) || 10; 
           const PageNo = parseInt(reqBody.pageno) || 0; 
           const data = await UserLogins.aggregate([ 
               { $lookup: { from: 'profiles', localField: '_id', foreignField: "loginid", as: "profileInfo" } }, 
               { $unwind: { path: '$profileInfo', preserveNullAndEmptyArrays: true } }, 
               { $skip: (PageNo * Limit) }, 
               { $limit: Limit }, 
               { 
                   $project: { 
                       '_id': 1, 
                       'type_login': 1, 
                       'ip_address': 1, 
                       'no_of_loggedin': 1, 
                       'last_login_time': 1, 
                       'email': 1, 
                       'roles': 1, 
                       'mobile_number': 1, 
                       'profileInfo.name': 1, 
                   } 
               }, 
           ]); 
           return res.send({ status: true, result: data, total: data.length, message: ' Get login history successfully' }); 
       } catch (error) { 
           return res.send({ status: false, message: error.message }); 
       } 
   }, 

   logout: (req, res, next) => { 
       try { 
           if (req.user) { 
               req.user = null; 
               return res.send({ status: true, message: 'Logout Successfully' }); 
           } 
       } catch (error) { 
           return res.send({ status: false, message: error.message }); 
       } 
   } 

} 

function generateOTP() { 

   var digits = '0123456789'; 
   let OTP = ''; 
   for (let i = 0; i < 4; i++) { 
       OTP += digits[Math.floor(Math.random() * 10)]; 
   } 
   return OTP; 
} 