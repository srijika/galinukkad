const { Shipping_Codes, Profile, Product  } = require('../_helper/db');
// const Profile = db.Profile;

const Helper = require('../core/helper')

module.exports = {
    createShippingCodes: async (req, res, next) => {
        try {
            const reqBody = req.body;
            let created = '';

            if (Array.isArray(reqBody)) {
                created = await Shipping_Codes.insertMany(reqBody);
            } else {
                const shippingModel = new Shipping_Codes(reqBody);
                created = await shippingModel.save();
            }

            return res.send({ status: true, data: created, message: 'Shipping Codes created successfully' });

        } catch (error) {
            return res.send({ status: false, message: error.message });
        }
    },

    updateShippingCodes: async (req, res, next) => {
        try {
            const reqBody = req.body;
            const Id = reqBody._id;

            if (!Id) {
                return res.send({ status: false, message: 'Id is required' });
            }

            const shipping = await Shipping_Codes.findByIdAndUpdate(Id, reqBody).lean().exec();

            if (!shipping) {
                return res.send({ status: true, message: 'shipping data not found for this id' });
            }

            return res.send({ status: true, message: 'Info updated successfully' });

        } catch (error) {
            return res.send({ status: false, message: error.message });
        }
    },

    getOneShippingCodes: async (req, res, next) => {
        try {
            const reqQuery = req.query;
            const Id = reqQuery._id;

            if (!Id) {
                return res.send({ status: false, message: 'Id is required' });
            }

            const shipping = await Shipping_Codes.findById(Id).lean().exec();

            if (!shipping) {
                return res.send({ status: false, message: 'shipping Codes not found for this id' });
            }

            return res.send({ status: true, data: shipping, message: 'Shipping Codes get successfully' });

        } catch (error) {
            return res.send({ status: false, message: error.message });
        }
    },

    getAllShippingCodes: async (req, res, next) => {
        try {

            const reqBody = req.body;
            const Limit = reqBody.limit ? parseInt(reqBody.limit) : 10;
            const PageNo = reqBody.page ? parseInt(reqBody.page) : 0;

            const AllShipping = await Shipping_Codes.find().skip(Limit * PageNo).limit(Limit).lean().exec();
            const count = await Shipping_Codes.count();

            return res.send({ status: true, data: AllShipping, count: count, message: 'All Shipping code get successfully' });

        } catch (error) {
            return res.send({ status: false, message: error.message });
        }
    },

    deleteShippingCodes: async (req, res, next) => {
        try {
            const reqQuery = req.query;
            const Id = reqQuery._id;

            if (!Id) {
                return res.send({ status: false, message: 'Id is required' });
            }

            const deleted = await Shipping_Codes.findByIdAndDelete(Id).lean().exec();

            if (!deleted) {
                return res.send({ status: false, message: 'shipping code not found' });
            }

            return res.send({ status: true, message: 'shipping code deleted successfully' });

        } catch (error) {
            return res.send({ status: false, message: error.message });
        }
    },


    shippingCodeCheck : async (req, res, next) => {

        let {pincode} = req.body;
        let shipping_code = await Shipping_Codes.findOne({ pincode: pincode });

        if(shipping_code) {
            return res.send({ status: true, message: "Product is Deliverable " });
        }else {
            return res.send({ status: false, message: "Product is Non Deliverable ." });
        }

    },
    getShippingCodesByPincodeNo: async (req, res, next) => {
        try {

            // ECOM EXPRESS SHIPPING CODES  

            let { pincode, products } = req.body;    

            let ecom_price = await Promise.all(products.map(async (item) => {
                let result = await Helper.mainEcomExpressPricing(item, pincode);

                result["total_quantity_ecom_price"] = item.quantity * result.ecom_express_price;
                result["quantity"] = item.quantity;
                return  result;
            }));    

             

            
            let galinukkad_price = await Promise.all(products.map(async (item) => {
                let result = await Helper.galinukkadShippingPrice(item, pincode);

                result["total_quantity_galinukkad_price"] = item.quantity * result.galinukkad_shipping_price;
                result["quantity"] = item.quantity;
                return  result;
            }));    
            

            let shipping_pricing = ecom_price.map((item, i) => Object.assign({}, item, galinukkad_price[i]));

            return res.send({ status: true, data: shipping_pricing, message: 'Shipping code get successfully' });
        } catch (error) {
            console.log(error);
            return res.send({ status: false, message: error.message });
        }
    },




    // getShippingCodesByPincodeNo: async (req, res, next) => {
    //     try {

    //         // ECOM EXPRESS SHIPPING CODES  

    //         let { pincode, product_id, seller_id } = req.body;

            
        
    //         let seller_detail = await Profile.findOne({loginid: seller_id});
    //         let metro_cities = ['DELHI', 'MUMBAI', 'BENGALURU', 'CHENNAI', 'KOLKATA'];

    //         if (!pincode) {
    //             return res.send({ status: false, message: 'pincode is required' });
    //         }


    //         let product = await Product.findById(product_id).select('title weight price');
            
    //         const customer_address = await Shipping_Codes.findOne( { pincode: pincode } ).select('pincode area region city_name dv_routing_code state  Regular_UP_ROS').lean().exec();
    //         const seller_address = await Shipping_Codes.findOne( { pincode: seller_detail.postal } ).select('pincode area region city_name dv_routing_code state  Regular_UP_ROS').lean().exec();
            

    //         console.log(customer_address);
    //         console.log(seller_address);
    //         if(!customer_address || !seller_address) {
    //             return res.send({ status: false, message: 'pincode not found' });
    //         }

            
    //         let delivery_message = 'Product is available for delivery in this pin code';
            
    //         let base_shipping_price;
    //         let product_weight = product.weight;
    //         // let product_weight = 350;

    //         // ZONE A INTRA CITY 
    //         if(customer_address.city_name === seller_address.city_name) {
    //             base_shipping_price = 27; // Intra City Shipping Price
    //             let shipping_charge = Helper.totalShippingChargesCalculation(base_shipping_price, product_weight, customer_address, seller_address);
    //             console.log('zone a cities shipping result');
    //             console.log(shipping_charge);
                
    //             return res.send({ status: true, message: delivery_message });
    //         }


    //         // CHECK RESULT FOR REGION
    //         if(customer_address.region === seller_address.region && customer_address.state != 'JK' && seller_address.state != 'JK') {
    //             base_shipping_price = 33;  
    //             let shipping_charge = Helper.totalShippingChargesCalculation(base_shipping_price, product_weight, customer_address, seller_address);
    //             console.log('zone B region shipping result');
    //             console.log(shipping_charge);
    //             return res.send({ status: true, message: delivery_message });
    //         }

    //         // SELLER OR CUSTOMER LOCATION ARE JNK
    //         if(customer_address.state === "JK" || seller_address.state === "JK") {
    //             base_shipping_price = 45;  
    //             let shipping_charge = Helper.totalShippingChargesCalculation(base_shipping_price, product_weight, customer_address, seller_address);
    //             console.log('Jammu and Kashmir shipping result');
    //             console.log(shipping_charge);
    //             return res.send({ status: true, message: delivery_message });
    //             // return shipping_charge;
    //         }


    //         // FOR BOTH SELLER AND CUSTOMER ARE IN METRO CITIES
    //         if(metro_cities.includes(customer_address.city_name) &&  metro_cities.includes(seller_address.city_name)) {
    //             base_shipping_price = 38;  
    //             let shipping_charge = Helper.totalShippingChargesCalculation(base_shipping_price, product_weight, customer_address, seller_address);
    //             console.log('metro cities shipping result');
    //             console.log(shipping_charge);
    //             return res.send({ status: true, message: delivery_message });
    //             // return shipping_charge;
    //         }


    //         // NORTH EAST AND ANDAMAN LOCATION PRICE AND SURCHARGE PRICE UP 50rs INCREASE  PER 500 GMS
    //          let north_east_states = ['MN', 'TR', 'ML', 'AR', 'SK', 'NL', 'MZ'];
    //         if(north_east_states.includes(customer_address.state) ||   north_east_states.includes(seller_address.state)) {
    //             base_shipping_price = 45;  

    //             let shipping_charge = Helper.totalShippingChargesCalculation(base_shipping_price, product_weight, customer_address, seller_address);
    //             // ADD 50rs EVERY 500 GMS
    //             let product_weight_charge_check = Helper.productWeightCalculationCharge(product_weight);           
    //             let add_every_weight = product_weight_charge_check * 50;

    //             let total = add_every_weight + shipping_charge;

    //             console.log('NORTH EAST AND ANDAMAN LOCATION');
    //             console.log(total);
    //             return res.send({ status: true, message: delivery_message });
    //             // return total;
    //         }



    //         // NON METRO CITIES AND OTHER CITY SHIPPING RESULT 
    //         if(customer_address.region != seller_address.region) {
    //             base_shipping_price = 42;  
    //             let shipping_charge = Helper.totalShippingChargesCalculation(base_shipping_price, product_weight, customer_address, seller_address);
    //             console.log('other shipping result');
    //             console.log(shipping_charge);
    //             return res.send({ status: true, message: delivery_message });
    //             // return shipping_charge;
    //         }



    //         // let product_weight_charge_check = Helper.productWeightCalculationCharge(product_weight);           
    //         // let calculate_surcharge = Helper.calculateSurcharge(base_shipping_price, product_weight_charge_check);
    //         // let Regular_UP_ROS_total_charges = Helper.extraLocationRegularUpRosChrages(customer_address, seller_address);
    //         // let shipping_result = calculate_surcharge + Regular_UP_ROS_total_charges + calculate_surcharge * 18 / 100;
    //         console.log(shipping_result);
    //         console.log('test data');
    //         return ;
            

    //         return res.send({ status: true, data: shipping, message: 'Shipping code get successfully' });

    //     } catch (error) {
    //         console.log(error);
    //         return res.send({ status: false, message: error.message });
    //     }
    // },


}
