export const calculateReviews = (reviews) => {
    let reviewCount = 0;
    
     if(reviews && reviews.length > 0) {
         let totalReviews = reviews.length;
         reviews.forEach((review) => {
             reviewCount += review.rating;
         });
         reviewCount /= totalReviews;
         return reviewCount;
     }
     else {
         return 0;
     }
 }

export const reviewPercentage = (percentValue,reviews) => {
    let percetage = 0;
    if(reviews && reviews.length > 0) {
        let totalReviews =  reviews.length;
        percetage = (reviews.filter((review) => review.rating === percentValue ).length / totalReviews ) * 100;
    }
    return percetage;
};



export const isUserLoggedIn = () => {
    return localStorage.getItem('accessToken')?true:false;
}



export const getImageName = (imagePath) => {
    // const imagePathTokens = imagePath.split('/');
    // return imagePathTokens[imagePathTokens.length-1];
    return imagePath
}


export const getTitleImage = (name) => {
     let nameTokens = name.split(' ');
     nameTokens = nameTokens.map((nameToken) => {
        return nameToken.substr(0,1).toUpperCase()+nameToken.substr(1);
     })
    //  return nameTokens.join(' ');

    return name.substr(0, 10)
}