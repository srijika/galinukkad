import request from '../utils/request';

//Global
export function resetpassword(params) {
  return request('/resetpassword', { method: 'POST', body: params, });
}

export function uploadFiles(params) {

  return request('/upload/file', { method: 'POST', body: params, });
}

//Auth
export function login(params) {
  return request('/login', { method: 'POST', body: {...params, isOtp: "0", firbaseToken:'' }, });
}
export function Register(params) {
  return request('/signup', { method: 'POST', body: params, });
}
export function forgetpassword(params) {
  return request('/forgetpassword', { method: 'POST', body: params, });
}


export function profileGet() {
  return request('api/profile', {method: 'GET'});
}
export function profilePut(params) {
  return request('api/profile', { method: 'PUT', body: params, });
}
export function productsList(val) {
  return request('api/list?page='+val.page+'&limit='+val.limit, {method: 'GET'});
}

export function updateQuntityStock(val) {
  return request('/api/updateQty', {method: 'POST' ,body: val });
}

export function getDashboardData(val) {
  return request('/dashboard', { method: 'POST', body: val, });
}

export function getprofile(val) {
  return request('/getprofile', { method: 'POST', body: val, });
}

export function updateprofile(val) {
  return request('/updateprofile', { method: 'POST', body: val, });
}


//Category
export function createCat(params) {
  return request('/createcat', { method: 'POST', body: params, });
}
export function updateCat(params) {
  return request('/updatecat', { method: 'POST', body: params, });
}
export function getallcategries(params) {
  return request('/getallcategries', { method: 'POST', body: params}); 
}
export function catDetail(params) {
  return request('/getcat', {method: 'POST', body: params,});
}
export function deletecat(params) {
  return request('/deletecat', {method: 'POST', body: params,});
}

//SubCategory
export function createSubCat(params) {
  return request('/create-sub-category', { method: 'POST', body: params, });
}
export function updateSubCat(params) {
  return request('/update-sub-category', { method: 'POST', body: params, });
}
export function getallsubcategries(params) {
  return request('/getAll-sub-category', { method: 'POST',  body: params,}); 
}
export async function getSubCatbyCategory(params) {
  const data = await request('/sub-category-by-category', { method: 'POST', body: params, });
  return data;
}
export function catSubDetail(params) {
  return request('/get-sub-category', {method: 'POST', body: params,});
}
export function deleteSubCat(params) {
  return request('/delete-sub-category', {method: 'POST', body: params,});
}

//Product
export function getAllProduct(params) {
  return request('/get-all-products', { method: 'POST', body: params, });
}
export function getProduct(params) {
  return request('/product-detail', { method: 'POST', body: params, });
}
export function updateProducts(params) {
  return request('/update-products', { method: 'PUT', body: params, });
}
export function createProduct(params) {
  return request('/create-products', { method: 'POST', body: params}); 
}
export function deleteProducts(params) {
  return request('/delete-products', {method: 'POST', body: params,});
}
export function uploadExcel(params) {
  return request('/upload/product/excel', {method: 'POST', body: params,});
}
export function getSellerProducts(params) {
  return request('/get-all-products', {method: 'POST', body: params,});
}

//Verification
export function getbussiness(params) {
  return request('/getbussiness', { method: 'POST', body: params, });
}

export async function getBussinessBySellerId(id){
  return await request('/getbussiness-by-bussness-id?bussiness_id='+ id._id, { method: 'GET'})
}

export async function getBussinessByUserId(id){
  return await request('/getbussiness-by-user-id?user_id='+ id._id, { method: 'GET'})
}

export function getallsellerbussiness(params) {
  return request('/get-all-seller-info-list', { method: 'POST', body: params, });
}
export function createbussiness(params) {
  return request('/createbussiness', { method: 'POST', body: params, });
}
export function approvebussiness(params) {
  return request('/approvebussiness', { method: 'POST', body: params, });
}
export function updatebussiness(params) {
  return request('/updatebussiness', { method: 'POST', body: params, });
}

export function getallbussiness(params) {
  return request('/getallbussiness', { method: 'POST', body: params, });
}

// Users API
export function getUserList(params) {
  return request('/getalluserlist', { method: 'POST', body: params, });
}
export function getUserDetail(params) {
  return request('/getprofile', { method: 'POST', body: params, });
}
export function editUsers(params) {
  return request('/editUsers', { method: 'POST', body: params, });
}
export function deleteUser(params) {
  return request('/deleteuser', { method: 'POST', body: params, });
}

// Orders API
 export function getOrders(params) {
   return request('/get/seller/order',{method:'POST',body:params})
 }

// Orders API
 export function getOrdersAdmin(params) {
   return request('/get/admin/order',{method:'POST',body:params})
 }

//  Order Detail Api
 export function orderDetails(params) {
   return request('/order/detail',{method:'POST',body:params})
 }

// Cancel Order
export function cancelOrder(params) {
  return request('/cancel/order',{method:'POST',body:params})
}
// Refund Order
export function refundOrder(params) {
  return request('/refund/order',{method:'POST',body:params})
}

