var nodemailer = require('nodemailer');
const firebase = require("firebase-admin");
const db = require('../_helper/db');
const UserLogins = db.UserLogins;
const Profile = db.Profile;
const Shipping_Codes = db.Shipping_Codes;
const Product = db.Product;
const serviceAccount = require('../_helper/firebase/secret.json');

// var transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: 'mail786tester@gmail.com',
//         pass: 'oaelwbhhckizzoce',
//         // user: 'admin@galinukkad.com',
//         // pass: 'Manish@123'
//     }
// });

// var transporterAdmin = nodemailer.createTransport({
//     host: "mail.privateemail.com",
//     port: 587,
//     secure: false,
//     auth: {
//         user: 'mail786tester@gmail.com',
//         pass: 'oaelwbhhckizzoce',
//         // user: 'admin@galinukkad.com',
//         // pass: 'Manish@123'
//     }
// });

// var transporterInfo = nodemailer.createTransport({
//     host: "mail.privateemail.com",
//     port: 587,
//     secure: false,
//     auth: {
//         user: 'info@galinukkad.com',
//         pass: 'Manish@123'
//     }
// });

var transporterAdmin = nodemailer.createTransport({
    // service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,     // 587 or 25 or 2525
    secure: true, 
    auth: {
      user: "sunildeveloper7@gmail.com", 
      pass: "developer@1234",
    },
});

var transporterInfo = nodemailer.createTransport({
    // service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,     // 587 or 25 or 2525
    secure: true, 
    auth: {
      user: "sunildeveloper7@gmail.com", 
      pass: "developer@1234",
    },
});

