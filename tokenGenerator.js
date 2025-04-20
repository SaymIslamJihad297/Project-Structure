const userModels = require("./models/user.models")


module.exports.accessTokenAndRefreshTokenGenerator = async function(userId){
    const user = await userModels.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    return {accessToken, refreshToken};
}


