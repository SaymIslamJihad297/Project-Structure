const mongoose = require('mongoose');
const {Schema} = mongoose;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
    },
    role: {
        type: String,
        enum: [
          'super_admin',         // platform owner
          'org_admin',           // business owner
          'marketing_manager',   // creates, schedules, publishes posts
          'content_creator',     // drafts posts, uses AI, can't publish
          'team_member',         // limited access, can view
          'guest'                // optional, read-only
        ],
        default: 'team_member'
      },
      
    organizationId:[{
        type: Schema.Types.ObjectId,
        ref: 'Organization',
    }],
    googleId: {
        type: String,
    }
})

userSchema.pre('save', async function(next){
    if(!this.isModified('password') || !this.password) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
})

userSchema.methods.verifyPassword = async function(password){
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = async function() {
    return jwt.sign(
        {
            _id: this._id,
            name: this.name,
            email: this.email,
            role: this.role,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    )
}
userSchema.methods.generateRefreshToken = async function() {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    )
}

module.exports = mongoose.model('User', userSchema);