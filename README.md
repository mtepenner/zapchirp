# ZapChirp ⚡💬

## Description
ZapChirp is a comprehensive full-stack real-time chat application built on the MERN stack (MongoDB, Express.js, React, Node.js) and powered by Socket.io. It provides a seamless communication platform allowing users to securely register, manage their contacts, and engage in both one-on-one direct messaging and collaborative group chats.

## Table of Contents
- [Features](#features-)
- [Technologies Used](#technologies-used-)
- [Installation](#installation-)
- [Usage](#usage-)
- [Contributing](#contributing-)
  
## Features 🚀
- **Real-Time Messaging:** Instant bidirectional communication leveraging Socket.io.
- **Direct & Group Chats:** Create private 1-on-1 conversations or dedicated group chats for multiple participants.
- **Secure Authentication:** Robust user registration and login system protected by JSON Web Tokens (JWT) and `bcryptjs` password hashing.
- **Contact Management:** Search, add, and manage your network of contacts directly within the platform.
- **Persistent Storage:** All users, messages, and conversation histories are securely stored in a MongoDB database.

## Technologies Used 💻
- **Frontend:** React.js
- **Backend:** Node.js, Express.js
- **Real-Time Engine:** Socket.io
- **Database:** MongoDB, Mongoose ORM
- **Security & Authentication:** JWT (JSON Web Tokens), bcryptjs, CORS

## Installation 🛠️

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mtepenner/zapchirp.git
   cd zapchirp
   ```

2. **Install Backend Dependencies:**
   ```bash
   cd Backend
   npm install
   ```

3. **Install Frontend Dependencies:**
   ```bash
   cd ../Frontend
   npm install
   ```

4. **Environment Configuration:**
   Create a `.env` file in the `Backend` directory and define the following environment variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secure_jwt_secret
   ```

## Usage 💡

1. **Start the Backend Server:**
   From the `Backend` directory, run:
   ```bash
   npm run start
   # or 'npm run dev' if nodemon is configured
   ```

2. **Start the Frontend Client:**
   Open a new terminal, navigate to the `Frontend` directory, and run:
   ```bash
   npm start
   ```

3. **Access the Application:**
   Open your browser and navigate to `http://localhost:3000` to create an account and start chatting.

## Contributing 🤝
Contributions make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License 📄
Distributed under the MIT License. See `LICENSE` for more information.
