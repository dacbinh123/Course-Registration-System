
const Course = require('../model/courseModel');
const User = require('../model/userModel');
const Enrollment = require('../model/enrollmentModel');
const QRCode = require('qrcode');
const mongoose = require('mongoose');

const enrollmentController = {
    enrollCourse: async (req, res) => {
        const { userId, courseId } = req.body;
        try {
          console.log('📩 Dữ liệu nhận từ form:', { userId, courseId });
      
          const course = await Course.findById(courseId);
          const user = await User.findById(userId);
      
          console.log('🔍 Kiểm tra khóa học:', course);
          console.log('🔍 Kiểm tra người dùng:', user);
      
          if (!course || !user) {
            return res.status(404).json({ message: 'Không tìm thấy khóa học hoặc người dùng' });
          }
      
          const existingEnrollment = await Enrollment.findOne({ 
            userId: new mongoose.Types.ObjectId(userId), 
            courseId: new mongoose.Types.ObjectId(courseId) 
          });
                console.log('📚 Đăng ký đã tồn tại:', existingEnrollment);
      
          if (existingEnrollment) {
            return res.status(400).json({ message: 'Bạn đã đăng ký khóa học này rồi!' });
          }
      
          const newEnrollment = new Enrollment({
            userId,
            courseId,
            paymentStatus: 'pending',
          });
      
          await newEnrollment.save();
          console.log('✅ Đăng ký mới đã được lưu:', newEnrollment);
      
          res.redirect(`/enrollment/payment?userId=${userId}&courseId=${courseId}`);
        } catch (error) {
          console.error('❌ Lỗi khi đăng ký khóa học:', error.message);
          res.status(500).json({ message: 'Lỗi đăng ký khóa học: ' + error.message });
        }
      },
      
  
    generateQRPage: async (req, res) => {
      const { userId, courseId } = req.query;
      try {
        const course = await Course.findById(courseId).lean();
        const user = await User.findById(userId).lean();
        if (!course || !user) {
          return res.status(404).send('Không tìm thấy khóa học hoặc người dùng');
        }
  
        const paymentInfo = JSON.stringify({ userId, courseId, amount: course.price });
        const qrCode = await QRCode.toDataURL(paymentInfo);
  
        res.render('payment', { qrCode, user, course });
      } catch (error) {
        res.status(500).send('Lỗi tạo trang QR: ' + error.message);
      }
    },
  
    confirmPayment : async (req, res) => {
        const { userId, courseId } = req.body;
      
        console.log('🔑 Dữ liệu nhận từ form xác nhận:', { userId, courseId });
      
        if (!userId || !courseId) {
          return res.status(400).json({ message: 'Thiếu userId hoặc courseId!' });
        }
      
        try {
          // Kiểm tra xem user và course có tồn tại không
          const user = await User.findById(userId);
          const course = await Course.findById(courseId);
      
          if (!user || !course) {
            return res.status(404).json({ message: 'User hoặc Course không tồn tại!' });
          }
      
          // Kiểm tra xem đã đăng ký chưa
          let enrollment = await Enrollment.findOne({ userId, courseId });
      
          if (!enrollment) {
            // Nếu chưa có, tạo mới
            enrollment = new Enrollment({
              userId,
              courseId,
              paymentStatus: 'completed',
            });
          } else {
            // Nếu đã có, cập nhật trạng thái thanh toán
            enrollment.paymentStatus = 'completed';
          }
      
          await enrollment.save();
      
          res.redirect(`/course/detail-course/${courseId}`);
        } catch (error) {
          console.error('❌ Lỗi khi xác nhận thanh toán:', error.message);
          res.status(500).json({ message: 'Lỗi xác nhận thanh toán: ' + error.message });
        }
      }
  };
  
  
module.exports = enrollmentController;