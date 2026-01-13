import bcrypt from 'bcrypt';

const hash = await bcrypt.hash('azerty123', 10);
console.log(hash);