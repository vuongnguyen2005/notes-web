# 🚀 Hướng Dẫn Deploy Lên Vercel - Đơn Giản & Nhanh

## ✅ Đã hoàn thành:
- Code đã sẵn sàng deploy
- MongoDB Atlas đã setup xong
- Connection string: `mongodb+srv://vmashup2005_db_user:0375227209vng@cluster0.4ugriu0.mongodb.net/notesdb`

---

## 📝 Bước 1: Push code lên GitHub

### Option A: Nếu bạn chưa có GitHub repository

1. **Tạo repository mới trên GitHub:**
   - Truy cập: https://github.com/new
   - Repository name: `notes-web` (hoặc tên bất kỳ)
   - Chọn **Public** hoặc **Private**
   - **KHÔNG** chọn "Initialize this repository with a README"
   - Click **"Create repository"**

2. **Push code từ máy local:**

```bash
cd /home/vuongnguyen/Notes-web

# Initialize git (nếu chưa có)
git init

# Add all files
git add .

# Commit
git commit -m "Ready for Vercel deployment"

# Add remote (thay YOUR_USERNAME bằng username GitHub của bạn)
git remote add origin https://github.com/YOUR_USERNAME/notes-web.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Option B: Nếu bạn đã có GitHub repository

```bash
cd /home/vuongnguyen/Notes-web
git add .
git commit -m "Ready for Vercel deployment"
git push
```

---

## 🎯 Bước 2: Deploy lên Vercel

### 2.1. Import Project

1. Truy cập: https://vercel.com
2. Click **"Login"** → Chọn **"Continue with GitHub"**
3. Sau khi đăng nhập, click **"Add New..."** → **"Project"**
4. Tìm repository **"notes-web"** trong danh sách
5. Click **"Import"**

### 2.2. Configure Environment Variables (QUAN TRỌNG!)

**Trước khi click Deploy**, bạn cần thêm Environment Variables:

1. Trong trang import project, tìm phần **"Environment Variables"**
2. Click để mở rộng phần này
3. Thêm 2 biến sau:

#### Variable 1: MONGODB_URI
- **Name:** `MONGODB_URI`
- **Value:** 
  ```
  mongodb+srv://vmashup2005_db_user:0375227209vng@cluster0.4ugriu0.mongodb.net/notesdb?appName=Cluster0
  ```

#### Variable 2: JWT_SECRET
- **Name:** `JWT_SECRET`
- **Value:** 
  ```
  super_secret_key_vmashup2005_2024
  ```

### 2.3. Deploy

Sau khi thêm 2 environment variables, click **"Deploy"**

⏱️ Chờ 1-2 phút để Vercel build và deploy...

---

## 🎉 Bước 3: Test ứng dụng

Sau khi deploy xong, Vercel sẽ cho bạn URL dạng:
```
https://notes-web-xxx.vercel.app
```

### Test checklist:
1. ✅ Mở URL → Trang đăng nhập hiển thị đúng
2. ✅ Đăng ký tài khoản mới
3. ✅ Đăng nhập
4. ✅ Tạo note mới
5. ✅ Edit note
6. ✅ Share note
7. ✅ Delete note

---

## 🔧 Nếu gặp lỗi

### Lỗi 500 - Function Invocation Failed

**Nguyên nhân:** Thiếu hoặc sai Environment Variables

**Cách fix:**
1. Vào Vercel Dashboard
2. Click vào project **notes-web**
3. Vào tab **"Settings"** → **"Environment Variables"**
4. Kiểm tra 2 biến `MONGODB_URI` và `JWT_SECRET` đã được thêm chưa
5. Nếu sai, xóa và thêm lại
6. Vào tab **"Deployments"**
7. Click menu (...) ở deployment mới nhất → **"Redeploy"**

### Lỗi MongoDB Connection

**Nguyên nhân:** IP chưa được whitelist

**Cách fix:**
1. Vào MongoDB Atlas: https://cloud.mongodb.com
2. Vào **Network Access** (menu bên trái)
3. Đảm bảo có IP **0.0.0.0/0** trong danh sách
4. Nếu chưa có, click **"Add IP Address"** → **"Allow Access From Anywhere"**

---

## 🔄 Update ứng dụng sau này

Mỗi khi bạn sửa code:

```bash
git add .
git commit -m "Update features"
git push
```

Vercel sẽ tự động deploy lại! 🚀

---

## 📊 Xem Logs

Nếu có lỗi, xem logs tại:
1. Vercel Dashboard → Project → **Deployments**
2. Click vào deployment mới nhất
3. Click **"View Function Logs"**

---

## ✨ Bonus: Custom Domain (Không bắt buộc)

Nếu bạn có domain riêng:
1. Vào Project → **Settings** → **Domains**
2. Thêm domain của bạn
3. Cấu hình DNS theo hướng dẫn

---

**Tóm tắt những gì cần làm:**
1. Push code lên GitHub
2. Import vào Vercel
3. Thêm 2 environment variables (MONGODB_URI và JWT_SECRET)
4. Deploy
5. Test!

Chúc bạn deploy thành công! 🎉
