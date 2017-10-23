const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      bcrypt = require('bcrypt-nodejs');

const UserSchema = new Schema({
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  profile: {
    firstName: { type: String },
    lastName: { type: String }
  },
  role: {
    type: String,
    enum: ['Member', 'Mentor', 'Admin'],
    default: 'Member'
  },
  // resetPasswordToken: { type: String },
  // resetPasswordExpires: { type: Date }
},
{
  timestamps: true
});

// Pre-save of user to database, hash password if password is modified or new
UserSchema.pre('save', function(next) {
  const user = this;

  if (!user.isModified('password')) return next();

  // bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
  //   if (err) return next(err);
  //
  //   bcrypt.hash(user.password, salt, null, (err, hash) => {
  //     if (err) return next(err);
  //     user.password = hash;
  //     next();
  //   });
  // });

  user.createPasswordHash(user.password, (hash) => {
    user.password = hash;
    next();
  });
});

//refactor hash generation to own method for use in password updates
UserSchema.methods.createPasswordHash = (password, cb) => {
  const SALT_FACTOR = 5;

  bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(password, salt, null, (err, hash) => {
      if (err) return next(err);
      cb(hash);
    });
  });
}

// Method to compare password for login
UserSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) { return cb(err); }

    cb(null, isMatch);
  });
}

module.exports = mongoose.model('User', UserSchema);
