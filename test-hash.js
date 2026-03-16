const bcrypt = require('bcryptjs');

const password = 'agrolink123';
const hash = '$2b$10$EixZAYVK1VzKNzQbBZguHeqpZtHGW.6A23.K4.f0sC6X0bB1Q6t2q';

bcrypt.compare(password, hash, (err, res) => {
    console.log('Match:', res);
});
