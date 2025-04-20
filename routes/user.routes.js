const { isUserLoggedIn } = require('../middleware/middlewares');

const router = require('express').Router();

router.get('/protected', isUserLoggedIn,(req, res)=>{
    res.json({message: `hello from protected route with ${process.pid}`});
})

module.exports = router;