export const RestAPI = {
    ORIGINAL_ENDPOINT: "https://rjeh26z1b7.execute-api.us-east-1.amazonaws.com/dev/",
    USER_TOKEN: localStorage.getItem("userSession") ? JSON.parse(localStorage.getItem("userSession")) : null, // accessToken, idToken, refreshToken 
    // JWT_HEADER: {
    //                 headers: {
    //                     'Authorization': `${ localStorage.getItem("userSession") ? JSON.parse(localStorage.getItem("userSession")).idToken.jwtToken : ''}`
    //                 }
    //             }
}