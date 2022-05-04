const db = require('../_helper/db');
const Cart = db.Cart;
const Address = db.Address;
const Order = db.Order;
const OrderDetails = db.OrderDetails;
const Product = db.Product;
const UserLogins = db.UserLogins;
const Notification = db.Notification;
const return_policy_days = db.return_policy_days;
const replaceOrder = db.replaceOrder;
const Profile = db.Profile;
const bank_transaction =db.bank_transaction;
const { Validator } = require('node-input-validator');
const mongoose = require('mongoose');
// const stripe = require('stripe')('sk_test_51H8jVTACV9uhCScQgIrU5oSlhcvHPFbNz7E6YgAQR6jxo80lkDnJKzW38iTgPyWbYvMC5kIYC8gBg1XcxHvn7uBu00uaKBijTl');
const stripe = require('stripe')('sk_test_51Hp48qFPyhppKVhzWAGzDhsJivsfFwlDUY614gOB0ts4ctUzRFVuaev2ntLyNhsuGfn4nFTRPTgIa0o9EwqS9HXZ00Cxxeaj55');

let moment = require('moment');
const couponCodesController = require('./couponCodesController');
const { Payment_details, Shipping_Rates, Review } = require('../_helper/db');
const SendNotification = require('../_helper/send-notification.js');
const Order_Return = db.Order_Return;
const { ROLES } = require('./../config.json');
const Helper = require('../core/helper');



const Razorpay = require('razorpay');
const sharp = require('sharp');
var path = require('path');
var fs = require('fs');



const razorPay_Key_id = 'rzp_test_vUeHUOcL1UAm7t';
const razorPay_Key_Secret = 'xuEt3COYtBjEOu1W716oHCeF';

const razorpay = new Razorpay({
    key_id: razorPay_Key_id,
    key_secret: razorPay_Key_Secret
});



// exports.placeOrder = async (req, res, next) => {
//     try {

//         let v = new Validator(req.body, { //validator 
//             product: 'required',
//             payment_method: 'required'
//         })

        
//         let orderNumber = Math.floor(100000 + Math.random() * 900000)
//         let check = await v.check();
//         if (!check) {
//             res.status(422).json({
//                 statusCode: 422,
//                 message: 'Please enter all required field',
//             });
//         } else {
//             let productIds = req.body.product.map(obj => obj['id'])

//             let products = await Product.find({ _id: { $in: productIds } })
//             console.log(req.body.product, products);
//             for (const data of req.body.product) {

//                 let prod = await Product.findOne({ _id: data.id }, { inventory: 1, loginid: 1, title: 1 })

//                 if (prod) { // if product available
//                     let updatedInvetory = prod.inventory - parseInt(data.quantity)
//                     await Product.updateOne({ _id: data.id }, { $set: { inventory: updatedInvetory } })
//                     if (updatedInvetory <= 5) { // creating notification for seller if inventory is less than 5
//                         let data = {
//                             loginid: prod.loginid,
//                             message: `Your product name ${prod.title} is low in an inventory.Please update inventory`,
//                             notification_type: 'product_low_inventory'
//                         }
//                         await Notification.create(data)
//                     }
//                 }
//             }

//             let data = {
//                 number: orderNumber,
//                 email: req.body.email,
//                 phone: req.body.phone,
//                 fname: req.body.fname,
//                 lname: req.body.lname,
//                 companyname: req.body.companyname,
//                 country: req.body.country,
//                 add1: req.body.add1,
//                 add2: req.body.add2,
//                 state: req.body.state,
//                 quantity: req.body.quantity,
//                 postal: req.body.postal,
//                 seller_id: products.map(obj => obj['loginid']),
//                 product: req.body.product,
//                 address_id: req.body.address_id,
//                 loginid: req.user._id,
//                 payment_method: req.body.payment_method,
//                 payment_status: 0,
//                 // payment_status: req.body.payment_method === "COD" ? 0 : 1,
//                 amount: req.body.amount
//             };

//             Order.create(data).then(user => {
//                 console.log('USER_TOP', user)
//                 if (req.body.payment_method != "COD") {
//                     console.log('REQ>BODY', req.body)
//                     stripe.charges.create({
//                         amount: req.body.amount,
//                         currency: "usd",
//                         source: req.body.stripe_token, // obtained with Stripe.js
//                         metadata: { 'order_id': orderNumber }
//                     }).then(user1 => {
//                         console.log('USER1', user1)
//                         res.send({ status: true, message: "Order placed!!!", result: user1 });
//                         return
//                     }).catch(err => {
//                         console.log('ERROR', err)
//                         res.send({ status: false, message: err.message });
//                         return
//                     });
//                     // stripe.customers.create({
//                     //     email: 'dev786tester@gmail.com',
//                     // }).then(customer=>{

//                     //     stripe.invoiceItems.create({
//                     //         customer: customer.id,
//                     //         amount: req.body.amount,
//                     //         currency: 'INR',
//                     //         description: 'Order Payment',
//                     //       })
//                     // }).then((invoice) => {
//                     //     // New invoice created on a new customer

//                     //     res.send({status:true,message:"Order placed!",result:user});
//                     //     return
//                     // }).catch(err=>{
//                     //     console.log(err)
//                     //     res.send({status:false,message:"Payment error!"});
//                     //     return
//                     // }) 
//                 } else {
//                     console.log('user', user)
//                     return res.send({ status: true, message: "Order placed!", result: user });
//                 }

//             }).catch(err => {
//                 console.log(err)
//                 res.send({ status: false, message: err.message });
//             })
//         }
//     } catch (e) {
//         console.log(e)
//         res.send({ status: false, message: e.message });
//     }

// }


exports.getProductByOrder = async (req, res, next) => {
    try {
        var sellerId = req.body.seller_id;
        var dateFilter = req.body.dateFilter;
    
        const data =  await OrderDetails.aggregate([
            { $match: {$and: [{ seller_id: mongoose.Types.ObjectId (sellerId) },  
			{ create: { $gte: new Date(dateFilter.from_date), $lt: new Date( dateFilter.to_date ) }}
		] } },
            {
             $lookup:
               {
                 from: "products",
                 localField: "product_id",
                 foreignField: "_id",
                 as: "product_details"
               }
            },
            { $unwind: { path: "$product_details", preserveNullAndEmptyArrays: true } },
            {
                $lookup:
                  {
                    from: "categories",
                    localField: "category_id",
                    foreignField: "_id",
                    as: "category_details"
                  }
               },
             { $unwind: { path: "$category_details", preserveNullAndEmptyArrays: true } },
            {
            $lookup:
                {
                    from: "userlogins",
                    localField: "seller_id",
                    foreignField: "_id",
                    as: "seller_details"
                }
            },
            { $unwind: { path: "$seller_details", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                created_at:1,
                amount: 1,  
                quantity:1,
                "seller_details.email": 1,
                "product_details.title": 1,
                "category_details.gst": 1,
                "category_details.commission": 1,
                shippingCharges:1,
                place_order: { $sum: [ "$amount", "$shippingCharges" ] },
                total: { $multiply: [ "$category_details.gst", "$category_details.commission" ] },
                commission_amount: { $divide: [ { $multiply: [ "$amount", "$category_details.commission" ] }, 100]},
                gst: { $subtract: [ "$amount", { $divide: [ { $multiply: [ "$amount", "$category_details.commission" ] }, 100]} ] },
                }
            }
            ])

        return res.send({ status: true, data: data });

    } catch (error) {
    
        return res.send({ status: false, message: error.message });
    }
    // Category.find().then((data) => {
    //     res.send({ status: true, data })
    // });
}

exports.placeOrderGuest = async (req, res, next) => {
    try {
        let v = new Validator(req.body, { //validator 
            email: 'required',
            phone: 'required',
            fname: 'required',
            lname: 'required',
            companyname: 'required',
            country: 'required',
            add1: 'required',
            // add2: 'required',
            state: 'required',
            postal: 'required',
            product: 'required',
            payment_method: 'required',
        })
        let orderNumber = Math.floor(100000 + Math.random() * 900000)
        let check = await v.check();
        if (!check) {
            res.status(422).json({
                statusCode: 422,
                message: 'Please enter all required field',
            });
        } else {
            let productIds = req.body.product.map(obj => obj['id'])

            let products = await Product.find({ _id: { $in: productIds } })
            for (const data of req.body.product) {

                let prod = await Product.findOne({ _id: data.id }, { inventory: 1, loginid: 1, title: 1 })

                if (prod) { // if product available

                    let updatedInvetory = prod.inventory - parseInt(data.quantity)

                    await Product.updateOne({ _id: data.id }, { $set: { inventory: updatedInvetory } })
                    if (updatedInvetory <= 5) { // creating notification for seller if inventory is less than 5
                        let data = {
                            loginid: prod.loginid,
                            message: `Your product name ${prod.title} is low in an inventory.Please update inventory`,
                            notification_type: 'product_low_inventory'

                        }
                        await Notification.create(data)
                    }
                }

            }
            let data = {
                email: req.body.email,
                phone: req.body.phone,
                number: orderNumber,
                fname: req.body.phone,
                lname: req.body.lname,
                companyname: req.body.companyname,
                country: req.body.country,
                add1: req.body.add1,
                add2: req.body.add2,
                state: req.body.state,
                quantity: req.body.quantity,
                seller_id: products.map(obj => obj['loginid']),
                postal: req.body.postal,
                product: req.body.product,
                payment_method: req.body.payment_method,
                payment_status: req.body.payment_method === "COD" ? 0 : 1,
                amount: req.body.amount
            }

            Order.create(data).then(user => {
                res.send({ status: true, message: "Order placed!", result: user });
            }).catch(err => {
            
                res.send({ status: false, message: "Something went wrong!" });
            })
        }
    } catch (e) {
    
        res.send({ status: false, message: "Something went wrong!" });
    }
}

exports.listOrder = async (req, res, next) => {
    try {

        const reqBody = req.body;
        const Limit = reqBody.limit ? parseInt(reqBody.limit) : 10;
        const PageNo = reqBody.page ? parseInt(reqBody.page) : 0;
        let filter = {};

        if (req.user && req.user.role === ROLES[0]) {
            filter = { loginid: mongoose.Types.ObjectId(req.user._id) }
        }

        if (req.user && req.user.role === ROLES[1]) {
            filter = { seller_id: mongoose.Types.ObjectId(req.user._id) }
        }

        let orderDetail = await Order.aggregate([
            { $match: filter },
            // {$lookup:{from:'products',localField:'product_id',foreignField:'_id',as:'product'}},
            // {$unwind:{path:'$product',preserveNullAndEmptyArrays:true}},
            { $lookup: { from: 'addresses', localField: 'address_id', foreignField: '_id', as: 'address' } },
            { $unwind: { path: '$address', preserveNullAndEmptyArrays: true } },
            { $sort: { updated: -1 } },
            { $skip: (PageNo * Limit) },
            { $limit: Limit }
        ])

        if (orderDetail) {
            let productIds = orderDetail.map(obj => obj['id'])
            for (let i = 0; i < orderDetail.length; i++) {
                let products = await Product.find({ id: { $in: productIds } })
                let can_give_feedback = 0;
                if (orderDetail[i].status === 1) {
                    can_give_feedback = 1
                }
                let is_order_refundable = 0
                let is_order_returnable = 0
                if (orderDetail[i].status === 3) {
                    is_order_returnable = 1
                } else if (orderDetail[i].status === 4) {
                    is_order_refundable = 1
                }

                orderDetail[i].products = products.length > 0 ? products : []
                orderDetail[i].delivery_date = moment(orderDetail[i].created).add(7, 'days')
                orderDetail[i].can_give_feedback = can_give_feedback
                orderDetail[i].is_order_refundable = is_order_refundable
                orderDetail[i].is_order_returnable = is_order_returnable
            }
            res.send({ status: true, message: "Record fetched", result: orderDetail });
        } else {
            res.send({ status: false, message: "Record not found" });
        }

    } catch (e) {
    
        res.send({ status: false, message: "Something went wrong!" });
    }
}

exports.guestOrderList = async (req, res, next) => {
    try {
        Order.find({ email: req.body.email }).then(user => {

            res.send({ status: true, message: "Record fetched", result: user });
        }).catch(err => {
        
            res.send({ status: false, message: "Something went wrong!" });
        })
    } catch (e) {
        res.send({ status: false, message: "Something went wrong!" });
    }
}

exports.cancelOrder = async (req, res, next) => {
    try {

        if (!req.body.order_id) {
            return res.send({ status: false, message: 'Order id is required' });
        }   
        
            let {order_id, product_id, cancel_id} = req.body;
            let user_detail = await UserLogins.findOne({ email: cancel_id })


            // ORDER ITEM CANCEL 
            OrderDetails.findOneAndUpdate({ order_number: order_id, product_id }, { $set: { item_status: 2, cancelled_date: new Date(), cancel_desc: req.body.description} }).then(async(order_detail) => {

                try {
                    let product = await Product.findById(order_detail.product_id);
                    let msg_body = `Hi, ${user_detail.username} <br />`; 
                    msg_body += `Your order item product <b> ${product.title} </b> has been cancelled successfully.`; 
                    msg_body += '<br />Thanks,<br />Gali Nukkad Team'; 

                    console.log("msg_body" , msg_body)
                    await Helper.sendEmail(user_detail.email, "Order Cancelled Successfully", msg_body); 
                }catch(e) {
                    console.log(e);
                }
                
                res.send({ status: true, message: "Order Successfully Cancelled", result: order_detail });
            }).catch(err => {
                res.send({ status: false, message: "Something went wrong!" });
            })
    } catch (e){
        console.log(e);
        res.send({ status: false, message: "Something went wrong!" });
    }
}

