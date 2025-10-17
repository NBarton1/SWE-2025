FROM gradle:9-jdk21-alpine AS build
WORKDIR /usr/app/
COPY . .
RUN gradle build || return true

# ---- Runtime stage ----
FROM eclipse-temurin:21-jre-alpine

# Create app user and group
RUN addgroup -S spring && adduser -S spring -G spring
COPY --from=build usr/app/build/libs/*.jar app.jar
USER spring
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
