const mongoose = require("mongoose");
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    age: { type: Number, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "teacher", "student"], default: "student" },
    isBlocked:{
      type: Boolean,
      default: false},
  },
  { timestamps: true }
);
userSchema.pre('save',async function(next){
  if (!this.isModified('password')) {
      return next(); 
  }
  const salt = await bcrypt.genSaltSync(10);
  this.password = await bcrypt.hash(this.password,salt)
  next()
})
userSchema.methods.isPasswordMatched = async function(enteredPassword){
  return await bcrypt.compare(enteredPassword, this.password)
}
userSchema.methods.createPasswordResetToken=async function(){
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordChangedAt.passwordResetToken=crypto
  .createHash('sha256')
  .update(resetToken)
  .digest("hex")
  this.passwordChangedAt.passwordResetExpires=Date.now()+30*60*1000 //10p

  console.log("user ",  this.passwordResetToken)
  
  return resetToken
}
module.exports = mongoose.model("User", userSchema);