exports.addOrderAddress = async (req, res, next) => {
    try {
        let v = new Validator(req.body, { //validator 
            email: 'required',
            phone: 'required',
            fname: 'required',
            lname: 'required',
            country: 'required',
            add1: 'required',
            // add2: 'required',
            state: 'required',
            postal: 'required'
        })
        let check = await v.check();

        if (!check) {
            res.status(422).json({
                statusCode: 422,
                message: 'Please enter all required field',
            });
        } else {

            let data = {
                email: req.body.email,
                phone: req.body.phone,
                fname: req.body.fname,
                lname: req.body.lname,
                companyname: req.body.companyname,
                loginid: req.user._id,
                country: req.body.country,
                city: req.body.city,
                add1: req.body.add1,
                add2: req.body.add2,
                state: req.body.state,
                postal: req.body.postal,
            }
                data.isshipping = true

            const isExist = await Address.findOne({ loginid: req.user._id }).lean().exec();

            // if (isExist) {
            //     await Address.findByIdAndUpdate(isExist._id, data);
            //     return res.send({ status: true, message: "Address updated successfully", result: isExist });
            // }


            Address.create(data).then(user => {
                res.send({ status: true, message: "Address created successfully", result: user });
            }).catch(err => {
            
                res.send({ status: false, message: err.message });
            })
        }
    } catch (e) {
    
        res.send({ status: false, message: "Something went wrong!" });
    }
}

exports.retrieveAddress = async (req, res, next) => {
    try {
        Address.find({ loginid: req.user._id }).then(user => {
            if (user.length > 0) {
                res.send({ status: true, message: "Record found!", result: user });
            } else {
                res.send({ status: false, message: "Record not found!" });
            }
        }).catch(err => {
            res.send({ status: false, message: "Something went wrong!" });
        })
    } catch (e) {
        res.send({ status: false, message: "Something went wrong!" });
    }
}

exports.removeAddress = async (req, res, next) => {
    try {

        if (!req.body.id) {
            return res.send({ status: false, message: "Id is required" });
        }

        const isAddr = await Address.findByIdAndDelete(req.body.id);

        if (!isAddr) {
            return res.send({ status: false, message: "Address not found" });
        }

        return res.send({ status: true, message: "Record deleted!" });

    } catch (e) {
        res.send({ status: false, message: "Something went wrong!" });
    }
}

exports.returnOrder = async (req, res, next) => {
    try {
        const reqBody = req.body;
    
        const orderId = reqBody.id;
        // const productIds = reqBody.product.id;
        const order_item_id = reqBody.order_item_id;
        const description = reqBody.description;
        let reqFiles = req.files;

        
        if (!orderId) {
            return res.send({ status: false, message: "required parameter missing" });
        }
        

        
        let orderDetail = await OrderDetails.findOne({ order_number: orderId, _id: order_item_id });
    
        let productImages = [];

            reqFiles.forEach(E => {

                var filePath = path.join(__dirname, '../public/return-images/');
                if (!fs.existsSync(filePath)) {
                    fs.mkdirSync(filePath);
                }

                const fileUrl = filePath + E.filename;

                sharp(E.path).resize(300, 200).toFile(fileUrl, function (err) {
                    if (err) {
                    
                    }
                });

                const str = E.originalname;
                const extension = str.substr(str.lastIndexOf(".") + 1);

                const fJson = {
                    file: E.filename,
                    title: E.originalname,
                    file_type: extension,
                    file_size: E.size
                };

                productImages.push(fJson);
            });



        let return_data = { 
            item_status: 3, 
            track_status: 'Returned',
            return_desc: description, 
            returned_date: new Date(), 
            return_images: productImages
        }

        let orderDetailFind =  await OrderDetails.findOne({order_number: orderId, _id: order_item_id});
        let productFind =  await Product.findOne({ _id: reqBody.product_id});
        let userFind =  await UserLogins.findOne({ _id: productFind.loginid});

     


        if(orderDetailFind.item_status === 3) {
            return res.send({ status: false, message: "Your Product already returned successfully!" });
        }



        let orderReturned = await OrderDetails.findOneAndUpdate({ order_number: orderId, _id: order_item_id }, { $set: return_data });
        // let orderReturned = await OrderDetails.findOne({ order_number: orderId, _id: order_item_id });
        

        let orderData = await Order.findById(orderId).populate('loginid');


        let user_detail = orderData.loginid; // user details
        
        try {
            let product = await Product.findById(orderReturned.product_id).select('title');
            let msg_body = `Hi, ${user_detail.username} <br />`; 
            msg_body += `Your order item product <b> ${product.title} </b> has been returned successfully.`; 
            msg_body += '<br />Thanks,<br />Gali Nukkad Team'; 
            await Helper.sendEmail(user_detail.email, "Order Returned Successfully", msg_body); 

        //    let  return_order = `${user_detail.username} return this ${productFind.title} product`
           let  return_order = `Request has been taken from ${user_detail.username} to return your ${productFind.title}`

           let  user_id = userFind._id
            await SendNotification('', user_id, 'return_order',return_order );

        }catch(e) {
            console.log(e);
        }
        

        return res.send({ status: true, message: "Your Product has been returned successfully!" });

    } catch (e) {
        res.send({ status: true, message: e.message });
    }
}

exports.getSellerOrder = async (req, res, next) => {
    try {
        const reqBody = req.body;
        const { page, limit } = req.body;

        console.log('reqBody is' ,);
        console.log(reqBody);
        const seller_id = req.user._id;
        const Limit = limit ? parseInt(limit) : 10;
        const PageNo = page ? parseInt(page) : 0;
        const SkipRecord = Limit * PageNo;

        const dateFilter = reqBody.dateFilter ? reqBody.dateFilter : {};
        const monthWise = reqBody.monthWise ? reqBody.monthWise : {};

        const jsonStr = {};

        if (dateFilter.from_date && dateFilter.to_date) {
            jsonStr.create = { $gte: new Date(dateFilter.from_date), $lt: new Date(dateFilter.to_date) };
        }

        const otherMatch = {};
        if (monthWise.month && monthWise.year) {
            otherMatch.month = monthWise.month;
            otherMatch.year = monthWise.year;
        }

        if (!isNaN(reqBody.status) && reqBody.status !== "") {
            jsonStr.status = Number(reqBody.status);
        }

        let payment_status = req.body.payment_status;
      
        if(payment_status != undefined && payment_status != "" && payment_status != null) {
            jsonStr.payment_status = parseInt(payment_status);
        }

        const Records = await getDynamicSellerOrder(seller_id, Limit, SkipRecord, jsonStr, otherMatch);

        console.log("Records_____"  ,Records)
        const AllRecords = await getDynamicSellerOrder(seller_id, 0, 0, jsonStr, otherMatch);

        if (Records.message || AllRecords.message) {
            return res.send({ status: false, message: (Records.message || AllRecords.message) });
        }

        return res.send({
            status: true,
            message: "Seller List Get Successfully",
            data: Records,
            count: AllRecords.length
        });
    } catch (e) {
    
        res.send({ status: false, message: e.message });
    }
}

exports.getCustomerOrder = async (req, res, next) => {
    try {
        const reqBody = req.body;
        const { page, limit } = req.body;

        const customer_id = req.user._id;
        const Limit = limit ? parseInt(limit) : 10;
        const PageNo = page ? parseInt(page) : 0;
        const SkipRecord = Limit * PageNo;

        const dateFilter = reqBody.dateFilter ? reqBody.dateFilter : {};
        const monthWise = reqBody.monthWise ? reqBody.monthWise : {};

        const jsonStr = {};

        if (dateFilter.from_date && dateFilter.to_date) {
            jsonStr.create = { $gte: new Date(dateFilter.from_date), $lt: new Date(dateFilter.to_date) };
        }

        const otherMatch = {};
        if (monthWise.month && monthWise.year) {
            otherMatch.month = monthWise.month;
            otherMatch.year = monthWise.year;
        }

        if (!isNaN(reqBody.status) && reqBody.status !== "") {
            jsonStr.status = Number(reqBody.status);
        }

        jsonStr.loginid = mongoose.Types.ObjectId(customer_id);

        const Records = await getDynamicCustomerOrder(customer_id, Limit, SkipRecord, jsonStr, otherMatch);
        // const AllRecords = await getDynamicCustomerOrder(customer_id, 0, 0, jsonStr, otherMatch);
// console.warn("Recordssssssssssssssssssssssssssssssssaaaaaaaaaaaaaaaaaaa" ,"Records" , jsonStr)

        let orders = await Order.find({loginid: customer_id}).select('_id');


    
        let orderIds = [];
        orders.map((item) => {
            orderIds.push(item._id);
        })
      
        let orderDetails = await OrderDetails.find({ order_number: { $in: orderIds } }).populate('product_id', 'title price sale_price images').exec();
        const getOne = await return_policy_days.findOne({}).sort({created_at: -1}).lean().exec()
        const returnDays = getOne.days;
        console.log("getOne" , orderDetails[0])
        // if (Records.message || AllRecords.message) {
        //     return res.send({ status: false, message: (Records.message || AllRecords.message) });
        // }

        return res.send({
            status: true,
            message: "Customer Order List Get Successfully",
            data: Records,
            count: orders.length,    
            orderDetailsData: orderDetails
        });
    } catch (e) {
    
        res.send({ status: false, message: e.message });
    }
}


exports.getCustomerOrderItems = async (req, res, next) => {


    try {

        let user_email = req.body.user_detail;   
        let user = await  UserLogins.findOne({email: user_email});

        let orders = await Order.find({loginid: user._id}).select('_id');
        
        
        let orderIds = [];
        orders.map((item) => {
            orderIds.push(item._id);
        })
        let orderDetails = await OrderDetails.find({ order_number: { $in: orderIds } }).populate('product_id', 'title price sale_price images').exec();
        
        
        console.log(orderDetails);
        res.send({ status: true, orderDetails: orderDetails });
    }catch(e) {
        console.log(e);
        res.send({ status: false, message: e.message });
    }
}

exports.updateOrderItemTrackStatus = async (req, res, next) => {


    try {
        let {track_status, order_id, order_item_id} = req.body;

        let updateData = {
            track_status: track_status,
        }

        updateData['item_status'] = 0
        if(track_status === "Shipped") {
            updateData['shipping_date'] = new Date()
        }else if(track_status === "Out_For_Delivery") {
            updateData['our_for_delivery_date'] = new Date()
        }else if(track_status === "Delivered") {
            updateData['product_item_delivery_date'] = new Date()
            updateData['item_status'] = 1
        }
            
        console.log(updateData);


        OrderDetails.findOneAndUpdate({ order_number: order_id, _id: order_item_id }, { $set: updateData }).then(user => {
            res.send({ status: true, message: "Order Item Track Status has been successfully updated." });
        }).catch(err => {
            res.send({ status: false, message: "Something went wrong!" });
        })

    }
    catch(e) {
        console.log(e);
        return res.send({ status: false, message: e.message });
    }

}

