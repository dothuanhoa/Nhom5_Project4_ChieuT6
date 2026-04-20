# ===== BUILD STAGE =====
FROM maven:3.9.6-eclipse-temurin-21 AS build

WORKDIR /app

# copy toàn bộ project
COPY . .

# build jar
RUN mvn clean package -DskipTests


# ===== RUN STAGE =====
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# copy jar đã build
COPY --from=build /app/target/*jar-with-dependencies.jar app.jar

EXPOSE 8080

CMD ["java", "-jar", "app.jar"]
