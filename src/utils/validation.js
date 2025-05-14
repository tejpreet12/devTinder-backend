const validator = require("validator");

const validateSignUpData = (req) => {
    const { firstName, lastName, emailId, password } = req.body;

    if (!firstName || !lastName) {
        throw new Error("Invaild name");
    } else if (!validator.isEmail(emailId)) {
        throw new Error("Invaid email address");
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("Not strong password")
    }
}

module.exports = {
    validateSignUpData
}