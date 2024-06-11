const { mongoose } = require('../utils/conn');

const userLeadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  countryCode: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^\+\d{1,3}$/.test(v); 
      },
      message: props => `${props.value} is not a valid country code!`
    }
  },
  phoneNo: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /\d{10}/.test(v); // Validates a 10-digit phone number
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    validate: {
      validator: function(v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: props => `${props.value} is not a valid email address!`
    }
  },
  creationDateTime: {
    type: Date,
    default: Date.now
  }
});

const UserLead = mongoose.model('UserLead', userLeadSchema);

module.exports = UserLead;
