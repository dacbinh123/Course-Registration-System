const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 3030;
const dbConnect = require('./config/dbConnect');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const methodOverride = require('method-override');
const session = require('express-session');
const multer = require('multer');

// Kết nối DB
dbConnect();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(methodOverride('_method'));
app.use(express.json());
app.use(multer().none()); // xử lý formData từ fetch

// Cấu hình express-session
app.use(session({
  secret: process.env.SESSION_SECRET || 'yourSecretKey',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // false nếu không dùng HTTPS
}));

// Cấu hình Handlebars
const hbs = exphbs.create({
  extname: 'hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/partials'),
  helpers: {
    eq: (a, b) => a === b,
  },
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Serve uploads folder (đảm bảo bạn có thư mục này)
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Routes
const homeRoutes = require('./route/homeRoute');
const authRoutes = require('./route/authRoute');
const courseRoutes = require('./route/courseRoute');
const enrollmentRoutes = require('./route/enrollmentRoute');


app.use('/', homeRoutes);
app.use('/', authRoutes);
app.use('/course', courseRoutes);
app.use("/enrollment", enrollmentRoutes);

// Khởi động server
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