exports.getAdminOrder = async (req, res, next) => {
    try {
        const reqBody = req.body;
        
        
        const currentPage = reqBody.page ? Number(reqBody.page) : 0;
        const Limit = reqBody.limit ? Number(reqBody.limit) : 10;
        const skipRecord = currentPage * Limit;


        const dateFilter = reqBody.dateFilter ? reqBody.dateFilter : {};
        const monthWise = reqBody.monthWise ? reqBody.monthWise : {};

        const jsonStr = {};

        if (dateFilter.from_date && dateFilter.to_date) {
            jsonStr.create = { $gte: new Date(dateFilter.from_date), $lt: new Date(dateFilter.to_date) };
        }

        if (monthWise.month && monthWise.year) {
            jsonStr.month = monthWise.month;
            jsonStr.year = monthWise.year;
        }

        if (!isNaN(reqBody.status) && reqBody.status !== "") {
            jsonStr.status = Number(reqBody.status);
        }

        const PROJECT = {
            product: 1,
            number: 1,
            payment_method: 1,
            payment_status: 1, // 0 for not paid 1 for paid
            amount: 1,
            return_productIds: 1,
            return_products: 1,
            // 'return_products._id': 1,
            // 'return_products.title': 1,
            refund_productIds: 1,
            // 'refund_productIds._id': 1,
            // 'refund_productIds.title': 1,
            // 'refund_productIds.price': 1,
            // 'refund_productIds.discount': 1,
            // 'refund_productIds.discounted_price': 1,
            userInfo: 1,
            userAddressInfo: 1,
            description: 1,
            status: 1,
            track_status: {
                $ifNull: ['$track_status', 'Pending']
            },
            delivered_date: 1,
            expected_delivered_date: 1,
            total_ecom_shipping_price: 1,
            galinukkad_shipping_price: 1,
            return_images: 1,
            create: 1,
            updated: 1,
            month: { $month: "$create" },
            year: { $year: "$create" }
        };


        let payment_status = reqBody.payment_status;

        let query = {};
        if(payment_status) {
            query.payment_status = parseInt(payment_status)
        }

        const orderDetail = await Order.aggregate([
            {$match: query },
            { $lookup: { from: 'products', localField: 'return_productIds.id', foreignField: '_id', as: 'return_products' } },
            { $lookup: { from: 'products', localField: 'refund_productIds', foreignField: '_id', as: 'refund_productIds' } },
            { $lookup: { from: 'userlogins', localField: 'loginid', foreignField: '_id', as: 'userInfo' } },
            { $unwind: { path: '$userInfo', preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'addresses', localField: 'userInfo._id', foreignField: 'loginid', as: 'userAddressInfo' } },
            // { $unwind: { path: '$userAddressInfo', preserveNullAndEmptyArrays: true } },
            { $project: PROJECT },
            { $match: jsonStr },
            { $sort: { updated: -1 } },
            { $skip: skipRecord },
            { $limit: Limit }
        ]);


        const orderCount = await Order.aggregate([
            { $project: PROJECT },
            { $match: jsonStr },
        ]);


        const productList = []

        for (let i = 0; i < orderDetail.length; i++) {

            const E = orderDetail[i];
            delete E.month;
            delete E.year;
            let productIds = E.product ? E.product : [];
            orderDetail[i]['products'] = [];
            for (let j = 0; j < productIds.length; j++) {
                const Pdt = await Product.findById(mongoose.Types.ObjectId(productIds[j].id))
                    // .select('_id title price discount discounted_price');
                    .lean().exec();

        // console.log("Pdt_______" ,Pdt.title)
        productList.push({ title: Pdt.title});


                if (Pdt) {

                    if (Pdt.images) {
                        const isArray = Array.isArray(Pdt.images);
                        const isObject = Pdt.images.file;

                        if (isArray) {
                            let arrayToObject = {};
                            Pdt.images.forEach(E2 => {
                                if (E2.file) {
                                    arrayToObject = { file: E2.file };
                                } else {
                                    arrayToObject = { file: E2 };
                                }
                            })
                            Pdt.images = arrayToObject;
                        }

                        if (isObject) {
                            Pdt.images.file = Pdt.images.file;
                        }

                        if (!isArray && !isObject) {
                            Pdt.images = { file: Pdt.images };
                        }

                        Pdt.thumbnailImage = (Pdt.images && Pdt.images.file) ? 'thumbnail/' + Pdt.images.file : '';

                    } else {
                        Pdt.images = {};
                    }

                    // for slider image
                    if (Pdt.gallary_images) {
                        Pdt.gallary_thumbnailImages = [];
                        Pdt.gallary_images.forEach(E2 => {
                            E2.file = E2.file;
                            Pdt.gallary_thumbnailImages.push('thumbnail/' + E2.file);
                        });
                    } else {
                        Pdt.gallary_images = [];
                    }

                    const proReviews = await Review.find({ product_id: Pdt._id })
                        .select('message rating loginid')
                        .lean().exec();

                    for (let m = 0; m < proReviews.length; m++) {
                        const userInfo = await UserLogins.findById(proReviews[m].loginid)
                            .select('email username')
                            .lean().exec();
                        proReviews[m].userInfo = userInfo;
                    }

                    Pdt.reviews = proReviews;
                    orderDetail[i]['products'].push({ product: Pdt, quantity: (productIds[j].quantity || 1), variants: productIds[j].variants, price: productIds[j].price, coupon_code: productIds[j].coupon_code  , });
                }
            }
            orderDetail[i].payment_status = orderDetail[i].payment_status ? 'Paid' : 'Unpaid';

            if (orderDetail[i].status == 0) {
                orderDetail[i].orderStatus = 'Placed';
            } else if (orderDetail[i].status == 1) {
                orderDetail[i].orderStatus = 'Delivered';
            } else if (orderDetail[i].status == 2) {
                orderDetail[i].orderStatus = 'Cancelled';
            } else if (orderDetail[i].status == 3) {
                orderDetail[i].orderStatus = 'Returned';
            } else if (orderDetail[i].status == 4) {
                orderDetail[i].orderStatus = 'Refund';
            }

            if (orderDetail[i].return_productIds && orderDetail[i].return_productIds.length) {
                for (let z = 0; z < orderDetail[i].return_productIds.length; z++) {
                    if (orderDetail[i].return_productIds[z].price) {
                        orderDetail[i].return_products[z].price = orderDetail[i].return_productIds[z].price;
                        orderDetail[i].return_products[z].description = orderDetail[i].return_productIds[z].description;
                    }
                }
            }

            delete orderDetail[i].product;
        }

        return res.send({ status: true, data: orderDetail, count: orderCount.length, message: "Orders List get successfully" });

    } catch (e) {
    
        return res.send({ status: false, message: e.message });
    }
}


exports.getAdminOrder1 = async (req, res, next) => {
    try {
        const reqBody = req.body;

        // Pagination
        const currentPage = reqBody.page ? Number(reqBody.page) : 0;
        const Limit = reqBody.limit ? Number(reqBody.limit) : 10;
        const skipRecord = currentPage * Limit;
        const seller_id = reqBody.seller_id;

        const dateFilter = reqBody.dateFilter ? reqBody.dateFilter : {};
        const monthWise = reqBody.monthWise ? reqBody.monthWise : {};

        const jsonStr = {};

        if (dateFilter.from_date && dateFilter.to_date) {
            jsonStr.create = { $gte: new Date(dateFilter.from_date), $lt: new Date(dateFilter.to_date) };
        }

        if (monthWise.month && monthWise.year) {
            jsonStr.month = monthWise.month;
            jsonStr.year = monthWise.year;
        }

        if (!isNaN(reqBody.status) && reqBody.status !== "") {
            jsonStr.status = Number(reqBody.status);
        }

        const PROJECT = {
            product: 1,
            number: 1,
            payment_method: 1,
            payment_status: 1, // 0 for not paid 1 for paid
            amount: 1,
            return_productIds: 1,
            return_products: 1,
            // 'return_products._id': 1,
            // 'return_products.title': 1,
            refund_productIds: 1,
            // 'refund_productIds._id': 1,
            // 'refund_productIds.title': 1,
            // 'refund_productIds.price': 1,
            // 'refund_productIds.discount': 1,
            // 'refund_productIds.discounted_price': 1,
            userInfo: 1,
            userAddressInfo: 1,
            description: 1,
            status: 1,
            track_status: {
                $ifNull: ['$track_status', 'Pending']
            },
            delivered_date: 1,
            expected_delivered_date: 1,
            create: 1,
            updated: 1,
            month: { $month: "$create" },
            year: { $year: "$create" }
        };

    

        const orderDetail = await Order.aggregate([
            { $lookup: { from: 'products', localField: 'return_productIds.id', foreignField: '_id', as: 'return_products' } },
            { $lookup: { from: 'products', localField: 'refund_productIds', foreignField: '_id', as: 'refund_productIds' } },
            { $lookup: { from: 'userlogins', localField: 'loginid', foreignField: '_id', as: 'userInfo' } },
            { $unwind: { path: '$userInfo', preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'addresses', localField: 'userInfo._id', foreignField: 'loginid', as: 'userAddressInfo' } },
            // { $unwind: { path: '$userAddressInfo', preserveNullAndEmptyArrays: true } },
            { $project: PROJECT },
            { $match: jsonStr },
            { $sort: { updated: -1 } },
            { $skip: skipRecord },
            { $limit: Limit }
        ]);


        const orderCount = await Order.aggregate([
            { $project: PROJECT },
            { $match: jsonStr },
        ]);


        for (let i = 0; i < orderDetail.length; i++) {

            const E = orderDetail[i];
            delete E.month;
            delete E.year;
            let productIds = E.product ? E.product : [];
            orderDetail[i]['products'] = [];
            for (let j = 0; j < productIds.length; j++) {
                const Pdt = await Product.find({$and: [{_id: mongoose.Types.ObjectId(productIds[j].id)}, {loginid: mongoose.Types.ObjectId(seller_id)}]})
                    // .select('_id title price discount discounted_price');
                    .lean().exec();
                if (Pdt) {

                    if (Pdt.images) {
                        const isArray = Array.isArray(Pdt.images);
                        const isObject = Pdt.images.file;

                        if (isArray) {
                            let arrayToObject = {};
                            Pdt.images.forEach(E2 => {
                                if (E2.file) {
                                    arrayToObject = { file: E2.file };
                                } else {
                                    arrayToObject = { file: E2 };
                                }
                            })
                            Pdt.images = arrayToObject;
                        }

                        if (isObject) {
                            Pdt.images.file = Pdt.images.file;
                        }

                        if (!isArray && !isObject) {
                            Pdt.images = { file: Pdt.images };
                        }

                        Pdt.thumbnailImage = (Pdt.images && Pdt.images.file) ? 'thumbnail/' + Pdt.images.file : '';

                    } else {
                        Pdt.images = {};
                    }

                    // for slider image
                    if (Pdt.gallary_images) {
                        Pdt.gallary_thumbnailImages = [];
                        Pdt.gallary_images.forEach(E2 => {
                            E2.file = E2.file;
                            Pdt.gallary_thumbnailImages.push('thumbnail/' + E2.file);
                        });
                    } else {
                        Pdt.gallary_images = [];
                    }

                    const proReviews = await Review.find({ product_id: Pdt._id })
                        .select('message rating loginid')
                        .lean().exec();

                    for (let m = 0; m < proReviews.length; m++) {
                        const userInfo = await UserLogins.findById(proReviews[m].loginid)
                            .select('email username')
                            .lean().exec();
                        proReviews[m].userInfo = userInfo;
                    }

                    Pdt.reviews = proReviews;
                    orderDetail[i]['products'].push({ product: Pdt, quantity: (productIds[j].quantity || 1), variants: productIds[j].variants, price: productIds[j].price, coupon_code: productIds[j].coupon_code });
                }
            }
            orderDetail[i].payment_status = orderDetail[i].payment_status ? 'Paid' : 'Unpaid';

            if (orderDetail[i].status == 0) {
                orderDetail[i].orderStatus = 'Placed';
            } else if (orderDetail[i].status == 1) {
                orderDetail[i].orderStatus = 'Delivered';
            } else if (orderDetail[i].status == 2) {
                orderDetail[i].orderStatus = 'Cancelled';
            } else if (orderDetail[i].status == 3) {
                orderDetail[i].orderStatus = 'Returned';
            } else if (orderDetail[i].status == 4) {
                orderDetail[i].orderStatus = 'Refund';
            }

            if (orderDetail[i].return_productIds && orderDetail[i].return_productIds.length) {
                for (let z = 0; z < orderDetail[i].return_productIds.length; z++) {
                    if (orderDetail[i].return_productIds[z].price) {
                        orderDetail[i].return_products[z].price = orderDetail[i].return_productIds[z].price;
                        orderDetail[i].return_products[z].description = orderDetail[i].return_productIds[z].description;
                    }
                }
            }

            delete orderDetail[i].product;
        }

        return res.send({ status: true, data: orderDetail, count: orderCount.length, message: "Orders List get successfully" });

    } catch (e) {
    
        return res.send({ status: false, message: e.message });
    }
}

