const { forgetPassword, verifyOtp } = require('../controllers/otpController');
const { isUserLoggedIn } = require('../middleware/middlewares');

const router = require('express').Router();

router.get('/protected', isUserLoggedIn,(req, res)=>{
    res.json({message: `hello from protected route with ${process.pid}`});
})

router.post('/forgot-password', forgetPassword);

router.post('/verify-otp', verifyOtp);

module.exports = router;