const Helper = {
    
    sendNotification(title, message) {
    return new Promise(async (resolve, reject) => {
        try {
            await UserLogins.find({ $and: [ {'firebase_token': {$ne: null }}, {'firebase_token': {$ne: '' }} ] }).then((data) => {
             
              for(i=0; i<data.length; i++){
                 let firebaseToken = data[i].firebase_token;
                firebase.initializeApp({
                credential: firebase.credential.cert(serviceAccount),
                databaseURL: "https://galinukkad.firebaseio.com"
              });

              const payload = {
                notification: {
                  title: title,
                  body: message,
                }
              };
             
              const options = {
                priority: 'high',
                timeToLive: 60 * 60 * 24, // 1 day
              };
                let firebaseToken1 = data[i].firebase_token;      
                console.log(firebaseToken1);
                if(firebaseToken1 != null){
                    firebase.messaging().sendToDevice(firebaseToken1, payload, options)  
                }
                
              }
              // .then(function(response){
              //   console.log("successfully send message", response);
              // })
              // .catch(function(error){
              //   console.log('Error sending message', error);
              // });
             })
           
        } catch (error) {
            return resolve(false);
        }
    });
},


    sendEmail(email, subject, msg_body) {
        // email sending
        var mailOptions = {
            from: 'sunildeveloper7@gmail.com',
            to: email,
            subject: subject,
            html: msg_body
        };
        transporterAdmin.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    },

    sendEmailInfo(email, subject, msg_body) {
        // email sending
        var mailOptions = {
            from: 'sunildeveloper7@gmail.com',
            to: email,
            subject: subject,
            html: msg_body
        };
        transporterInfo.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    },

    trackStatus() {
        return ['Pending', 'Processed', 'Shipped', 'Delivered'];
    },

    ckeckTrackStatus(status) {
        if (status && (this.trackStatus()).includes(status)) {
            return true;
        } else {
            return false;
        }
    }, 


    // Multiply When Product Weight Greater Than Value Every 500g Weight
    productWeightCalculationCharge(product_weight) {
        let get_weight_charge = product_weight / 500; // Product Weight 
        let product_weight_charge = parseInt((get_weight_charge+"").split(".")[0]) + 1;  
        return product_weight_charge;
    },


    calculateSurcharge(base_shipping_price, product_weight_charge_check) {
        let calculate_surcharge = (base_shipping_price * product_weight_charge_check) + (base_shipping_price * product_weight_charge_check) * 40 / 100;
        return calculate_surcharge;
    }, 

    
    extraLocationRegularUpRosChrages(customer_address, seller_address) {
        
        let upcountry_location_charge = 0;
        if(customer_address.Regular_UP_ROS === "UP") {
            upcountry_location_charge = 5;
        }

        if(seller_address.Regular_UP_ROS === "UP") {
            upcountry_location_charge = upcountry_location_charge + 5;
        }

        let rest_of_state_charge = 0;
        if(customer_address.Regular_UP_ROS === "ROS") {
            rest_of_state_charge = 10;
        }

        if(seller_address.Regular_UP_ROS === "ROS") {
            rest_of_state_charge = rest_of_state_charge + 10;
        }

        return Regular_UP_ROS_total_charges = rest_of_state_charge + upcountry_location_charge;

    },


    totalShippingChargesCalculation(base_shipping_price, product_weight,  customer_address, seller_address) {
        let product_weight_charge_check = Helper.productWeightCalculationCharge(product_weight);           
        let calculate_surcharge = Helper.calculateSurcharge(base_shipping_price, product_weight_charge_check);
        let Regular_UP_ROS_total_charges = Helper.extraLocationRegularUpRosChrages(customer_address, seller_address);
        let shipping_result = calculate_surcharge + Regular_UP_ROS_total_charges + calculate_surcharge * 18 / 100;

        return shipping_result;
    },


    async galinukkadShippingPrice(item, pincode) {


        
        let seller_id = item.loginid;
        let product_id = item._id;

        let seller_detail = await Profile.findOne({loginid: seller_id});
        let metro_cities = ['DELHI', 'MUMBAI', 'BENGALURU', 'CHENNAI', 'KOLKATA'];

        if (!pincode) {
            return res.send({ status: false, message: 'pincode is required' });
        }


        let product = await Product.findById(product_id).select('title weight price loginid');
        
        const customer_address = await Shipping_Codes.findOne( { pincode: pincode } ).select('pincode area region city_name dv_routing_code state  Regular_UP_ROS').lean().exec();
        const seller_address = await Shipping_Codes.findOne( { pincode: seller_detail.postal } ).select('pincode area region city_name dv_routing_code state  Regular_UP_ROS').lean().exec();
        
        if(!customer_address || !seller_address) {
            return res.send({ status: false, message: 'pincode not found' });
        }

        
        let product_weight = product.weight;
        let galinukkkad_base_price = 50;
        let product_weight_charge_check = Helper.productWeightCalculationCharge(product_weight);           


        let galinukkad_shipping_price = galinukkkad_base_price * product_weight_charge_check;

        let galinukkad_shipping_price_details = {
            product_id : product._id, 
            seller_id :  product.loginid, 
            product_weight :  product_weight, 
            seller_pincode: seller_address.pincode, 
            customer_pincode: customer_address.pincode, 
            galinukkad_shipping_price: galinukkad_shipping_price
        };

        return galinukkad_shipping_price_details;

    },


    async mainEcomExpressPricing(item, pincode) {

            let seller_id = item.loginid;
            let product_id = item._id;

            let seller_detail = await Profile.findOne({loginid: seller_id});
            let metro_cities = ['DELHI', 'MUMBAI', 'BENGALURU', 'CHENNAI', 'KOLKATA'];

            if (!pincode) {
                return res.send({ status: false, message: 'pincode is required' });
            }


            let product = await Product.findById(product_id).select('title weight price loginid');
            
            const customer_address = await Shipping_Codes.findOne( { pincode: pincode } ).select('pincode area region city_name dv_routing_code state  Regular_UP_ROS').lean().exec();
            const seller_address = await Shipping_Codes.findOne( { pincode: seller_detail.postal } ).select('pincode area region city_name dv_routing_code state  Regular_UP_ROS').lean().exec();
            
            if(!customer_address || !seller_address) {
                return res.send({ status: false, message: 'pincode not found' });
            }

            let delivery_message = 'Product is available for delivery in this pin code';
            
            let base_shipping_price;
            let product_weight = product.weight;

            let shipping_price_detail = {
                product_id : product._id, 
                seller_id :  product.loginid, 
                product_weight :  product_weight, 
                seller_pincode: seller_address.pincode, 
                customer_pincode: customer_address.pincode, 
            };

            let north_east_states = ['MN', 'TR', 'ML', 'AR', 'SK', 'NL', 'MZ'];

            // ZONE A INTRA CITY 
            if(customer_address.city_name === seller_address.city_name) {
                base_shipping_price = 27; // Intra City Shipping Price

                let shipping_charge = Helper.totalShippingChargesCalculation(base_shipping_price, product_weight, customer_address, seller_address);

                shipping_price_detail['zone'] = 'A';
                shipping_price_detail['friegth_rates_for'] = 'Intra City';
                shipping_price_detail['ecom_express_price'] = shipping_charge;

                return shipping_price_detail;

            }else if(customer_address.region === seller_address.region && customer_address.state != 'JK' && seller_address.state != 'JK') {
                // CHECK RESULT FOR REGION
                base_shipping_price = 33;  
                let shipping_charge = Helper.totalShippingChargesCalculation(base_shipping_price, product_weight, customer_address, seller_address);

                shipping_price_detail['ecom_express_price'] = shipping_charge;
                shipping_price_detail['zone'] = 'B';
                shipping_price_detail['friegth_rates_for'] = 'Intra-Region';

                return shipping_price_detail;
                

            }else if(customer_address.state === "JK" || seller_address.state === "JK") {
                // SELLER OR CUSTOMER LOCATION ARE JNK
                base_shipping_price = 45;  
                let shipping_charge = Helper.totalShippingChargesCalculation(base_shipping_price, product_weight, customer_address, seller_address);

                shipping_price_detail['ecom_express_price'] = shipping_charge;
                shipping_price_detail['zone'] = 'E';
                shipping_price_detail['friegth_rates_for'] = 'J&K';

                return shipping_price_detail;

            }else if(metro_cities.includes(customer_address.city_name) &&  metro_cities.includes(seller_address.city_name)) {
                // FOR BOTH SELLER AND CUSTOMER ARE IN METRO CITIES
                base_shipping_price = 38;  
                let shipping_charge = Helper.totalShippingChargesCalculation(base_shipping_price, product_weight, customer_address, seller_address);

                shipping_price_detail['ecom_express_price'] = shipping_charge;
                shipping_price_detail['zone'] = 'C';
                shipping_price_detail['friegth_rates_for'] = 'Metro';

                return shipping_price_detail;

            }else if(north_east_states.includes(customer_address.state) ||   north_east_states.includes(seller_address.state)) {
                // NORTH EAST AND ANDAMAN LOCATION PRICE AND SURCHARGE PRICE UP 50rs INCREASE  PER 500 GMS
                base_shipping_price = 45;  

                let shipping_charge = Helper.totalShippingChargesCalculation(base_shipping_price, product_weight, customer_address, seller_address);
                // ADD 50rs EVERY 500 GMS
                let product_weight_charge_check = Helper.productWeightCalculationCharge(product_weight);           
                let add_every_weight = product_weight_charge_check * 50;

                let total = add_every_weight + shipping_charge;


                shipping_price_detail['ecom_express_price'] = total;
                shipping_price_detail['zone'] = 'F';
                shipping_price_detail['friegth_rates_for'] = 'North East & Andaman';

                return shipping_price_detail;


            }else if(customer_address.region != seller_address.region) {
                // NON METRO CITIES AND OTHER CITY SHIPPING RESULT 
                base_shipping_price = 42;  
                let shipping_charge = Helper.totalShippingChargesCalculation(base_shipping_price, product_weight, customer_address, seller_address);
                
                shipping_price_detail['ecom_express_price'] = shipping_charge;
                shipping_price_detail['zone'] = 'D';
                shipping_price_detail['friegth_rates_for'] = 'Rest Of India';
                return shipping_price_detail;

            }
    }, 

    

}

module.exports = Helper;