exports.getOrderDetail = async (req, res, next) => {
    try {
        const { order_id , userId  , role , product_id} = req.body;


        if (!order_id) {
            res.send({ status: false, message: "Please enter order id" });
            return
        }
        let productInfo = await Product.findOne({_id : product_id})
        let orderInfo = await Order.findOne({_id : order_id, })
            .select('_id amount product address_id refund_productIds return_productIds status track_status create updated number payment_method payment_status loginid delivered_date expected_delivered_date cancel_id cancel_desc total_ecom_shipping_price galinukkad_shipping_price')
            .lean().exec();
            let cancel_user = await UserLogins.findById(orderInfo.cancel_id )


        


            
if(product_id !== undefined){
    orderInfo.imageName = productInfo.images.file;
}

        if (!orderInfo) {
            return res.send({ status: false, message: `Order not found for id ${order_id}` });
        }

        const productArray = orderInfo.product ? orderInfo.product : [];
      
        const products = [];
        const refundedArray = [];
        const returnedArray = [];
        let totalAmounts = orderInfo.amount;
        let totalAmount = 0;

        let totalDiscountedAmount = 0;

        for (let j = 0; j < productArray.length; j++) {
            const jsonOne = { _id: mongoose.Types.ObjectId(productArray[j].id) };

            if (role === ROLES[1]) { jsonOne.loginid = userId; }
            const Quantity = (productArray[j].quantity || 1);

            const Pdt = await Product.findOne(jsonOne)
                // .select('_id title price discount discounted_price');
                .lean().exec();

            if (Pdt) {

                if (Pdt.images) {
                    const isArray = Array.isArray(Pdt.images);
                    const isObject = Pdt.images.file;

                    if (isArray) {
                        let arrayToObject = {};
                        Pdt.images.forEach(E2 => {
                            if (E2.file) {
                                arrayToObject = { file: E2.file };
                            } else {
                                arrayToObject = { file: E2 };
                            }
                        })
                        Pdt.images = arrayToObject;
                    }

                    if (isObject) {
                        Pdt.images.file = Pdt.images.file;
                    }

                    if (!isArray && !isObject) {
                        Pdt.images = { file: Pdt.images };
                    }

                    Pdt.thumbnailImage = (Pdt.images && Pdt.images.file) ? 'thumbnail/' + Pdt.images.file : '';
                } else {
                    Pdt.images = {};
                }

                // for slider image
                if (Pdt.gallary_images) {
                    Pdt.gallary_thumbnailImages = [];
                    Pdt.gallary_images.forEach(E2 => {
                        E2.file = E2.file;
                        Pdt.gallary_thumbnailImages.push('thumbnail/' + E2.file);
                    });
                } else {
                    Pdt.gallary_images = [];
                }

                const proReviews = await Review.find({ product_id: Pdt._id })
                    .select('message rating loginid')
                    .lean().exec();

                for (let m = 0; m < proReviews.length; m++) {
                    const userInfo = await UserLogins.findById(proReviews[m].loginid)
                        .select('email username')
                        .lean().exec();
                    proReviews[m].userInfo = userInfo;
                }

                Pdt.reviews = proReviews;

                products.push({ product: Pdt, quantity: Quantity, variants: productArray[j].variants, price: productArray[j].price, coupon_code: productArray[j].coupon_code });
                
            }

            if (Pdt && Pdt.price) {
                totalAmount = (totalAmount + Pdt.price) * Quantity;
            }

            if (Pdt && Pdt.discounted_price) {
                totalDiscountedAmount = (totalDiscountedAmount + Pdt.discounted_price) * Quantity;
            }
        }


        if (orderInfo.refund_productIds) {
            for (let j = 0; j < orderInfo.refund_productIds.length; j++) {
                const jsonOne = { _id: mongoose.Types.ObjectId(orderInfo.refund_productIds[j]) };
                if (role === ROLES[1]) { jsonOne.loginid = userId}

                const sellerProduct = await Product.findOne(jsonOne)
                    // .select('_id title price discounted_price');
                    .lean().exec();
                if (sellerProduct) {

                    if (sellerProduct.images) {
                        const isArray = Array.isArray(sellerProduct.images);
                        const isObject = sellerProduct.images.file;

                        if (isArray) {
                            let arrayToObject = {};
                            sellerProduct.images.forEach(E2 => {
                                if (E2.file) {
                                    arrayToObject = { file: E2.file };
                                } else {
                                    arrayToObject = { file: E2 };
                                }
                            })
                            sellerProduct.images = arrayToObject;
                        }

                        if (isObject) {
                            sellerProduct.images.file = sellerProduct.images.file;
                        }

                        if (!isArray && !isObject) {
                            sellerProduct.images = { file: sellerProduct.images };
                        }

                        sellerProduct.thumbnailImage = (sellerProduct.images && sellerProduct.images.file) ? 'thumbnail/' + sellerProduct.images.file : '';

                    } else {
                        sellerProduct.images = {};
                    }

                    // for slider image
                    if (sellerProduct.gallary_images) {
                        sellerProduct.gallary_thumbnailImages = [];
                        sellerProduct.gallary_images.forEach(E2 => {
                            E2.file = E2.file;
                            sellerProduct.gallary_thumbnailImages.push('thumbnail/' + E2.file);
                        });
                    } else {
                        sellerProduct.gallary_images = [];
                    }


                    refundedArray.push(sellerProduct);
                }
            }
        }




        if (orderInfo.return_productIds) {
            for (let j = 0; j < orderInfo.return_productIds.length; j++) {

                if (orderInfo.return_productIds[j].id) {
                    const jsonOne = { _id: mongoose.Types.ObjectId(orderInfo.return_productIds[j].id) };
                    if (role === ROLES[1]) { jsonOne.loginid = userId }

                    const sellerProduct = await Product.findOne(jsonOne)
                        // .select('_id title price discounted_price');
                        .lean().exec();
                    if (sellerProduct) {


                        if (sellerProduct.images) {
                            const isArray = Array.isArray(sellerProduct.images);
                            const isObject = sellerProduct.images.file;

                            if (isArray) {
                                let arrayToObject = {};
                                sellerProduct.images.forEach(E2 => {
                                    if (E2.file) {
                                        arrayToObject = { file: E2.file };
                                    } else {
                                        arrayToObject = { file: E2 };
                                    }
                                })
                                sellerProduct.images = arrayToObject;
                            }

                            if (isObject) {
                                sellerProduct.images.file = sellerProduct.images.file;
                            }

                            if (!isArray && !isObject) {
                                sellerProduct.images = { file: sellerProduct.images };
                            }

                            sellerProduct.thumbnailImage = (sellerProduct.images && sellerProduct.images.file) ? 'thumbnail/' + sellerProduct.images.file : '';

                        } else {
                            sellerProduct.images = {};
                        }

                        // for slider image
                        if (sellerProduct.gallary_images) {
                            sellerProduct.gallary_thumbnailImages = [];
                            sellerProduct.gallary_images.forEach(E2 => {
                                E2.file = E2.file;
                                sellerProduct.gallary_thumbnailImages.push('thumbnail/' + E2.file);
                            });
                        } else {
                            sellerProduct.gallary_images = [];
                        }


                        returnedArray.push(sellerProduct);
                    }
                }
            }
        }

                // let orderInfoSeller = await Product.findOne({loginid : userId})
                // let aa = products.filter((val , i) => {
            
            
                //     return val.product.loginid == userId
                // })


        // SUNIL MALAKAR 
        // let orderDetail = await OrderDetails.findOne({ product_id: product_id, order_number: order_id });

        let orderDetails;

        let userDetail = await UserLogins.findById(userId);

        console.log('userDetail is data');
        console.log(userDetail);

        console.log(userId);

        // FOR ADMIN ALL PRODUCT ORDER ITEM LIST SHOWS            
        if(userDetail != null && userDetail.roles === "ADMIN") {

            if(order_id != undefined && product_id != undefined) {
                orderDetails = await OrderDetails.findOne({ order_number: order_id , product_id: product_id } ).populate('product_id', 'title price sale_price images').populate('seller_id').exec();
            }else {
                orderDetails = await OrderDetails.find({ order_number: order_id} ).populate('product_id', 'title price sale_price images').populate('seller_id', 'username email mobile_number').exec();
            }


        }else {


            if(userId != undefined && userId != null && userId != "") {

                
                if(order_id != undefined && product_id != undefined) {
                    orderDetails = await OrderDetails.findOne({ order_number: order_id , product_id: product_id, seller_id: userId } ).populate('product_id', 'title price sale_price images').exec();
                }else {
                    orderDetails = await OrderDetails.find({ order_number: order_id,  seller_id: userId} ).populate('product_id', 'title price sale_price images').exec();
                }
                
            }else {


                if(order_id != undefined && product_id != undefined) {
                    orderDetails = await OrderDetails.findOne({ order_number: order_id , product_id: product_id} ).populate('product_id', 'title price sale_price images').exec();
                }else {
                    orderDetails = await OrderDetails.find({ order_number: order_id} ).populate('product_id', 'title price sale_price images').exec();
                }


            }

        }


        orderInfo.orderDetail = orderDetails; 

        orderInfo.product = products;       
        orderInfo.refund_productIds = refundedArray;
        orderInfo.return_productIds = returnedArray;
        // orderInfo.totalAmount = totalAmounts;
        orderInfo.totalAmount = totalAmounts;

        orderInfo.totalDiscountedAmount = totalDiscountedAmount;

        orderInfo.payment_status = orderInfo.payment_status ? 'Paid' : 'Unpaid';
        orderInfo.track_status = orderInfo.track_status ? orderInfo.track_status : 'Pending';

        if (orderInfo.status == 0) {
            orderInfo.orderStatus = 'Placed';
        } else if (orderInfo.status == 1) {
            orderInfo.orderStatus = 'Delivered';
        } else if (orderInfo.status == 2) {
            orderInfo.orderStatus = 'Cancelled';
        } else if (orderInfo.status == 3) {
            orderInfo.orderStatus = 'Returned';
        } else if (orderInfo.status == 4) {
            orderInfo.orderStatus = 'Refund';
        }

        const userInfo = await UserLogins.findOne({ _id: orderInfo.loginid })
            .select('email username user_status')
            .lean().exec();

        if (!userInfo) {
            return res.send({ status: false, message: 'User not found' });
        }

        const profileInfo = await Profile.findOne({ loginid: orderInfo.loginid }).lean().exec();
        const userAddress = await Address.findOne({ loginid: orderInfo.loginid  , _id : orderInfo.address_id})
            .select('add1 add2 state country postal fname lname')
            .lean().exec();

        // let adid = orderInfo.address_id
        // const userAddress1 = await Address.findOne({ })
        
    



        userInfo.name = profileInfo ? profileInfo.name : '';
        userInfo.gender = profileInfo ? profileInfo.gender : '';
        userInfo.photo = profileInfo ? profileInfo.photo : '';
        userInfo.dob = profileInfo ? profileInfo.dob : '';
        userInfo.phone = profileInfo ? profileInfo.phone : '';

        orderInfo.userInfo = userInfo;
        orderInfo.address = userAddress;
        orderInfo.cancelInfo = cancel_user;


        return res.send({ status: true, message: "Order Info get successfully", data: orderInfo });

        // let result = {};
        // let orderDetail = await Order.aggregate([
        //     { $match: { _id: mongoose.Types.ObjectId(req.body.order_id) } },
        //     { $lookup: { from: 'userlogins', localField: 'seller_id', foreignField: '_id', as: 'seller' } },
        //     { $lookup: { from: 'addresses', localField: 'address_id', foreignField: '_id', as: 'address' } },
        //     { $unwind: { path: '$address', preserveNullAndEmptyArrays: true } },
        // ]);

        // if (!orderDetail.length) {
        //     return res.send({ status: false, message: "Order not found" });
        // }

        // if (orderDetail[0].product && orderDetail[0].product.length > 0) {
        //     for (let i = 0; i < orderDetail[0].product.length; i++) {
        //         orderDetail[0].product[i].detail = await Product.findOne({ _id: orderDetail[0].product[i].id })
        //     }
        // } else {
        //     orderDetail[0].product = [];
        // }

        // result.order = orderDetail[0];

    } catch (e) {
        console.log(e)
        res.send({ status: false, message: e.message });
    }
}

exports.refundOrder = async (req, res, next) => {
    try {

        const reqBody = req.body;
        const Id = reqBody.id;
        const PaymentId = reqBody.payment_id;
        const productIds = reqBody.product_id;
        const Description = reqBody.description;
        const Amount = reqBody.amount;

        if (!reqBody.id) {
            return res.send({ status: false, message: "Id is required" });
        }

        if (!productIds || !productIds.length) {
            return res.send({ status: false, message: "Product Id is required" });
        }


        razorpay.payments.refund(PaymentId, {
            amount: Amount,
            notes: {
                note1: Description
            }
        }).then((data) => {
            console.error(data)
        }).catch((error) => {
            console.error(error)
        })
        Order.findOneAndUpdate({ _id: Id }, { $set: { status: 4, refund_productIds: productIds, refund_desc: Description, refund_date: new Date() } }).then(async user => {
        
            for (let data of productIds) {
                let prod = await Product.findOne({ _id: data }, { loginid: 1, title: 1 })

                if (prod) {
                    let data = {
                        loginid: prod.loginid,
                        notification_type: 'order_return',
                        message: `Request has been taken from user to refund your product named ${prod.title}`
                    }
                    await Notification.create(data);
                } else {
                    return res.send({ status: false, message: `product not found for id ${data}` });
                }
            }

            if (!user) {
                return res.send({ status: false, message: "Order not found" });
            } else {
                const userInfo = await UserLogins.findById(user.loginid).lean().exec();
                Helper.sendEmail(userInfo.email, 'Your Product refunded successfully', 'Your Product refunded successfully');
                return res.send({ status: true, message: "Request taken!", result: user });
            }

        }).catch(err => {
        
            res.send({ status: false, message: "Something went wrong!" });
        })
    } catch (e) {
        res.send({ status: false, message: "Something went wrong!" });
    }
}

exports.orderReturn = async (req, res, next) => {
    try {
        let v = new Validator(req.body, { //validator 
            userId: 'required',
            reason_of_return: 'required',
            reason_of_details: 'required',
            return_of_Action: 'required',
            product_id: 'required'
        })
        let check = await v.check();
        if (!check) {
            res.status(422).json({
                statusCode: 422,
                message: 'Please enter all required field',
            });
        } else {

            let data = {
                userId: req.body.userId,
                product_id: req.body.product_id,
                seller_id: req.body.seller_id,
                order_id: req.body.order_id,
                reason_of_return: req.body.reason_of_return,
                reason_of_details: req.body.reason_of_details,
                comments: req.body.comments,
                pickup_address: req.body.pickup_address,
                return_of_Action: req.body.return_of_Action,
                return_approved: req.body.return_approved,
            }
            Order_Return.create(data).then(user => {
                res.send({ status: true, message: "Request taken!", result: user });
            }).catch(err => {
            
                res.send({ status: false, message: "Something went wrong!" });
            })
        }
    } catch (e) {
    
        res.send({ status: false, message: "Something went wrong!" });
    }
}
exports.getReturnOrderList = async (req, res, next) => {
    // { email: req.body.email }
    try {
        Order_Return.find().sort({ _id: -1 }).then(user => {

            res.send({ status: true, message: "Record fetched", result: user });
        }).catch(err => {
        
            res.send({ status: false, message: "Something went wrong!" });
        })
    } catch (e) {
        res.send({ status: false, message: "Something went wrong!" });
    }
}

exports.getReturnOrderByOrderId = async (req, res, next) => {
    try {
        const returnOrderDetails = await Order_Return.aggregate([
            { $match: { order_id: mongoose.Types.ObjectId(req.body.order_id) } },
            {
                $lookup: { from: "orders", localField: "order_id", foreignField: "_id", as: "orderdetails" }
            },
            {
                $lookup: { from: "profiles", localField: "userId", foreignField: "_id", as: "userdetails" }
            },
        ]);

        if (returnOrderDetails.length > 0) {
            res.send({ status: true, message: "Record fetched", result: returnOrderDetails })
        } else {
            res.send({ status: false, message: 'Record not found' })
        }

    } catch (err) {
        res.send({ status: false, message: (err.message || "Something went wrong") });
    }
}


