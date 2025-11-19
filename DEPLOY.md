# Hướng dẫn Deploy

## Environment Variables cần thiết

Khi deploy, bạn cần cấu hình các biến môi trường sau trong hosting platform (Vercel, Netlify, etc.):

### MongoDB
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

### Cloudinary (Bắt buộc cho upload ảnh)
```
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### JWT Secret (Nếu có sử dụng authentication)
```
JWT_SECRET=your-secret-key
```

## Cấu hình cho các Platform

### Vercel
1. Vào Settings > Environment Variables
2. Thêm tất cả các biến môi trường ở trên
3. Đảm bảo chọn đúng environment (Production, Preview, Development)
4. Redeploy sau khi thêm biến môi trường

**Lưu ý quan trọng:**
- Vercel có body size limit mặc định là 4.5MB cho serverless functions
- Để upload file lớn hơn, cần upgrade plan hoặc sử dụng Vercel Blob Storage
- Timeout mặc định là 10 giây (Hobby plan) hoặc 60 giây (Pro plan)

### Netlify
1. Vào Site settings > Environment variables
2. Thêm các biến môi trường
3. Body size limit mặc định: 6MB
4. Timeout: 10 giây (free) hoặc 26 giây (paid)

### Railway / Render
1. Vào Environment variables
2. Thêm các biến môi trường
3. Body size limit thường cao hơn (50MB+)
4. Timeout có thể cấu hình

## Kiểm tra sau khi deploy

1. **Kiểm tra Environment Variables:**
   - Vào console của hosting platform
   - Xem logs để đảm bảo không có lỗi "Cloudinary configuration missing"

2. **Test Upload:**
   - Thử upload ảnh nhỏ (< 1MB) trước
   - Sau đó thử ảnh lớn hơn
   - Kiểm tra console logs nếu có lỗi

3. **Kiểm tra API:**
   - Test các API endpoints
   - Kiểm tra response time
   - Xem có lỗi timeout không

## Troubleshooting

### Upload không hoạt động
- ✅ Kiểm tra Cloudinary environment variables đã được set chưa
- ✅ Kiểm tra file size có vượt quá limit của platform không
- ✅ Xem logs trong hosting platform để tìm lỗi cụ thể
- ✅ Thử upload file nhỏ hơn (< 1MB) để test

### Lỗi "Invalid JSON response" / "Unexpected token '<'"
**Nguyên nhân:** Server trả về HTML error page thay vì JSON

**Cách khắc phục:**
1. **Kiểm tra Environment Variables:**
   - Vào `/api/upload/test` để kiểm tra Cloudinary config
   - Đảm bảo tất cả 3 biến (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) đã được set
   - **Quan trọng:** Sau khi thêm/sửa env vars, cần **Redeploy** project

2. **Kiểm tra Body Size Limit:**
   - Vercel free: 4.5MB limit
   - Nếu file > 4.5MB, Vercel sẽ trả về error page HTML
   - Giải pháp: Giảm file size hoặc upgrade plan

3. **Kiểm tra Logs:**
   - Vào Vercel Dashboard > Deployments > Function Logs
   - Tìm lỗi cụ thể trong logs
   - Lỗi thường gặp:
     - "Cloudinary configuration missing"
     - "Request entity too large"
     - "Function timeout"

4. **Test API:**
   - Truy cập: `https://your-domain.com/api/upload/test`
   - Kiểm tra response có hiển thị Cloudinary config đúng không

### API chậm
- ✅ Kiểm tra MongoDB connection string
- ✅ Kiểm tra network latency
- ✅ Xem có lỗi timeout trong logs không
- ✅ Kiểm tra database indexes

### Lỗi 413 (Payload Too Large)
- Giảm kích thước file upload
- Hoặc upgrade hosting plan để tăng body size limit
- Vercel Pro plan: 4.5MB → có thể tăng lên

## Tối ưu Performance

1. **Image Optimization:**
   - Sử dụng Next.js Image component
   - Cloudinary tự động optimize ảnh

2. **Database:**
   - Đảm bảo có indexes cho các queries thường dùng
   - Sử dụng connection pooling (đã được implement)

3. **Caching:**
   - API routes đã có cache headers
   - Sử dụng ISR (Incremental Static Regeneration) khi có thể

