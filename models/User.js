const { Schema, model, models } = require('mongoose');

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    address: {
        type: String,
        required: true,
        unique: true,
    },
    version: {
        type: Number,
        default: 1
    },
}, { timestamps: true })

const User = models.User || model("User", UserSchema);
module.exports = User;