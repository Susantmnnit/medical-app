const User = require("../model/userschema");

const isValidStudentId = async function (_id) {
  const existingUser = await User.findById(_id);
  if (existingUser) return true;
  else return false;
};

const isVerifiedStudentId = async function (id) {
  let existingUser = await User.findOne({ _id: id });
  if (existingUser && existingUser.verified == true) {
    return true;
  } else {
    return false;
  }
};

module.exports = { isValidStudentId, isVerifiedStudentId };
