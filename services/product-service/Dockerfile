FROM eclipse-temurin:17-jre-focal
ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} /app/product-service-1.0.0.jar
ENTRYPOINT ["java","-jar","/app/product-service-1.0.0.jar"]
