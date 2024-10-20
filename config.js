const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/librarydb',
    port: process.env.PORT || 3000,
    jwt_secret_key: process.env.JWT_SECRET_KEY,
    loanDueTimeByStarsMap: { 1: 7, 2: 7, 3: 7, 4: 3, 5: 2 }, //{stars: days}
    maxBooksBorrowedAtaTime: 5,
};
