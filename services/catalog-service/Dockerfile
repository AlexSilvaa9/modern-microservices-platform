FROM eclipse-temurin:17-jre-focal
ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} /app/catalog-service-1.0.0.jar
ENTRYPOINT ["java","-jar","/app/catalog-service-1.0.0.jar"]
