const{default: mongoose} = require('mongoose')
const dbConnect = () => {
    try {
        const connect = mongoose.connect(process.env.MONGODB_URL)
        console.log("connect db success")
    } catch (error) {
        console.log("connect fail")
    }
}
module.exports = dbConnect