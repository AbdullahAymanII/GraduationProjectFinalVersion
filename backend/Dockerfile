# Stage 1: Build the application
FROM maven:3.8.5-openjdk-17 AS build

WORKDIR /backend
COPY pom.xml /backend/

# Download dependencies first to speed up future builds
RUN mvn dependency:go-offline

COPY src /backend/src/

# Build the project and skip tests
RUN mvn clean install -DskipTests

# Stage 2: Run the application
FROM openjdk:17-jdk-slim

# Install Docker CLI for running Docker commands from within the container
RUN apt-get update && apt-get install -y docker.io && apt-get clean

# Set working directory
WORKDIR /backend

# Copy the JAR file from the build stage
COPY --from=build /backend/target/backend-0.0.1-SNAPSHOT.jar /backend/backend.jar

# Expose port 8080 for the Spring Boot app
EXPOSE 8080

# Run the Spring Boot app with DevTools enabled
ENTRYPOINT ["java", "-jar", "/backend/backend.jar", "-Dspring.devtools.restart.enabled=true"]