//Advtisement
export function getAdvPlanList(params) {
  return request('/list/advplan',{method:'POST',body:params})
}

export function bookPlanSeller(params) {
  return request('/book/advplan',{method:'POST',body:params})
}

export function getActiveAdvPlanList(params) {
  return request('/activelist/advplan',{method:'POST',body:params})
}

export function deleteBookPlan(params) {
  return request('/deleteBookPlan/advplan',{method:'POST',body:params})
}

//News Category
export async function  getNewsCategoryList(params) {
  return await request('/list/newscategory',{method:'POST',body:params})
}

export function createNewsCategoryList(params) {
  return request('/create/newscategory',{method:'POST',body:params})
}

export function updateNewsCategory(params) {
  return request('/update/newscategory',{method:'POST',body:params})
}

export function deleteNewsCategory(params) {
  return request('/delete/newscategory',{method:'POST',body:params})
}


//News 
export function getNewsList(params) {
  return request('/list/newsarticle',{method:'POST',body:params})
}

export function createNews(params) {
  return request('/create/newsarticle',{method:'POST',body:params})
}

export function newsDetail(params) {
  console.log("props.match.params.params ", params)

  return request('/get-news?slug='+params,{method:'GET'});
}

export function updateNews(params) {
  return request('/update/newsarticle',{method:'POST',body:params})
}

export function deleteNews(params) {
  return request('/delete/newsarticle',{method:'POST',body:params})
}
//  Tickets
export function getSellerTicketList(params) {
  return request('/get/seller/tickets',{method:'POST',body:params});
}

export function getTicketList() {
  return request('/get/all/tickets',{method:'GET'});
}
export function getContactList() {
  return request('/contact-list',{method:'GET'});
}

export function  createTicket(params){
  params.product_id = '5f9310f0663a913ac57be35f';
  return request('/create/ticket',{method:'POST',body:params});
}

export function  detailTicket(params){
  return request('/detail/ticket',{method:'POST',body:params});
}

export function updateTicket(params){
  return request('/update/ticket/answer',{method:'POST',body:params});
}
export function closeTicket(params){
  return request('/update/ticket/status',{method:'POST',body:params});
}

// pages
export function getPagesList(params){
  return request('/getAll-html-pages',{method:'POST', body:params});
}

export function createPages(params) {
  return request('/create-html-pages',{method:'POST', body:params});
}

export function pagesDetail(params) {
  return request('/get-html-pages?slug='+params,{method:'GET'});
}

export function editPages(params) {
  return request('/update-html-pages',{method:'PUT', body:params});
}

export function deletePages(params) {
  return request('/delete-html-pages?slug='+params,{method:'DELETE'});
}
// Notification
export function getNotifList(params){
  return request('/notification/listing',{method:'POST', body:params});
}

export function createNotif(params) {
  return request('/add-notification',{method:'POST', body:params});
}

export function deleteNotif(params) {
  return request('/delete-notification',{method:'POST', body:params});
}


// Communication
export function createCommunication(params){
  return request('/create/communication',{method:'POST',body:params});
}

export function updateCommunication(params){
  return request('/update/communication',{method:'POST',body:params});
}

export function getSellerCommDataList(params){
  return request('/seller/list/communication',{method:'GET'});
}

// Transaction
export function getSellerTranDataList(params){
  return request('/place/getOrderDetails',{method:'POST', body:params});
}

export function getSellerBusinessDataList(params){
  return request('/getbussiness-by-user-id?user_id='+params.seller_id, {method:'GET'});
}

export function createBankTrn(params){
  return request('/admin-banktransfer', {method:'POST', body:params});
}






export function getCoupons() {
  return request('/getAll-coupon-codes',{method:'GET'});
}

export function deleteCoupon(params) {
  return request('/delete-coupon-codes?_id='+params._id,{method:'DELETE'});
}

export function createCoupon(params) {
  return request('/create-coupon-codes',{method:'POST', body:params});
}

export function editCoupon(params) {
  return request('/update-coupon-codes',{method:'PUT', body:params});
}


export function getHomePageBanner() {
  return request('/getAll-home-page-banner',{method:'GET'});
}

export function createHomePageBanner(params) {
  const formData = new FormData();
  formData.append('image',params.image);
  formData.append('title',params.title);
  formData.append('description',params.description);
  return request('/create-home-page-banner',{method:'POST',body:formData});
}


export function deleteHomePageBanner(params) {
  return request('/delete-home-page-banner?_id='+params._id,{method:'DELETE'});  
}
export function updateHomePageBanner(params) {
  const formData = new FormData();
  if(params.image){
    formData.append('image',params.image);
  }
  formData.append('title',params.title);
  formData.append('description',params.description);
  formData.append('isActive',params.isActive);
  formData.append('banner_size',params.banner_size);
  formData.append('_id',params._id);
  return request('/update-home-page-banner',{method:'PUT',body:formData});  
}

