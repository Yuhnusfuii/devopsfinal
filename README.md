# Food Landing Project

Dự án này là một web app (Landing Page) được thiết kế với:
- **Frontend**: ReactJS (Vite)
- **Backend**: Golang (REST API) + PostgreSQL
- **CI/CD**: GitHub Actions
- **Deployment**: AWS EC2

## Cấu trúc thư mục

- `frontend/`: Chứa mã nguồn ReactJS.
- `backend/`: Chứa mã nguồn Golang REST API và cấu hình Docker PostgreSQL.
- `.github/workflows/`: Chứa các cấu hình CI/CD để tự động deploy lên AWS EC2.

## Chạy dự án

### 1. Backend Database (PostgreSQL)
Chạy Database cục bộ thông qua Docker (cổng 5433 để tránh xung đột):
```bash
cd backend
docker compose up -d
```
Database sẽ tự động tạo bảng `dishes` và dữ liệu mẫu.

### 2. Backend Server (Golang)
Chạy server Go với cấu hình kết nối tới cổng 5433:
```bash
cd backend
$env:DATABASE_URL="postgres://admin:admin123@localhost:5433/fooddb?sslmode=disable"
go run main.go
```

### 3. Frontend (ReactJS)
Chạy website ở môi trường development:
```bash
cd frontend
npm run dev
```