exports.placeOrderNew = async (req, res, next) => {
    try {


       
        const reqBody = req.body;
   
        const reqProductArray = reqBody.product;

        let PaymentMethod = reqBody.payment_method;
        const AddressId = reqBody.address_id;
        let AddressIdNew = reqBody.address_id;

        const Amount = reqBody.amount;
        let productId;
        let loginid = req.body.loginid;
                
        // const orderNumber = Math.floor(100000 + Math.random() * 900000);
        const orderNumber = Date.now();

        if (!reqProductArray || !reqProductArray.length) { return res.send({ status: false, message: 'product is required' }); }

        for (let i = 0; i < reqProductArray.length; i++) {
            if (!reqProductArray[i].id || !reqProductArray[i].quantity) {
                return res.send({ status: false, message: "required parameter missing" });
            }
        }
        // currecy

        if (!PaymentMethod) { return res.send({ status: false, message: 'Payment Method is required' }); }
        if (!AddressId) {
        const { email, phone, fname ,  lname,  add1,is_default, add2, state,city, postal  } = req.body;

        let ad = { email  ,  phone, fname, lname, country : 'India', add1, add2, is_default,state, postal, loginid, city , loginid : req.user._id}
        const addressModel = await Address(ad).save();
        AddressIdNew = addressModel._id

         }
        if (!Amount) { return res.send({ status: false, message: 'Amount is required' }); }

        PaymentMethod = PaymentMethod.toUpperCase();    

        const productIds = reqProductArray.map(obj => obj['id']);

        const products = await Product.find({ _id: { $in: productIds } });

        const userId = req.user._id;

        for (const data of reqProductArray) { 
            const isProduct = await Product.findById(data.id).lean().exec();

            if (isProduct) {

                const isQnt = isProduct.inventory - data.quantity;
console.log('isProduct.inventory' , isProduct.inventory);
console.log('isQnt' , isQnt);
console.log(Math.sign(isQnt) < 0);



// if (Math.sign(isQnt) !== 0) {
//     await Product.findByIdAndUpdate(isProduct._id, { stock_status: "Out of stock" });
//     return res.send({ status: false, message: `${isProduct.title} Out of stock` });
// }

                if (Math.sign(isQnt) < 0) {
                    await Product.findByIdAndUpdate(isProduct._id, { stock_status: "Out of stock" });
                    return res.send({ status: false, message: `${isProduct.title} Out of stock` });
                }

            } else {
                return res.send({ status: false, message: "Product Not Found" });
            }
        }

        // return res.send({reqm: reqProductArray});

        const user = await UserLogins.findById(userId).lean().exec();

        if (!user) {
            return res.send({ status: false, message: "User Not Found" });
        }

        const addr = await Address.findOne({ loginid: userId }).lean().exec();
        if (!addr) {
            return res.send({ status: false, message: "Address Not Found" });
        }

        // const isShipping = await Shipping_Rates.findOne({ pincode: addr.postal }).lean().exec();

        // if (!isShipping || !isShipping.delivery_days) {
        //     return res.send({ status: false, message: "Shipping not available" });
        // }
    
        var totalEcomShippingPrice = reqBody.shipping_price.reduce((value,item) => value + item.total_quantity_ecom_price, 0)
        var totalGalinukkadShippingPrice = reqBody.shipping_price.reduce((value,item) => value + item.total_quantity_galinukkad_price, 0)

    
        let orderJson = {
            email: req.body.email, // not use
            phone: req.body.phone, // not use
            fname: req.body.fname, // not use
            lname: req.body.lname, // not use
            companyname: req.body.companyname, // not use
            country: req.body.country, // not use
            add1: req.body.add1, // not use
            add2: req.body.add2, // not use
            state: req.body.state, // not use
            quantity: req.body.quantity, // not use
            postal: req.body.postal, // not use
            number: orderNumber,
            seller_id: products.map(obj => obj['loginid']),
            product: reqProductArray,
            address_id: AddressIdNew,
            loginid: userId,
            payment_method: PaymentMethod,
            amount: Amount,
            shipping: reqBody.shipping,
            total_ecom_shipping_price: totalEcomShippingPrice,
            galinukkad_shipping_price: totalGalinukkadShippingPrice,
            // delivered_date: moment(new Date()).add(8, 'days'),
            // expected_delivered_date: moment(new Date()).add(7, 'days')
        };
        console.log("prod" , reqProductArray)

        for (const data of reqProductArray) {

            const prod = await Product.findOne({ _id: data.id }, { inventory: 1, loginid: 1, title: 1, category: 1 , top_sale: 1 })

            
            let top_sale = (Number(prod.top_sale) || 0) + parseInt(data.quantity);
        
            const upPro =  await Product.updateOne({ _id: data.id }, { $set: {  top_sale: top_sale } })
        }

        // THIS IS FOR COD  
        if (PaymentMethod === "COD") {
            orderJson.payment_status = 0;
            const createdOrder = await (new Order(orderJson)).save();
          
            for (const data of reqProductArray) {

                const prod = await Product.findOne({ _id: data.id }, { inventory: 1, loginid: 1, title: 1, category: 1 })

                let orderDetailJson = {
                    order_number: createdOrder._id,
                    product_id:data.id,
                    category_id: prod.category,
                    amount:data.price,
                    quantity:data.quantity,
                    shippingCharges: data.shipping_rates,
                    seller_id: prod.loginid            
                };
                const createdOrderDetails = await (new OrderDetails(orderDetailJson)).save();

                if (prod) {
                     // if product available

                    const updatedInvetory = prod.inventory - parseInt(data.quantity);

                    let top_sale = (Number(prod.top_sale) || 0) + parseInt(data.quantity);
console.log("upPro")
                 const upPro =  await Product.updateOne({ _id: data.id }, { $set: { inventory: updatedInvetory, top_sale: top_sale } })
console.log(upPro)

                    if (updatedInvetory <= 5) { // creating notification for seller if inventory is less than 5
                        const notify1 = {
                            loginid: prod.loginid,
                            message: `Your product name ${prod.title} is low in an inventory.Please update inventory`,
                            notification_type: 'product_low_inventory'
                        }

                        await Notification.create(notify1);
                    }
                }
            }
            // Cart.findOne({ userId: userId }).then((data) => {
            //     if (data && data._id) {
            //         Cart.update({ userId: userId },
            //             { $pull: { productIds: { _id: _id } } }
            //         ).then((data) => {
            //             res.send({ status: true, data })
            //             return;
            //         }).catch((err) => {
            //             res.send({ status: false, message: err.message })
            //             return;
            //         });
            //     } else {
            //         return res.send({ status: false, message: "Cart info not found" });
            //     }
            // });
            console.log("createdOrder")
            // return false
                    
            Helper.sendEmail(user.email, 'Your order placed successfully', 'Your order placed successfully');
            return res.send({ status: true, message: "Order Placed successfully", data: createdOrder._id });
        }




        const ordersRozarpayData = {
            amount: (Number(req.body.amount) * 100),
            currency: (reqBody.currecy || "INR"),
            receipt: orderNumber,
            payment_capture: 1,
            notes: { 'order_id': orderNumber }
        };




        

        
        
        let product_ecom_merge = reqProductArray.map((item, i) => Object.assign({}, item, reqBody.shipping_price[i]));


        //razorpay.orders.create
        razorpay.orders.create(ordersRozarpayData).then(async (result) => {
        
            orderJson.payment_status = 0;

            const createdOrder = await (new Order(orderJson)).save(); // order details save()
            const orderId = createdOrder._id;
            

            // for (const data of reqProductArray) {
            for (const data of product_ecom_merge) {


                

                const prod = await Product.findOne({ _id: data.id }, { inventory: 1, loginid: 1, title: 1, category: 1 })
                productId = data.id

                if (prod) { // if product available
                    console.log(prod)



                function randomNumberGenerate(n) {
                    var add = 1, max = 12 - add;   // 12 is the min safe number Math.random() can generate without it starting to pad the end with zeros.   
                    if ( n > max ) {
                            return randomNumberGenerate(max) + randomNumberGenerate(n - max);
                    }
                    max        = Math.pow(10, n+add);
                    var min    = max/10; // Math.pow(10, n) basically
                    var number = Math.floor( Math.random() * (max - min + 1) ) + min;
            
                    return ("" + number).substring(add); 
                }




                let ecom_rates = {
                    zone: data.zone, 
                    friegth_rates_for: data.friegth_rates_for, 
                    ecom_express_price: data.ecom_express_price, 
                    total_quantity_shipping_price: data.total_quantity_ecom_price
                }

                let galinukkad_rates = {
                    product_weight: data.product_weight,
                    galinukkad_shipping_price: data.galinukkad_shipping_price, 
                    total_quantity_galinukkad_price: data.total_quantity_galinukkad_price
                };




                let item_tracking_number = randomNumberGenerate(16);
                    let orderDetailJson = {
                        order_number: createdOrder._id,
                        product_id:data.id,
                        category_id: prod.category,
                        amount:data.price,
                        quantity:data.quantity,
                        shippingCharges: data.shipping_rates,
                        seller_id: prod.loginid,       
                        seller_pincode: data.seller_pincode,    
                        delivered_date : moment(new Date()).add(8, 'days'),
                        expected_delivered_date : moment(new Date()).add(7, 'days'),
                        item_status : 0, // 0 Means Placed
                        item_tracking_id: item_tracking_number, 
                        product_weight: data.product_weight,
                        ecom_shipping_price: ecom_rates,
                        galinukkad_shipping_price: galinukkad_rates
                    };
                    

                    const createdOrderDetails = await (new OrderDetails(orderDetailJson)).save();

                    // ***************************************************         NOTE       *********************************************** //
                    // THIS IS COMMENT BECAUSE WHEN ORDER PAYMENT IS SUCCESS THAN WE WELL LESS PRODUCT QUANTITY [INVENTORY]  IF PRODUCT IS FAILED THAN WE DONT LESS QUANTITY 

                    // const updatedInvetory = prod.inventory - parseInt(data.quantity);
                    // let top_sale = (Number(prod.top_sale) || 0) + parseInt(data.quantity);
                    // await Product.updateOne({ _id: data.id }, { $set: { inventory: updatedInvetory, top_sale: top_sale } });
                    // if (updatedInvetory <= 5) { // creating notification for seller if inventory is less than 5
                    //     const notify1 = {
                    //         loginid: prod.loginid,
                    //         message: `Your product name ${prod.title} is low in an inventory.Please update inventory`,
                    //         notification_type: 'product_low_inventory'
                    //     }

                    //     await Notification.create(notify1);
                    // }
                    // **************************************************          NOTE        ********************************************************* //

                }
            }


            // return res.send({ status: true, message: "Order Placed successfully", data: orderId,razorpay_Order_Id:result.id,razorPay_Key_id:razorPay_Key_id });
            result.merchant_key_id = razorPay_Key_id;
            result.merchant_key_secrete = razorPay_Key_Secret;
            
            Cart.findOne({ userId: userId }).then((data) => {
                if (data && data._id) {
                    Cart.update({ userId: userId },
                        { $pull: { productIds: { product_id: productId } } }
                    ).then((data) => {
                        console.log("Cart updated")
                    }).catch((err) => {
                        console.log("Cart Error")

                    });
                } else {
                    console.log("Cart info not found")

                }
            });

        // return false
            return res.send({ status: true, message: "Order Placed successfully", data: orderId, razorpayData: result });
        }).catch(e => {
        
            return res.send({ status: false, message: e });
        })


        // }).catch(e => {
            console.log('dddddd')
        //     return res.send({ status: false, message: e });
        // })
        // stripe.customers.create({
        //     name: user.username,
        //     email: user.email,
        //     address: {
        //         line1: addr.add1 + ' ' + addr.add2,
        //         country: addr.country,
        //     },
        //     source: StripeToken,
        // }).then(customer =>
        //     stripe.charges.create({
        //         amount: Amount,
        //         currency: 'inr',
        //         customer: customer.id,
        //         description: Amount,
        //         metadata: { 'order_id': orderNumber }
        //     })).then(async (result) => {
        // orderJson.payment_status = 1;
        // const createdOrder = await (new Order(orderJson)).save(); // order details save()
        // const orderId = createdOrder._id;

        // // result.order_id = orderId;
        // // await (new Payment_details(result)).save(); // payments details save()

        // updateInventory(reqProductArray); // update inventory or stock limit
        // return res.send({ status: true, message: "Order Placed successfully", data: orderId });
        // }).catch((err) => {
        //     return res.send({ status: false, message: err.message });
        // })

    } catch (e) {
        res.send({ status: false, message: e.message });
    }
}


