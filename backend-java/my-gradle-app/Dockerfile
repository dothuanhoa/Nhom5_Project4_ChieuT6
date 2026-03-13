# Stage 1: Build file JAR bằng Gradle Wrapper (không cần cài Gradle trên Render)
FROM eclipse-temurin:17-jdk-alpine AS builder
WORKDIR /workspace

# Copy toàn bộ code vào
COPY . .

# Cấp quyền cho gradlew và tiến hành build riêng thư mục 'app'
RUN chmod +x ./gradlew
RUN ./gradlew :app:jar --no-daemon

# Stage 2: Chạy ứng dụng bằng JRE siêu nhẹ
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Lấy file jar đã build ở Stage 1 sang Stage 2
COPY --from=builder /workspace/app/build/libs/*.jar app.jar

# Render sẽ cấp PORT tự động, nhưng mình cứ EXPOSE 8080 cho an toàn
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]