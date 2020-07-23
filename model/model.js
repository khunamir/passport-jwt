const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const UserSchema = new Schema ({
    email : {
        type: String,
        required: true,
        unique: true
    },
    password : {
        type: String,
        required: true
    }
});

// hash password before saving a document
UserSchema.pre('save', async function(next){
    const user = this;

    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;

    next();
});

UserSchema.methods.isValidPassword = async function(password) {
    const user = this;
    const compare = bcrypt.compare(password, user.password);
    return compare;
};

const UserModel = mongoose.model('user', UserSchema);

module.exports = UserModel;