// ******************************************    PLACE ORDER SUCCESS API DATA WHEN ORDER IS SUCCESS AND FAILLED  **********************************
exports.placeOrderSuccess = async (req, res, next) => { 

    console.log(req.body)
    
    let raz_payment_id = req.body.razorpayPaymentId;    
    let orderId = req.body.orderCreationId;
    let razorpayOrderId = req.body.razorpayOrderId;
    let razorpaySignature = req.body.razorpaySignature;

    razorpay.payments.fetch(raz_payment_id).then(async (paymentData) => {

        let order = await Order.findByIdAndUpdate(orderId, { payment_status : 1 });
        
        order.product.map(async (item) => {
            let product_id =  item.id;
            let quantity =  item.quantity;
            let productData =  await Product.findOneAndUpdate({_id : product_id}, {$inc : {'inventory' : -quantity }}).exec();
            let productInventory = productData.inventory - quantity;
        
            if (productInventory <= 5) {                 
                const notify1 = {
                    loginid: productData.loginid,
                    message: `Your product name ${productData.title} is low in an inventory.Please update inventory`,
                    notification_type: 'product_low_inventory'
                }
                await Notification.create(notify1);
            }

            // REMOVE PRODUCT FROM CART AFTER ORDER SUCCESS
            await Cart.deleteMany({userId : order.loginid });
            
            paymentData['order_id'] =  orderId;
            paymentData['razorpay_payment_id'] =  raz_payment_id;
            paymentData['razorpay_signature'] =  razorpaySignature;
            paymentData['razorpay_order_id'] =  razorpayOrderId;


console.log("razorpay_order_id" ,razorpay_order_id)

            await (new Payment_details(paymentData)).save();            



            // ORDER Confirmation Successfully

            let orderData = await Order.findById(orderId).populate('loginid');

            try {
                let user_detail = await UserLogins.findById(orderData.loginid);
                let msg_body = `Hi, ${user_detail.username} <br />`; 
                msg_body += `Your Payment of Rs.${orderData.amount} for Galinukkad order ${orderData._id} was successfully placed.`; 
                msg_body += '<br />Thanks,<br />Gali Nukkad Team'; 
                await Helper.sendEmail(user_detail.email, "Order Placed Successfully", msg_body); 
            }catch(e) {
                console.log(e);
            }


            // SEND NOTIFICATION TO USER WHEN ORDER PURCHASED 
            await SendNotification('seller', productData.loginid, "order", `Your product name ${productData.title} is placed successfully.`);
        })

       
        return res.send({ status: true, message: "Order Placed successfully"});
        
    })
}

exports.getRazorpayTransacrions = async (req, res, next) => { 
    try {
        let user_data = await UserLogins.find(req.body);

        let payment_details;
        if(user_data) {
            payment_details = await Payment_details.find({});
        }
        return res.send({ status: true, payment_details: payment_details });
    }catch(e) {
        res.send({ status: false, message: e.message });
    }
}

exports.getRazorpayTransactionsDetail = async (req, res, next) => { 
    try {
        let razorpay_id = req.body.razorpay_id;
        let payment_detail =  await Payment_details.findById(razorpay_id);
        return res.send({ status: true, payment_detail: payment_detail });
    }catch(e) {
        console.log(e);
        res.send({ status: false, message: e.message });
    }
}


// ******************************************    PLACE ORDER SUCCESS API DATA WHEN ORDER IS SUCCESS AND FAILLED END   **********************************


exports.updateTrackStatus = async (req, res, next) => {
    try {
        const orderIds = req.body.order_ids;
        const trackStatus = req.body.track_status;
        if (!orderIds || !orderIds.length) {
            return res.send({ status: false, message: 'Order Id is required' });
        }

        if (!Helper.ckeckTrackStatus(trackStatus)) {
            return res.send({ status: false, message: 'Track Status is Invalid' });
        }

        const updated = await Order.update(
            { _id: { $in: orderIds } },
            { $set: { track_status: trackStatus } },
            { multi: true }
        );

        if (updated.nModified) {
            return res.send({ status: true, message: 'Updated Successfully' });
        } else {
            return res.send({ status: false, message: 'Something went wrong' });
        }

    } catch (error) {
        return res.send({ status: false, message: error.message });
    }
}


exports.orderTrack = async (req, res, next) => {
 
    try {
        let {tracking_id, email} = req.body;
        
        let user = await UserLogins.findOne({ email: email });
        
        let filter = {};        
        // filter = { loginid: mongoose.Types.ObjectId(user._id) }
        filter = { item_tracking_id: tracking_id }
        let orderDetail =await OrderDetails.findOne(filter).populate('product_id', 'title price');
console.log(orderDetail)

        if(orderDetail){
            return res.send({ status: true, orderDetail: orderDetail });

        }else{
        return res.send({ status: false, orderDetail: orderDetail });

        }


        


    }catch(error) {
        console.log(error);
        return res.send({ status: false, message: error.message });
    }
}

exports.updateOrder = async (req, res, next) => {
    try {
        const reqBody = req.body;
        const orderId = reqBody._id;
        if (!orderId) {
            return res.send({ status: false, message: 'Order Id is required' });
        }

        const isOrder = await Order.findByIdAndUpdate(orderId, reqBody);

        if (!isOrder) {
            return res.send({ status: true, message: `Order not found` });
        }

        return res.send({ status: true, message: 'Updated Successfully' });

    } catch (error) {
        return res.send({ status: false, message: error.message });
    }
}

exports.updateOrderProductValue = async (req, res, next) => {
    try {
        const reqBody = req.body;
        const orderId = reqBody.order_id;
        const productId = reqBody.product_id;
        const value = reqBody.value ? reqBody.value : {}

        if (!orderId) {
            return res.send({ status: false, message: 'Order Id is required' });
        }

        const updatedValue = {};
        Object.keys(value).forEach(E => {
            updatedValue[`product.$.${E}`] = value[E];
        });

   

        const updated = await Order.update({ _id: orderId, 'product._id': productId }, { $set: updatedValue });
        res.send(updated)

    } catch (error) {
        res.send(error.message)
    }
}
// , { expiresIn: '365d' }

exports.particularProductReturn = async (req, res, next) => {
    try {
        const reqBody = req.body;
        const OrderId = reqBody.id;
        const productIds = reqBody.product_id;
        const Description = reqBody.description;

        if (!OrderId || !productIds.length) {
            return res.send({ status: false, message: "required parameter missing" })
        }

        Order.findOneAndUpdate({ _id: OrderId }, { $set: { status: 3, return_productIds: productIds, return_desc: Description, returned_date: new Date() } }).then(async user => {
            for (let data of productIds) {
                let prod = await Product.findOne({ _id: data }, { loginid: 1, title: 1 })
                if (prod) {
                    let data = {
                        loginid: prod.loginid,
                        notification_type: 'order_return',
                        message: `Request has been taken from user to return your product named ${prod.title}`
                    }
                    await Notification.create(data);
                }
            }
            res.send({ status: true, message: "Request taken!", result: user });
        }).catch(err => {
        
            res.send({ status: false, message: "Something went wrong!" });
        })
    } catch (e) {
        res.send({ status: false, message: "Something went wrong!" });
    }
}


exports.addReturnPolicyDays = async (req, res, next) => {
    try {
        const reqBody = req.body;

        const created = await (new return_policy_days(reqBody)).save();

        return res.send({ status: true, data: created._id, message: 'Created Successfully' });

    } catch (error) {
        return res.send({ status: false, message: error.message });
    }
}

exports.updateReturnPolicyDays = async (req, res, next) => {
    try {
        const reqBody = req.body;
        if (!reqBody.id) {
            return res.send({ status: false, message: 'Id is required' });
        }

        const updated = await return_policy_days.findByIdAndUpdate(reqBody.id, reqBody);
        if (!updated) {
            return res.send({ status: false, message: 'Record not found' });
        }

        return res.send({ status: true, message: 'Updated Successfully' });

    } catch (error) {
        return res.send({ status: false, message: error.message });
    }
}

exports.getOneReturnPolicyDays = async (req, res, next) => {
    try {
        const reqQuery = req.query;
        if (!reqQuery._id) {
            return res.send({ status: false, message: 'Id is required' });
        }
        

        const getOne = await return_policy_days.findById(reqQuery._id);
        if (!getOne) {
            return res.send({ status: false, message: 'Record not found' });
        }

        return res.send({ status: true, data: getOne, message: 'Get Successfully' });

    } catch (error) {
        return res.send({ status: false, message: error.message });
    }
}
exports.removeReturnPolicyDays = async (req, res, next) => {
    // try {
    //     const reqBody = req.body;

    //     const created = await (new return_policy_days(reqBody)).save();

    //     return res.send({ status: true, data: created._id, message: 'Created Successfully' });

    // } catch (error) {
    //     return res.send({ status: false, message: error.message });
    // }
    try {
        if (req.body.id) {
            return_policy_days.findByIdAndDelete({ _id: req.body.id }).then(user => {
                res.send({ status: true, message: "Return Policy deleted" });
            }).catch(e => {
                res.send({ status: false, message: e.message });
            })
        } else {
            res.send({ status: false, message: "Something went wrong" });
        }
    } catch (err) {
        res.send({ status: false, message: "Something went wrong" });
    
}
}


exports.getAllReturnPolicyDays = async (req, res, next) => {
    try {
        const getAll = await return_policy_days.find();


        return res.send({ status: true, data: getAll, message: 'List get Successfully' });

    } catch (error) {
        return res.send({ status: false, message: error.message  });
    }
}

exports.createReplaceOrderProduct = async (req, res, next) => {

    try {
        const reqBody = req.body;
        const orderId = reqBody.order_id;
        const productId = reqBody.product_id;
        const userId = req.user._id;

        const isOrder = await Order.findById(orderId).lean().exec();

        if (!isOrder) {
            return res.send({ status: false, message: 'Order not found for this id' });
        }

        const isExist = await replaceOrder.findOne({ order_id: orderId, product_id: productId });

        if (isExist) {
            return res.send({ status: false, message: 'Product already requested for replacing' });
        }

        const prod = await Product.findById(productId);

        if (!prod) {
            return res.send({ status: false, message: 'Product not exist' });
        }

        let notifyData = {
            loginid: prod.loginid,
            notification_type: 'order_replace',
            message: `Request has been taken from user to replace your product named ${prod.title}`
        };
        await Notification.create(notifyData);

        reqBody.loginid = userId;

        const reqProductArray = [{
            id: productId,
            quantity: 1
        }]


        let orderJson = {
            number: Date.now(),
            seller_id: prod.loginid,
            product: reqProductArray,
            address_id: isOrder.address_id,
            loginid: userId,
            payment_method: isOrder.payment_method,
            amount: prod.price,
            delivered_date: moment(new Date()).add(9, 'days'),
            expected_delivered_date: moment(new Date()).add(8 - 1, 'days')
        };

        await (new Order(orderJson)).save();


        const created = await (new replaceOrder(reqBody)).save();
        return res.send({ status: true, message: 'Request Taken' });

    } catch (error) {
        return res.send({ status: false, message: error.message });
    }
}

exports.getOnereplaceOrderProduct = async (req, res, next) => {
    try {
        const reqBody = req.body;
        const orderId = reqBody.order_id;
        const productId = reqBody.product_id;

        const order = await replaceOrder.aggregate([
            { $lookup: { from: 'orders', localField: 'order_id', foreignField: '_id', as: 'orders' } },
            { $lookup: { from: 'products', localField: 'product_id', foreignField: '_id', as: 'product' } },
            { $lookup: { from: 'userlogins', localField: 'loginid', foreignField: '_id', as: 'userInfo' } },
            { $lookup: { from: 'addresses', localField: 'userInfo._id', foreignField: 'loginid', as: 'addressInfo' } },
            { $unwind: { path: '$orders' } },
            { $unwind: { path: '$product' } },
            { $unwind: { path: '$userInfo' } },
            { $match: { order_id: mongoose.Types.ObjectId(orderId), product_id: mongoose.Types.ObjectId(productId) } },
            {
                $project: {
                    _id: 0,
                    'orders.track_status': 1,
                    'orders.create': 1,
                    'orders.updated': 1,
                    'orders.payment_method': 1,
                    'orders.number': 1,
                    'orders.loginid': 1,
                    'orders.delivered_date': 1,
                    'orders.expected_delivered_date': 1,
                    product: 1,
                    'userInfo.email': 1,
                    'userInfo.username': 1,
                    'userInfo.mobile_number': 1,
                    addressInfo: 1
                }
            }
        ]);

        if (order.length) {
            return res.send({ status: true, data: order[0] });
        } else {
            return res.send({ status: false, message: 'Order not found' });
        }


    } catch (error) {
        return res.send({ status: false, message: error.message });
    }
}

exports.getAllreplaceOrderProduct = async (req, res, next) => {
    try {
        const reqBody = req.body;
        const orderId = reqBody.order_id;

        const order = await replaceOrder.aggregate([
            { $lookup: { from: 'orders', localField: 'order_id', foreignField: '_id', as: 'orders' } },
            { $lookup: { from: 'products', localField: 'product_id', foreignField: '_id', as: 'product' } },
            { $lookup: { from: 'userlogins', localField: 'loginid', foreignField: '_id', as: 'userInfo' } },
            { $lookup: { from: 'addresses', localField: 'userInfo._id', foreignField: 'loginid', as: 'addressInfo' } },
            { $unwind: { path: '$orders' } },
            { $unwind: { path: '$userInfo' } },
            { $match: { order_id: mongoose.Types.ObjectId(orderId) } },
            {
                $project: {
                    _id: 0,
                    'orders.track_status': 1,
                    'orders.create': 1,
                    'orders.updated': 1,
                    'orders.payment_method': 1,
                    'orders.number': 1,
                    'orders.loginid': 1,
                    'orders.delivered_date': 1,
                    'orders.expected_delivered_date': 1,
                    product: 1,
                    'userInfo.email': 1,
                    'userInfo.username': 1,
                    'userInfo.mobile_number': 1,
                    addressInfo: 1
                }
            }
        ]);

        if (order.length) {
            return res.send({ status: true, data: order[0] });
        } else {
            return res.send({ status: false, message: 'Order not found' });
        }

    } catch (error) {
        return res.send({ status: false, message: error.message });
    }
}