// Shipping Rates
export function getShippingRates() {
  return request('/getAll-shipping-rates',{method:'GET'});
}

export function getShippingRate(payload) {
  return request('/getOne-shipping-rates?_id='+payload.id,{method:'GET'});
}

export function createShippingRate(payload) {
  return request('/create-shipping-rates',{method:'POST' , body:payload});
}

export function updateShippingRate(payload) {
  return request('/update-shipping-rates',{method:'PUT' , body:payload});
}

export function deleteShippingRate(payload) {
  return request('/delete-shipping-rates?_id='+payload.id,{method:'DELETE' , body:payload});
}

export function getFrequentlyAskedQuestionsByUserId(payload) {
  return request('/get-frequently-asked-question-by-userid?userId='+payload.userId,{method:'GET'});
}

// Questions-answers

export function getQAnsByProductIds(payload) {
  return request('/get-product-ques-ans-by-product-id?product_id='+payload.product_id,{method:'GET'});
}

export function updateQAns(payload) {
  return request('/update-product-ques-ans',{method:'PUT', body:payload});
}

export function deleteQAns(payload) {
  return request('/delete-product-ques-ans-by-ques-id?ques_id='+payload._id,{method:'DELETE'});
}

// Frequently asked questions

export function getFrequentlyAskedQuestions() {
  return request('/get-frequently-asked-questionlist',{method:'GET'});
}

export function createFrequentlyAskedQuestion(payload) {
  return request('/create-frequently-asked-question',{method:'POST' , body:payload});
}

export function updateFrequentlyAskedQuestion(payload) {
  return request('/update-frequently-asked-question',{method:'PUT' , body:payload});
}

export function deleteFrequentlyAskedQuestion(payload) {
  return request('/delete-frequently-asked-question?_id='+payload.id,{method:'DELETE'});
}

//Campaign
export function getAllCampaign(params) {
  return request('/list/all/campaign', { method: 'GET' });
}
export function getSellerCampaign(params) {
  return request('/list/campaign', {method: 'GET'});
}
export function campaignUpdate(params) {
  return request('/update/campaign', { method: 'POST', body: params, });
}
export function updateCampaign(params) {
  return request('/update/campaign/status', { method: 'POST', body: params, });
}
export function createCampaign(params) {
  return request('/create/campaign', { method: 'POST', body: params}); 
}
export function deleteCampaign(params) {
  return request('/delete/campaign', {method: 'POST', body: params,});
}
export function getCampaignById(params) {
  return request('/detail/campaign', {method: 'POST', body: params,});
}


// case-log
export function getAllCaseLog(params) {
  return request('/get/all/manage-caselog', { method: 'POST', body: params });
}

export function updateCaseLog(params) {
  return request('/update/manage-caselog', { method: 'POST', body: params, });
}

export function deleteCaseLog(params) {
  return request('/delete/manage-caselog', {method: 'POST', body: params,});
}

export function varifyUser(params) {
  return request('/verify/otp', {method: 'POST', body: params});
}

export function resendOTPTOUser(params) {
  return request('/send-otp-to-user', {method: 'POST', body: params});
}

export function resetPassword(params) {
  return request('/resetPassword', {method: 'POST', body: params});
}

export function changePassword(params) {
  return request('/changepassword', {method: 'POST', body: params});
}


// Blog
export function getBlogsList(params){
  return request('/getAll-html-blogs',{method:'POST', body:params});
}

export function createBlogs(params) {
  return request('/create-blogs',{method:'POST', body:params});
}

export function blogsDetail(params) {
  return request('/get-blogs?slug='+params,{method:'GET'});
}

export function editBlogs(params) {
  return request('/update-blogs',{method:'PUT', body:params});
}

export function deleteBlogs(params) {
  return request('/delete-blogs?slug='+params,{method:'DELETE'});
}


//Blog Category
export async function  getBlogsCategoryList(params) {
  return await request('/list/blogscategory',{method:'POST',body:params})
}

export function createBlogsCategoryList(params) {
  return request('/create/blogscategory',{method:'POST',body:params})
}

export function updateBlogsCategory(params) {
  return request('/update/blogscategory',{method:'POST',body:params})
}

export function deleteBlogsCategory(params) {
  return request('/delete/blogscategory',{method:'POST',body:params})
}


export async function  getAttributes(params) {
  return await request('/list/attribute',{method:'POST',body:params})
}

export function addAttribute(params) {
  
  return request('/create/attribute',{method:'POST',body:params})
}

export function updateAttribute(params) {
  return request('/delete/blogscategory',{method:'POST',body:params})
}



//Return Policy
export async function  getReturnPolicyList(params) {
  return await request('/getAll-return-policy-days',{method:'GET'})
}

export function createReturnPolicy(params) {
  return request('/add-return-policy-days',{method:'POST',body:params})
}

export function updateReturnPolicy(params) {
  return request('/update-return-policy-days',{method:'PUT',body:params})
}

export function deleteReturnPolicy(params) {
  return request("/remove-return-policy-days",{method:'POST',body:params})
}

