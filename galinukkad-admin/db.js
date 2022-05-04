const config = require('../config.json');
const mongoose = require('mongoose');
const sub_category = require('../models/sub_category');


// const localDB = "mongodb+srv://galinukkad:0DClIBdWuMIbslM5@cluster0.b8kdt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority/galinukkad";

const localDB = "mongodb://127.0.0.1:27017/martfury"; // LIVE URL

// const localDB = "mongodb://127.0.0.1:27017/galinukkad";

mongoose.connect(process.env.MONGODB_URI || localDB,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false }
).then(() => {
    console.log(`DB connection successfull`);
}).catch((error) => {
    console.log(error);
});
 

mongoose.Promise = global.Promise;

module.exports = {
    UserLogins: require('../models/login'),
    Profile: require('../models/profile'),
    Address: require('../models/address'),
    Category: require('../models/category'),
    Product: require('../models/products'),
    Bussiness: require('../models/bussiness'),
    otp: require('../models/otp'),
    Cart: require('../models/cart'),
    Wishlist: require('../models/wishlist'),
    Contact: require('../models/contact'),
    Order: require('../models/order'),
    OrderDetails: require('../models/order_details'),
    Review: require('../models/review'),
    NewsLetter: require('../models/newsletter'),
    RecentViewed: require('../models/recent_viewed'),
    Notification: require('../models/notification'),
    Ticket: require('../models/ticket'),
    Campaign: require('../models/campaign'),
    ChatMessage: require('../models/chat_message'),
    ChatGroup: require('../models/chat_group'),
    AdvPlan: require('../models/advplan'),
    AdvPlanBook: require('../models/advplanbook'),
    NewsCategory: require('../models/newscategories'),
    NewsArticle: require('../models/newsarticles'),
    Keywords: require('../models/keywords'),
    Communication: require('../models/communication'),
    Sub_Category: require('../models/sub_category'),
    CouponCodes: require('../models/coupon_code'),
    HomePageBanner: require('../models/home_page_banner'),
    Order_Return: require('../models/order_return'),
    Shipping_Rates: require('../models/shipping_rates'),
    Shipping_Codes: require('../models/shipping_codes'),
    Frequently_Asked_Question: require('../models/frequently_asked_question'),
    Visitor_Graph: require('../models/visitor_graph'),
    Product_rating: require('../models/products_rating'),
    Compare_product: require('../models/compare_products'),
    Payment_details: require('../models/payment_details'),
    HtmlPages: require('../models/htmlPages'),
    cancel_policy: require('../models/cancel_policy'),
    return_policy_days: require('../models/return_policy_days'),
    replaceOrder: require('../models/replceOrder'),
    productQuesAns: require('../models/product_ques_ans'),
    manage_caselog: require('../models/manage_caselog'),
    Plans: require('../models/plans'),
    bank_transaction: require('../models/bank_transaction'),
    Ecom_Annexure: require('../models/ecom_annexure'),

    Announcement: require('../models/announcement.model.js'),
    Blog: require('../models/blogs'),
    BlogsCategory: require('../models/blogscategories'),
    Attribute: require('../models/attribute.model.js'),
    Unit: require('../models/unit.model.js'),
    Setting: require('../models/settings.js'),
    Ticket_Query: require('../models/ticket-query.model.js'),
};
