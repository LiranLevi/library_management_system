install mongodb driver on your environment
Note: mongodb transactions should version 4 or higher.

install dependecies:

npm init -y
npm install

OR install run the following commands:

npm install express mongoose bcryptjs jsonwebtoken dotenv
npm install --save-dev jest supertest


make JWT secret key:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

make a .env file with the following fieldes:
PORT=5000
MONGODB_URI=mongodb://localhost:27017/librarydb
JWT_SECRET=your_jwt_secret