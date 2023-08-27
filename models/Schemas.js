const mongoose = require('mongoose');
const shortid = require('shortid');


const UserSchema = mongoose.Schema({
  Name: {
    type: String,
    required: true
  },
  Email: {
    type: String,
    required: true
  },
  DOB: {
    type: String,
    required: true
  },
  pin: {
    type: String,
    required: true
  },
  phoneNumber: {
    type:Number,
    required: true
  },
});

const ItemSchema = mongoose.Schema({
  foodCategory: {
    type: String,
    required: true
  },
  foodName: {
    type: String,
    required: true
  },
  foodPrice: {
    type: String,
    required: true
  }
});

const User = mongoose.model('User', UserSchema);
const Item = mongoose.model('Item', ItemSchema)

module.exports = {
  User,
  Item
};
