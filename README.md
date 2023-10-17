# Mobile-app-QUA
- Link driver : https://drive.google.com/file/d/1zNA75z6vbLmH8Ifo78FI0IGo06yr76m-/view?usp=sharing 
- Lnik trên bao gồm 2 file gồm file Client_code dùng ngôn ngữ Java dùng bên android và file ServerDoAnAndroid dùng ngôn ngữ Node.js bên backend.

# Features:
App to do list gồm các chức năng chính như sau:
- Tạo công việc
- Có thời gian coutdown hỗ trợ khi làm việc
- Có lưu trữ thông tin tài khoản riêng
- Có thể xem các bài đăng của bạn bè giúp tạo động lực
- Bên cạnh đó có thể chat với nhau, hỗ trợ nhau trong học tập

Các ngôn ngữ sử dụng:
- Java
- JavaScript

Các phần mềm sử dụng:
- Android Studio: Lập trình bên phía frontend
- VS Code: Lập trình bên phía backend
- Postman: Kiểm tra API
- MongoDB Compass: Là một desktop app chứa các thông tin trong database
- MongoDB Atlas Cloud Database: Cloud database của MongoDB
- Figma: Tool dùng để thiết kế UI
- Draw.io: Một trang web dùng để vẽ use case

Giới thiệu về các công nghệ sử dụng:
- Sử dụng Java để lập trình mobile trên Android studio
- Sử dụng Node.js để lập trình backend ở VS Code
- Lưu trữ dữ liệu trên MongoDB Atlas Cloud

Cài đặt:
- Tải file ở link driver trên cho 2 file Client và Server hoặc dùng git để clone file server (gồm các thư mục đang lưu ở branch master)

Set up:
- Cài đặt MongoDB Compass:
    - Truy cập vào link https://account.mongodb.com/account và đăng nhập( username: louisnguyen012z@gmail.com; password: Nguyenducanh12)
    - Vào tab Network Access > Click "Add IP address" > Thêm địa chỉ wifi máy bạn > Confirm > Chờ đến khi active
    - Vào tab Database Access > Click "Add new database user" > Thêm tên và pass của bạn
    - Vào tab Databases > Click "Connect" > Click "Connect your application" > Copy đường dẫn, sửa username, password> Vào app.js, paste vào trong mongoose.connect()
    - Vào tab Databases > Click "Connect" > Click "Connect using MongoDB Compass" > Copy đường dẫn, sửa username và password > Vào MongoDB Compass > Click vao tab "Connect" > Click "Connect to" > Paste vào ô "Paste your connection string" > CLick "Connect" > Chọn androidProject
- Cài đặt server:
    - Giải nén Server_code.rar và mở file bằng visual code
    - Termial > New termial
    - Dùng câu lệnh `npm install` để install các thư viện của nodejs sau đó dùng câu lệnh `npm start`
- Cài đặt client:
    - Giải nén Client_code.rar và mở bằng Android Studio.
    - Thêm đường dẫn JDK, Gradle 7.0 và "Sync project with gradle"
    - Vào MyApplication.java > Sửa BASE_URL từ 192.168.1.9 thành địa chỉ wifi của máy bạn.
    - Click "Run"
