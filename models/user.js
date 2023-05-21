import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: 'Name required.' 
  },
  email: { 
    type: String, 
    required: 'Email required.',
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password: { 
    type: String, 
    required: 'Password required.' 
  },
  bio: String,
  active: {
    type: Boolean,
    default: false
  },
  validKey: String
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret.password;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

UserSchema.pre('save', function(next) {
  if (this.isModified('password')) {
    bcrypt.hash(this.password, 10)
      .then((hash) => {
        this.password = hash;
        next();
      })
  } else {  
    next();
  }
});

export default mongoose.model('User', UserSchema);