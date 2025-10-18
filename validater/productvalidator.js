const validator = require("validator");
// const chalk = require('chalk')
function validateproduct(data) {
  const fields = ["name",  "description","price", "stock", "category"];

  const isA = fields.every((k) => Object.keys(data).includes(k));
  try {
    if (!isA) {
      throw new Error("all field must be ok ");
    }
  } catch (err) {
    throw err; // keeps the specific error
  }
}

module.exports = validateproduct;
