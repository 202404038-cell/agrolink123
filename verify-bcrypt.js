const bcrypt = require('bcryptjs');
const password = 'agrolink123';
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(password, salt);
console.log('PASSWORD:', password);
console.log('HASH:', hash);
console.log('VERIFY:', bcrypt.compareSync(password, hash));