exports.deleteReplaceOrderProduct = async (req, res, next) => {
    try {
        const reqBody = req.body;
        const orderId = reqBody.order_id;
        const productId = reqBody.product_id;

        const deleted = await replaceOrder.findOneAndDelete({ order_id: orderId, product_id: productId });

        if (!deleted) {
            return res.send({ status: false, data: 'Order not found' });
        }

        return res.send({ status: true, data: 'Deleted successfully' });

    } catch (error) {
        return res.send({ status: false, message: error.message });
    }
}

exports.adminCommissionByProductid = async (req, res, next) => {
    try {
        const reqBody = req.body;
        const productId = reqBody.product_id;
        const commitionPercentage = reqBody.commition_percentage;

        if (!productId) {
            return res.send({ status: false, data: 'Product Id is required' });
        }

        if (!commitionPercentage) {
            return res.send({ status: false, data: 'Commission Percentage is required' });
        }

        const product = await Product.findById(productId).lean().exec();

        if (!product) {
            return res.send({ status: false, data: 'Product not found' });
        }

        let commission = ((product.price * commitionPercentage) / 100);
        commission = product.price - commission;

        return res.send({ status: true, data: commission });

    } catch (error) {
        return res.send({ status: false, message: error.message });
    }
}

exports.accountHealthByUserId = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const sellerOrder = await getDynamicSellerOrder(userId, 0, 0, {}, {});
        const cancelOrder = await getDynamicSellerOrder(userId, 0, 0, { status: 2 }, {});
        const returnOrder = await getDynamicSellerOrder(userId, 0, 0, { status: 3 }, {});
        const refudOrder = await getDynamicSellerOrder(userId, 0, 0, { status: 4 }, {});

        const allOrder = await Order.find().lean().exec();

        const percentage = (((sellerOrder.length * 100) / allOrder.length)).toFixed(2);

        const result = {
            sellerAllOrder: sellerOrder.length,
            sellerCancelOrder: cancelOrder.length,
            sellerRefundOrder: refudOrder.length,
            sellerReturnOrder: returnOrder.length,
            sellerOrderPercentage: percentage + '%',
            allOrder: allOrder.length,
            orders: sellerOrder
        };

        return res.send({ status: true, data: result });

    } catch (error) {
        return res.send({ status: false, message: error.message });
    }
},

exports.banktransfer = async (req, res, next) => {
    try {
        const reqBody = req.body;
       
        const contact_data = await bank_contact(reqBody);
        const fundAccount_data = await fundAccount_bank(contact_data.id,reqBody);
        const PayOut_data = await PayOut_bank(fundAccount_data.id,reqBody); 
        let Json_data = {
            contact_id: contact_data.id,
            funt_account_id: fundAccount_data.id,
            payout_id: PayOut_data.id,
            admin_id:req.user._id,
            seller_id: reqBody.seller_id,
            order_id: reqBody.order_id,
            users_type:req.user.role,
            acco_hold_name: reqBody.name,
            acco_hold_email: reqBody.email,
            acco_hold_number: reqBody.contact,
            contact_type: reqBody.contact_type,
            account_type:reqBody.account_type,
            ifsc_number: reqBody.ifsc,
            account_number:reqBody.account_number,
            amount: reqBody.amount,
            currency:reqBody.currency, 
            purpose: reqBody.purpose,
            status:PayOut_data.status,
            transaction_type:reqBody.transaction_type,
            transaction_Status: reqBody.transaction_Status,
           
        };   
        bank_transaction.create(Json_data).then(user => {
            res.send({ status: true, message: "Successfully Money transaction", result: user });
        }).catch(err => {
        
            res.send({ status: false, message: "Something went wrong!" });
        })  
          
    } catch (e) {
        res.send({ status: false, message: e.message });
    }
}
exports.getbanktransfer = async (req, res, next) => {
    try {
        const reqBody = req.body;
        const { page, limit } = req.body;
        const Limit = limit ? parseInt(limit) : 10;
        const PageNo = page ? parseInt(page) : 0;
        let filter = new RegExp(reqBody.filter, 'i');

        const MATCH = {};
        MATCH.$and = [];
        MATCH.$or = [];
        
        if (req.user && req.user.role === ROLES[1]) {
            MATCH.$and.push({ users_id:mongoose.Types.ObjectId(req.user._id) });
        }
        if (req.user && req.user.role === ROLES[2]) {
            MATCH.$and.push({  });
        }
        // for all search keyup
        if (reqBody.users_type) {
            MATCH.$and.push({ users_type: reqBody.users_type });
           
        }
        MATCH.$or.push({ account_number: filter });
        MATCH.$or.push({ transaction_type: filter });
        MATCH.$or.push({ transaction_Status: filter });
        MATCH.$or.push({ acco_hold_name: filter });
        MATCH.$or.push({ acco_hold_number: filter });
        MATCH.$or.push({ acco_hold_email: filter });
        MATCH.$or.push({ purpose: filter });
      
        if (reqBody.seller_id) {
            MATCH.$and.push({seller_id:reqBody.seller_id  });
        }
        // for all search keyup
        if (reqBody.order_id) {
            MATCH.$and.push({ order_id: reqBody.order_id });
           
        }
        
        const dateFilter = reqBody.dateFilter ? reqBody.dateFilter : {};
        
        
        if (dateFilter.from_date && dateFilter.to_date) {
            MATCH.$and.push({ created_at: { $gte: new Date(dateFilter.from_date), $lt: new Date(dateFilter.to_date) } });
        }
        
        if (!MATCH.$and.length) delete MATCH.$and;
        if (!MATCH.$or.length) delete MATCH.$or;
        const count = await bank_transaction.count(MATCH);
       bank_transaction.find(MATCH).limit(Limit).skip(Limit * PageNo).then(data => {
        res.send({ status: true, message: "Record fetched", result: data, count: count });
    }).catch(err => {
   
        res.send({ status: false, message: err.message });
    })
    } catch (e) {
       
        res.send({ status: false, message: e.message });
    }
}

async function updateInventory(reqProductArray) {

    for (const data of reqProductArray) {

        const prod = await Product.findOne({ _id: data.id }, { inventory: 1, loginid: 1, title: 1 })

        if (prod) { // if product available
            console.log(prod)

            const updatedInvetory = prod.inventory - parseInt(data.quantity);

            await Product.updateOne({ _id: data.id }, { $set: { inventory: updatedInvetory } })
            if (updatedInvetory <= 5) { // creating notification for seller if inventory is less than 5
                const notify1 = {
                    loginid: prod.loginid,
                    message: `Your product name ${prod.title} is low in an inventory.Please update inventory`,
                    notification_type: 'product_low_inventory'
                }

                await Notification.create(notify1);
            }
        }
    }
}

function getDynamicSellerOrder(sellerId, limit, skipRecord, match, otherMatch) {
    try {

        const seller_id = sellerId;
        const Limit = limit;
        const SkipRecord = skipRecord;
        // product

    
        

        return new Promise(async (resolve, reject) => {
            try {
                let allOrders = await Order.find(match)
                    .select('_id product refund_productIds return_productIds status create updated number payment_method payment_status track_status delivered_date expected_delivered_date')
                    .lean().exec();

                for (let i = 0; i < allOrders.length; i++) {
                    const V1 = allOrders[i];
                    const productArray = [];
                    const refundedArray = [];
                    const returnedArray = [];
                    let totalAmount = 0;
                    let totalDiscountedAmount = 0;
                    if (V1.product) {


                        for (let j = 0; j < V1.product.length; j++) {

                            if (!(V1.product[j].quantity)) {
                                continue;
                            }

                            const sellerProduct = await Product.findOne({ _id: mongoose.Types.ObjectId(V1.product[j].id), loginid: seller_id })
                                // .select('_id title price discounted_price')
                                .lean().exec();
                            const Quantity = (V1.product[j].quantity || 1);

                            if (sellerProduct) {

                                if (sellerProduct.images) {
                                    const isArray = Array.isArray(sellerProduct.images);
                                    const isObject = sellerProduct.images.file;

                                    if (isArray) {
                                        let arrayToObject = {};
                                        sellerProduct.images.forEach(E2 => {
                                            if (E2.file) {
                                                arrayToObject = { file: E2.file };
                                            } else {
                                                arrayToObject = { file: E2 };
                                            }
                                        })
                                        sellerProduct.images = arrayToObject;
                                    }

                                    if (isObject) {
                                        sellerProduct.images.file = sellerProduct.images.file;
                                    }

                                    if (!isArray && !isObject) {
                                        sellerProduct.images = { file: sellerProduct.images };
                                    }

                                    sellerProduct.thumbnailImage = (sellerProduct.images && sellerProduct.images.file) ? 'thumbnail/' + sellerProduct.images.file : '';

                                } else {
                                    sellerProduct.images = {};
                                }

                                // for slider image
                                if (sellerProduct.gallary_images) {
                                    sellerProduct.gallary_thumbnailImages = [];
                                    sellerProduct.gallary_images.forEach(E2 => {
                                        E2.file = E2.file;
                                        sellerProduct.gallary_thumbnailImages.push('thumbnail/' + E2.file);
                                    });
                                } else {
                                    sellerProduct.gallary_images = [];
                                }

                                const proReviews = await Review.find({ product_id: sellerProduct._id })
                                    .select('message rating loginid')
                                    .lean().exec();

                                for (let m = 0; m < proReviews.length; m++) {
                                    const userInfo = await UserLogins.findById(proReviews[m].loginid)
                                        .select('email username')
                                        .lean().exec();
                                    proReviews[m].userInfo = userInfo;
                                }

                                sellerProduct.reviews = proReviews;

                                productArray.push({ product: sellerProduct, check : "check",  quantity: Quantity, variants: V1.product[j].variants, price: V1.product[j].price, coupon_code: V1.product[j].coupon_code });
                            }

                            if(productArray.length === 0){

                                if (sellerProduct && sellerProduct.price) {

                                    totalAmount =   Quantity * (totalAmount + sellerProduct.price) ;
                            
    
                                }
                            }else{
                                let sum = productArray.map(function ( current) {
                                    return current.product.price * current.quantity         
                                });
            
                                let productSum = sum.reduce((acc , val) => {
                                    return acc + val
                                })
    
                               
    
                                totalAmount = productSum;
            
                                
                            }

                       
                      


                            if (sellerProduct && sellerProduct.discounted_price) {
                                totalDiscountedAmount = (totalDiscountedAmount + sellerProduct.discounted_price) * Quantity;
                            }
                        }
                    }

                    if (V1.refund_productIds) {
                        for (let j = 0; j < V1.refund_productIds.length; j++) {

                            if (!(V1.refund_productIds[j])) {
                                continue;
                            }

                            const sellerProduct = await Product.findOne({ _id: mongoose.Types.ObjectId(V1.refund_productIds[j]), loginid: seller_id })
                                // .select('_id title price discounted_price');
                                .lean().exec();
                            if (sellerProduct) {

                                if (sellerProduct.images) {
                                    const isArray = Array.isArray(sellerProduct.images);
                                    const isObject = sellerProduct.images.file;

                                    if (isArray) {
                                        let arrayToObject = {};
                                        sellerProduct.images.forEach(E2 => {
                                            if (E2.file) {
                                                arrayToObject = { file: E2.file };
                                            } else {
                                                arrayToObject = { file: E2 };
                                            }
                                        })
                                        sellerProduct.images = arrayToObject;
                                    }

                                    if (isObject) {
                                        sellerProduct.images.file = sellerProduct.images.file;
                                    }

                                    if (!isArray && !isObject) {
                                        sellerProduct.images = { file: sellerProduct.images };
                                    }

                                    sellerProduct.thumbnailImage = (sellerProduct.images && sellerProduct.images.file) ? 'thumbnail/' + sellerProduct.images.file : '';

                                } else {
                                    sellerProduct.images = {};
                                }

                                // for slider image
                                if (sellerProduct.gallary_images) {
                                    sellerProduct.gallary_thumbnailImages = [];
                                    sellerProduct.gallary_images.forEach(E2 => {
                                        E2.file = E2.file;
                                        sellerProduct.gallary_thumbnailImages.push('thumbnail/' + E2.file);
                                    });
                                } else {
                                    sellerProduct.gallary_images = [];
                                }


                                refundedArray.push(sellerProduct);
                            }
                        }
                    }

                    if (V1.return_productIds) {
                        for (let j = 0; j < V1.return_productIds.length; j++) {
                            if (V1.return_productIds[j].id) {

                                if (!(V1.return_productIds[j].description)) {
                                    continue;
                                }

                                const sellerProduct = await Product.findOne({ _id: mongoose.Types.ObjectId(V1.return_productIds[j].id), loginid: seller_id })
                                    // .select('_id title')
                                    .lean().exec();
                                if (sellerProduct) {
                                    sellerProduct.price = V1.return_productIds[j].price;
                                    sellerProduct.description = V1.return_productIds[j].description;
                                    returnedArray.push(sellerProduct);
                                }
                            }
                        }
                    }


                   

                    // const arrays = productArray
 // 6



                    allOrders[i].product = productArray;
                    allOrders[i].products = productArray;

                    allOrders[i].refund_productIds = refundedArray;
                    allOrders[i].return_productIds = returnedArray;
                    allOrders[i].totalAmount = totalAmount;
                    allOrders[i].totalDiscountedAmount = totalDiscountedAmount;
                    allOrders[i].payment_status = allOrders[i].payment_status ? 'Paid' : 'Unpaid';
                    allOrders[i].track_status = allOrders[i].track_status ? allOrders[i].track_status : 'Pending';

                    if (allOrders[i].status == 0) {
                        allOrders[i].orderStatus = 'Placed';
                    } else if (allOrders[i].status == 1) {
                        allOrders[i].orderStatus = 'Delivered';
                    } else if (allOrders[i].status == 2) {
                        allOrders[i].orderStatus = 'Cancelled';
                    } else if (allOrders[i].status == 3) {
                        allOrders[i].orderStatus = 'Returned';
                    } else if (allOrders[i].status == 4) {
                        allOrders[i].orderStatus = 'Refund';
                    }
                }

                // month year wise filter
                if (otherMatch.month && otherMatch.year) {
                    allOrders = allOrders.filter(x =>
                        (new Date(x.create).getMonth() + 1) === otherMatch.month
                        &&
                        (new Date(x.create).getFullYear()) === otherMatch.year
                    )
                }

                allOrders = allOrders.filter(x => x.product.length);
                allOrders = allOrders.sort((a, b) => new Date(b.updated) - new Date(a.updated));

                if (Limit) {
                    allOrders = allOrders.slice(SkipRecord);
                    allOrders.length = Limit;
                }

                allOrders = allOrders.filter(x => x);
                return resolve(allOrders)

            } catch (err) {
                return resolve({ message: err.message });
            }
        });
    } catch (error) {
        return resolve({ message: err.message });
    }
}


