const validator = require("validator");
// const chalk = require('chalk')
function validateUser(data) {
  const fields = [
    "name",
    "email",
    "gender",
    "password",
    "city",
    "answer"
    // "profilepic",
  ];

  const isA = fields.every((k) => Object.keys(data).includes(k));
try {
  if (!isA) {
    throw new Error("all field must be ok ");
  }

  if (!validator.isEmail(data.email)) 
    {
        throw new Error("email format is not ok ");
    }

  if (!validator.isStrongPassword(data.password)){
    throw new Error("the password is not strong ");
  }


if(!(data.name.length >=3 && data.name.length<=20))
    {
        throw new Error("Make sure to enter name length between 3 and 10 digit")
    }
}
catch(err){
    throw err; // keeps the specific error
}

}

module.exports = validateUser;
