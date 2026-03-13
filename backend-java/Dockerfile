# Stage 1: Build file JAR bằng Gradle Wrapper (Java 21)
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /workspace

# Copy toàn bộ code vào
COPY . .

# Build ra file jar
RUN chmod +x ./gradlew
RUN ./gradlew :app:jar --no-daemon

# Stage 2: Môi trường chạy JRE (Java 21)
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Lấy file jar đã build sang
COPY --from=builder /workspace/app/build/libs/*.jar app.jar

EXPOSE 8080
CMD ["java", "-jar", "app.jar"]