function getDynamicCustomerOrder(sellerId, limit, skipRecord, match, otherMatch) {
    try {

        const seller_id = sellerId;
        const Limit = limit;
        const SkipRecord = skipRecord;

        return new Promise(async (resolve, reject) => {
            try {


                

                let allOrders = await Order.find(match)
                    .select('_id product refund_productIds return_productIds status create updated number payment_method payment_status track_status loginid delivered_date expected_delivered_date')                    
                    .lean().exec();
   

 


                for (let i = 0; i < allOrders.length; i++) {
                    const V1 = allOrders[i];
                    const productArray = [];
                    const refundedArray = [];
                    const returnedArray = [];
                    let totalAmount = 0;
                    let totalDiscountedAmount = 0;



                    // ***************  SUNIL MALAKAR SEND ORDER ITEM DATA  *********************
                    let orderDetail = await OrderDetails.find({ order_number: allOrders[i]._id }).populate('product_id', 'title price images variants ').exec();
                 
                    allOrders[i].orderItemsProduct = orderDetail;
                    // ***************  SUNIL MALAKAR SEND ORDER ITEM DATA  END *********************





                    if (V1.product) {
                        for (let j = 0; j < V1.product.length; j++) {

                            if (!(V1.product[j].quantity)) {
                                continue;
                            }

                            const customerProduct = await Product.findOne({ _id: mongoose.Types.ObjectId(V1.product[j].id) })
                                // .select('_id title price discounted_price')
                                .lean().exec();
                            const Quantity = (V1.product[j].quantity || 1);

                            if (customerProduct) {

                                if (customerProduct.images) {
                                    const isArray = Array.isArray(customerProduct.images);
                                    const isObject = customerProduct.images.file;

                                    if (isArray) {
                                        let arrayToObject = {};
                                        customerProduct.images.forEach(E2 => {
                                            if (E2.file) {
                                                arrayToObject = { file: E2.file };
                                            } else {
                                                arrayToObject = { file: E2 };
                                            }
                                        })
                                        customerProduct.images = arrayToObject;
                                    }

                                    if (isObject) {
                                        customerProduct.images.file = customerProduct.images.file;
                                    }

                                    if (!isArray && !isObject) {
                                        customerProduct.images = { file: customerProduct.images };
                                    }

                                    customerProduct.thumbnailImage = (customerProduct.images && customerProduct.images.file) ? 'thumbnail/' + customerProduct.images.file : '';

                                } else {
                                    customerProduct.images = {};
                                }

                                // for slider image
                                if (customerProduct.gallary_images) {
                                    customerProduct.gallary_thumbnailImages = [];
                                    customerProduct.gallary_images.forEach(E2 => {
                                        E2.file = E2.file;
                                        customerProduct.gallary_thumbnailImages.push('thumbnail/' + E2.file);
                                    });
                                } else {
                                    customerProduct.gallary_images = [];
                                }

                                const proReviews = await Review.find({ product_id: customerProduct._id })
                                    .select('message rating loginid')
                                    .lean().exec();

                                for (let m = 0; m < proReviews.length; m++) {
                                    const userInfo = await UserLogins.findById(proReviews[m].loginid)
                                        .select('email username')
                                        .lean().exec();
                                    proReviews[m].userInfo = userInfo;
                                }

                                customerProduct.reviews = proReviews;

                                productArray.push({ product: customerProduct, quantity: Quantity, variants: V1.product[j].variants, price: V1.product[j].price, coupon_code: V1.product[j].coupon_code });
                            }

                            if (customerProduct && customerProduct.price) {
                                totalAmount = (totalAmount + customerProduct.price) * Quantity;
                            }

                            if (customerProduct && customerProduct.discounted_price) {
                                totalDiscountedAmount = (totalDiscountedAmount + customerProduct.discounted_price) * Quantity;
                            }
                        }
                    }


                    if (V1.refund_productIds) {
                        for (let j = 0; j < V1.refund_productIds.length; j++) {

                            if (!(V1.refund_productIds[j])) {
                                continue;
                            }

                            const customerProduct = await Product.findOne({ _id: mongoose.Types.ObjectId(V1.refund_productIds[j]) })
                                // .select('_id title price discounted_price');
                                .lean().exec();
                            if (customerProduct) {

                                if (customerProduct.images) {
                                    const isArray = Array.isArray(customerProduct.images);
                                    const isObject = customerProduct.images.file;

                                    if (isArray) {
                                        let arrayToObject = {};
                                        customerProduct.images.forEach(E2 => {
                                            if (E2.file) {
                                                arrayToObject = { file: E2.file };
                                            } else {
                                                arrayToObject = { file: E2 };
                                            }
                                        })
                                        customerProduct.images = arrayToObject;
                                    }

                                    if (isObject) {
                                        customerProduct.images.file = customerProduct.images.file;
                                    }

                                    if (!isArray && !isObject) {
                                        customerProduct.images = { file: customerProduct.images };
                                    }

                                    customerProduct.thumbnailImage = (customerProduct.images && customerProduct.images.file) ? 'thumbnail/' + customerProduct.images.file : '';

                                } else {
                                    customerProduct.images = {};
                                }

                                // for slider image
                                if (customerProduct.gallary_images) {
                                    customerProduct.gallary_thumbnailImages = [];
                                    customerProduct.gallary_images.forEach(E2 => {
                                        E2.file = E2.file;
                                        customerProduct.gallary_thumbnailImages.push('thumbnail/' + E2.file);
                                    });
                                } else {
                                    customerProduct.gallary_images = [];
                                }


                                refundedArray.push(customerProduct);
                            }
                        }
                    }

                    if (V1.return_productIds) {
                        for (let j = 0; j < V1.return_productIds.length; j++) {
                            if (V1.return_productIds[j].id) {

                                if (!(V1.return_productIds[j].description)) {
                                    continue;
                                }

                                const customerProduct = await Product.findOne({ _id: mongoose.Types.ObjectId(V1.return_productIds[j].id) })
                                    // .select('_id title')
                                    .lean().exec();
                                if (customerProduct) {
                                    customerProduct.price = V1.return_productIds[j].price;
                                    customerProduct.description = V1.return_productIds[j].description;
                                    returnedArray.push(customerProduct);
                                }
                            }
                        }
                    }

                    allOrders[i].product = productArray;
                    allOrders[i].refund_productIds = refundedArray;
                    allOrders[i].return_productIds = returnedArray;
                    allOrders[i].totalAmount = totalAmount;
                    allOrders[i].totalDiscountedAmount = totalDiscountedAmount;
                    allOrders[i].payment_status = allOrders[i].payment_status ? 'Paid' : 'Unpaid';
                    allOrders[i].track_status = allOrders[i].track_status ? allOrders[i].track_status : 'Pending';
                   

                    if (allOrders[i].status == 0) {
                        allOrders[i].orderStatus = 'Placed';
                    } else if (allOrders[i].status == 1) {
                        allOrders[i].orderStatus = 'Delivered';
                    } else if (allOrders[i].status == 2) {
                        allOrders[i].orderStatus = 'Cancelled';
                    } else if (allOrders[i].status == 3) {
                        allOrders[i].orderStatus = 'Returned';
                    } else if (allOrders[i].status == 4) {
                        allOrders[i].orderStatus = 'Refund';
                    }

                    if (allOrders[i].delivered_date) {
                        allOrders[i].return_approved = 'Placed';
                    } else if (allOrders[i].status == 1) {
                        allOrders[i].return_approved = 'Delivered';
                    } 


                    const currentDay = new Date();
                    const diffTime = (currentDay - allOrders[i].delivered_date );
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
            
                    


                    // if (Math.sign(diffDays) === -1 || Math.sign(diffDays) === 0 || diffDays <= 15) {
                    //     allOrders[i].returnable = true;
                    // } else if (allOrders[i].status == 1) {
                    //     allOrders[i].returnable = false;
                    // } 

                }

                // month year wise filter

                if (otherMatch.month && otherMatch.year) {
                    allOrders = allOrders.filter(x =>
                        (new Date(x.create).getMonth() + 1) === otherMatch.month
                        &&
                        (new Date(x.create).getFullYear()) === otherMatch.year
                    )
                }



                allOrders = allOrders.filter(x => x.product.length);
                allOrders = allOrders.sort((a, b) => new Date(b.updated) - new Date(a.updated));




                if (Limit) {
                    allOrders = allOrders.slice(SkipRecord);
                    allOrders.length = Limit;
                }

                allOrders = allOrders.filter(x => x);


                return resolve(allOrders)

            } catch (err) {
                return resolve({ message: err.message });
            }
        });
    } catch (error) {
        return resolve({ message: err.message });
    }
}


















function isValidOjectId(id) {
    if (mongoose.Types.ObjectId.isValid(id)) {
        return true;
    } else {
        return false;
    }
}

function addDaysToDate(day, date) {
    const fdate = moment(date ? new Date(date) : new Date()).add(day, 'days').format('DD/MM/YYYY');
    // function process(date){
    var parts = fdate.split("/");
    return new Date(parts[2], parts[1] - 1, parts[0]);
    //  }
}

function bank_contact(reqBody) {
 
        return new Promise(async (resolve, reject) => {
            try {
                var request = require('request');
                var razorPayX_headers = { 'Content-Type': 'application/json',
                'Authorization': `Basic ${Buffer.from( `${razorPay_Key_id}:${razorPay_Key_Secret}`).toString("base64")}`};
                var options = {
                  'method': 'POST',
                  'url': 'https://api.razorpay.com/v1/contacts',
                  'headers': razorPayX_headers,
                  body: JSON.stringify(
                      {"name":reqBody.name,
                      "email":reqBody.email,
                      "contact":reqBody.contact,
                      "type":reqBody.contact_type})
                
                };
                request(options, function (error, response) {
                  if (error) throw new Error(error);
                  
                  parsedBody = JSON.parse(response.body);  
                
                    if ( parsedBody) {
                        return resolve(parsedBody);
                    } else {
                        return resolve(false);
                    }
                });
            } catch (error) {
                return resolve(false);
            }
        });
    }

    function fundAccount_bank(id,reqBody) {

        
        return new Promise(async (resolve, reject) => {
            try {
                var request = require('request');
                var razorPayX_headers = { 'Content-Type': 'application/json',
                'Authorization': `Basic ${Buffer.from( `${razorPay_Key_id}:${razorPay_Key_Secret}`).toString("base64")}`};
                var options = {
                    'method': 'POST',
                    'url': 'https://api.razorpay.com/v1/fund_accounts',
                    'headers':razorPayX_headers,
                    body: JSON.stringify({"contact_id":id,
                    "account_type":reqBody.account_type,
                    "bank_account":{
                        "name":reqBody.name,
                        "ifsc":reqBody.ifsc,
                        "account_number":reqBody.account_number}})         
                  };
                  request(options, function (error, response) {
                    if (error) throw new Error(error);
                  parsedBody = JSON.parse(response.body);  
                
                    if ( parsedBody) {
                        return resolve(parsedBody);
                    } else {
                        return resolve(false);
                    }
                });
            } catch (error) {
                return resolve(false);
            }
        });
    }
    function PayOut_bank(id,reqBody) {
    
               return new Promise(async (resolve, reject) => {
                   try {
                       var request = require('request');
                       var razorPayX_headers = { 'Content-Type': 'application/json',
                       'Authorization': `Basic ${Buffer.from( `${razorPay_Key_id}:${razorPay_Key_Secret}`).toString("base64")}`};
                       var options = {
                        'method': 'POST',
                        'url': 'https://api.razorpay.com/v1/payouts',
                        'headers': razorPayX_headers,
                        body: JSON.stringify({
                            "account_number":reqBody.account_number,
                            "fund_account_id":id,
                            "amount":reqBody.amount,
                            "currency":reqBody.currency,
                            "mode":"NEFT",
                            "purpose":reqBody.purpose,
                            "queue_if_low_balance":true})
                      };
                      request(options, function (error, response) {
                        if (error) throw new Error(error);
                         parsedBody = JSON.parse(response.body);  
                       
                           if ( parsedBody) {
                               return resolve(parsedBody);
                           } else {
                               return resolve(false);
                           }
                       });
                   } catch (error) {
                       return resolve(false);
                   }
               });
           }

           










