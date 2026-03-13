# ==========================================
# Giai đoạn 1: Build ứng dụng (Build Stage)
# ==========================================
FROM eclipse-temurin:21-jdk-alpine AS builder

# Đặt thư mục làm việc trong container
WORKDIR /app

# Copy các file cấu hình gradle vào trước để tận dụng Docker cache
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle . 

# Cấp quyền thực thi cho file gradlew
RUN chmod +x ./gradlew

# Tải trước các dependencies để cache (nếu có lỗi ở bước này, có thể bỏ qua)
RUN ./gradlew dependencies --no-daemon || true

# Copy toàn bộ source code vào container
COPY src src

# Build ra file .jar (bỏ qua chạy test để deploy nhanh hơn)
RUN ./gradlew bootJar -x test --no-daemon

# ==========================================
# Giai đoạn 2: Chạy ứng dụng (Run Stage)
# ==========================================
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copy file .jar đã được build từ giai đoạn 1 sang
COPY --from=builder /app/build/libs/*.jar app.jar

# Expose port (Render thường tự động nhận diện, nhưng mặc định Spring Boot là 8080)
EXPOSE 8080

# Chạy ứng dụng Spring Boot
ENTRYPOINT ["java", "-jar", "app.jar"]