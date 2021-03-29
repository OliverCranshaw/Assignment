const bcrypt = require('bcrypt');

exports.hash = function(password) {

    const hashedPassword = bcrypt.hash(password, 10);

    return hashedPassword;


}