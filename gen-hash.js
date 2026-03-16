const bcrypt = require('bcryptjs');
const password = 'agrolink123';
bcrypt.hash(password, 10, (err, hash) => {
    console.log(hash);
});
