# Hướng Dẫn Deploy Notes Web App lên Vercel

Hướng dẫn chi tiết để deploy ứng dụng Notes lên Vercel với MongoDB Atlas.

## 📋 Yêu cầu trước khi bắt đầu

- Tài khoản GitHub
- Tài khoản Vercel (có thể đăng ký miễn phí tại [vercel.com](https://vercel.com))
- Tài khoản MongoDB Atlas (miễn phí tại [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas))

---

## 🗄️ Bước 1: Setup MongoDB Atlas

### 1.1. Tạo tài khoản và Cluster

1. Truy cập https://www.mongodb.com/cloud/atlas/register
2. Đăng ký tài khoản miễn phí
3. Chọn **"Create a New Cluster"**
4. Chọn **FREE tier (M0)** - không tốn phí
5. Chọn region gần nhất (ví dụ: Singapore)
6. Click **"Create Cluster"** (chờ 3-5 phút để cluster được tạo)

### 1.2. Cấu hình Database Access

1. Vào menu **"Database Access"** (bên trái)
2. Click **"Add New Database User"**
3. Chọn **"Password"** authentication method
4. Nhập:
   - Username: `notesapp` (hoặc tên bất kỳ)
   - Password: Tạo mật khẩu mạnh và **LƯU LẠI** (sẽ dùng ở bước sau)
5. Database User Privileges: Chọn **"Read and write to any database"**
6. Click **"Add User"**

### 1.3. Cấu hình Network Access

1. Vào menu **"Network Access"** (bên trái)
2. Click **"Add IP Address"**
3. Click **"Allow Access From Anywhere"** (IP: `0.0.0.0/0`)
   - ⚠️ Điều này cho phép Vercel kết nối đến database
4. Click **"Confirm"**

### 1.4. Lấy Connection String

1. Vào menu **"Database"**
2. Click nút **"Connect"** trên cluster của bạn
3. Chọn **"Connect your application"**
4. Chọn Driver: **Node.js**, Version: **5.5 or later**
5. Copy **Connection String**, nó sẽ có dạng:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. **Thay thế `<password>`** bằng password bạn đã tạo ở bước 1.2
7. **Thêm database name** `notesdb` vào giữa `.net/` và `?`:
   ```
   mongodb+srv://notesapp:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/notesdb?retryWrites=true&w=majority
   ```
8. **LƯU LẠI** connection string này!

---

## 🚀 Bước 2: Deploy lên Vercel

### 2.1. Push code lên GitHub

```bash
# Initialize git (nếu chưa có)
git init

# Add all files
git add .

# Commit
git commit -m "Prepare for Vercel deployment"

# Tạo repository trên GitHub và push
git remote add origin https://github.com/YOUR_USERNAME/notes-web.git
git branch -M main
git push -u origin main
```

### 2.2. Import vào Vercel

1. Truy cập https://vercel.com
2. Đăng nhập (hoặc đăng ký bằng GitHub account)
3. Click **"Add New Project"**
4. Click **"Import Git Repository"**
5. Chọn repository `notes-web` từ GitHub
6. Click **"Import"**

### 2.3. Cấu hình Environment Variables

**Quan trọng:** Trước khi deploy, cần thêm environment variables:

1. Trong trang Import Project, mở rộng **"Environment Variables"**
2. Thêm 2 biến sau:

   **Biến 1:**
   - Name: `MONGODB_URI`
   - Value: Connection string từ MongoDB Atlas (bước 1.4)
   ```
   mongodb+srv://notesapp:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/notesdb?retryWrites=true&w=majority
   ```

   **Biến 2:**
   - Name: `JWT_SECRET`
   - Value: Một secret key bất kỳ (khuyến nghị dài và phức tạp)
   ```
   my_super_secret_jwt_key_2024_xyz
   ```

3. Click **"Deploy"**

### 2.4. Chờ Deploy hoàn thành

- Vercel sẽ build và deploy tự động (khoảng 1-2 phút)
- Sau khi hoàn thành, bạn sẽ nhận được URL dạng: `https://notes-web-xxx.vercel.app`

---

## ✅ Bước 3: Test ứng dụng

### 3.1. Test Static Files

Truy cập URL Vercel của bạn, ví dụ: `https://notes-web-xxx.vercel.app`

- Trang đăng nhập/đăng ký hiển thị đúng ✓
- CSS và JavaScript load thành công ✓

### 3.2. Test API Endpoints

**Test đăng ký:**

```bash
curl https://notes-web-xxx.vercel.app/api/auth/register \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@test.com","password":"123456"}'
```

**Test đăng nhập:**

```bash
curl https://notes-web-xxx.vercel.app/api/auth/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'
```

### 3.3. Test trực tiếp trên website

1. Mở `https://notes-web-xxx.vercel.app`
2. Đăng ký tài khoản mới
3. Đăng nhập
4. Tạo note mới
5. Edit note
6. Share note (copy link và thử mở trong incognito)
7. Delete note

---

## 🔧 Troubleshooting

### Lỗi: "FUNCTION_INVOCATION_FAILED"

**Nguyên nhân:** Environment variables chưa được cấu hình đúng

**Giải pháp:**
1. Vào Vercel Dashboard → Project Settings → Environment Variables
2. Kiểm tra `MONGODB_URI` và `JWT_SECRET` đã được thêm chưa
3. Redeploy: Deployments → ... → Redeploy

### Lỗi: "MongoDB connection error"

**Nguyên nhân:** Connection string sai hoặc IP chưa được whitelist

**Giải pháp:**
1. Kiểm tra lại connection string trong Vercel Environment Variables
2. Đảm bảo đã thay `<password>` bằng password thật
3. Kiểm tra Network Access trên MongoDB Atlas có `0.0.0.0/0`

### Static files không load

**Nguyên nhân:** Routing configuration sai

**Giải pháp:**
1. Kiểm tra file `vercel.json` có đúng cấu trúc
2. Đảm bảo tất cả file static nằm trong thư mục `public/`

---

## 🔄 Update ứng dụng

Mỗi khi bạn thay đổi code:

```bash
git add .
git commit -m "Update features"
git push
```

Vercel sẽ tự động deploy phiên bản mới!

---

## 🌐 Custom Domain (Optional)

Để dùng domain riêng thay vì `.vercel.app`:

1. Vào Project Settings → Domains
2. Add domain của bạn
3. Cấu hình DNS theo hướng dẫn của Vercel

---

## 📝 Local Development

Để tiếp tục develop local:

```bash
# Copy environment variables template
cp .env.example .env

# Sửa .env với MongoDB local hoặc Atlas connection
# MONGODB_URI=mongodb://127.0.0.1:27017/notesdb (local)
# hoặc
# MONGODB_URI=mongodb+srv://... (Atlas - để test giống production)

# Start server
npm run dev
```

---

## 🎉 Hoàn thành!

Ứng dụng Notes của bạn giờ đã chạy trên Vercel với MongoDB Atlas! 

**Production URL:** `https://notes-web-xxx.vercel.app`

Nếu gặp vấn đề, kiểm tra Vercel logs tại: Project → Deployments → Click vào deployment mới nhất → View Function Logs
