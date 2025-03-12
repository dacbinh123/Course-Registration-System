
# Course Registration System

## 📚 Project Overview
The **Course Registration System** is a web-based application built with **Node.js**, **Express.js**, **MongoDB**, and **Handlebars**. It allows users to register for courses, manage their profiles, and process QR code-based payments.

## 🚀 Features
- **User Authentication & Authorization**
  - Register, login, and logout
  - Role-based access: Admin, Teacher, Student
- **Course Management**
  - Admin can create, update, and delete courses
  - Assign teachers to courses
- **Course Registration**
  - Students can browse and register for courses
  - Status tracking: Pending, Confirmed (after payment)
- **Payment Integration**
  - QR code-based payment simulation
  - Update registration status after payment confirmation
- **User Profile**
  - View and update personal information
  - Check registration history
- **Admin Dashboard**
  - View course list, student registrations, and payment statuses

## 🛠️ Technologies Used
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication:** JWT, bcrypt
- **Payment Integration:** QR code
- **Template Engine:** Handlebars
- **Architecture:** MVC (Model-View-Controller)
- **Environment Variables:** dotenv
- **API Testing:** Postman
- **Version Control:** Git, GitHub

## 🔧 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/dacbinh123/Course-Registration-System.git
   ```

2. **Navigate to the project directory:**
   ```bash
   cd Course-Registration-System
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Set up environment variables:**
   - Create a `.env` file in the root directory
   - Add the following variables:
   ```plaintext
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   QR_CODE_API=your_qr_code_api
   ```

5. **Start the server:**
   ```bash
   npm start
   ```

The app will run at `http://localhost:3000`

## 📡 API Endpoints

### Authentication
- **POST** `/api/auth/register` — Register a new user
- **POST** `/api/auth/login` — Login and get JWT token

### Courses
- **GET** `/api/courses` — Get all courses
- **POST** `/api/courses` — Add a new course (Admin only)
- **PUT** `/api/courses/:id` — Update a course (Admin only)
- **DELETE** `/api/courses/:id` — Delete a course (Admin only)

### Registration
- **POST** `/api/register` — Register for a course
- **GET** `/api/registrations` — View all registrations (Admin only)
- **PUT** `/api/registrations/:id/confirm` — Confirm payment status

## 🧪 Testing
You can test the API using **Postman**:
1. Import the API routes into Postman.
2. Set the `Authorization` header to `Bearer <your_token>` for protected routes.

## ✨ Contribution
Contributions are welcome! If you want to enhance the project, please fork the repository and submit a pull request.

## 📄 License
This project is licensed under the MIT License.

---

**Author:** [dacbinh123](https://github.com/dacbinh123)

Feel free to suggest improvements or report bugs by opening an issue! 🚀
