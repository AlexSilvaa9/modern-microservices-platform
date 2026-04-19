# Microservices Platform

Este proyecto es una **aplicación de prueba basada en microservicios**, cuyo objetivo principal no es la complejidad del dominio de negocio, sino la **aplicación de buenas prácticas de desarrollo**, el uso de un **stack tecnológico moderno** y el **diseño de un proceso de despliegue profesional**.

El dominio funcional es deliberadamente sencillo (un **catálogo y carrito de compra básico**), permitiendo centrar el esfuerzo en la arquitectura, la calidad del código, la seguridad, la escalabilidad y el despliegue en entornos cloud.


<p align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/3/39/Kubernetes_logo_without_workmark.svg" alt="Kubernetes" width="120" />
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="https://logo.svgcdn.com/logos/aws.png" alt="AWS" width="120" />
</p>

---

## Tecnologías principales

* **Java 17 + Spring Boot**
* **Spring Cloud** (Config, Discovery, Gateway)
* Arquitectura de seguridad personalizada basada en **Spring Security**. Autenticación híbrida base de datos + google. 
* **Arquitectura de microservicios**
* **Comunicación síncrona y asíncrona** (REST + mensajería)

---

## Roadmap Cloud & DevOps

* **Docker**: contenedorización de cada microservicio
* **Kubernetes**: orquestación y escalado

  * Sustitución de los servicios de infraestructura por **componentes nativos de Kubernetes**
  * ConfigMaps, Secrets, Services e Ingress
* **AWS**:

  * **Load Balancer (ALB)** como punto de entrada
  * EKS para Kubernetes
* **Jenkins**: integración y despliegue continuo (CI/CD)
* **Mensajería**: RabbitMQ para colas

---

## Arquitectura objetivo

La plataforma evolucionará hacia una arquitectura donde Kubernetes gestione el ciclo de vida de los servicios, AWS proporcione la infraestructura cloud y balanceo de carga, y Jenkins automatice todo el proceso de despliegue.

---

## Estado del proyecto

🚧 En desarrollo. Diseñado para crecer progresivamente hasta un entorno productivo basado en **Kubernetes, AWS y prácticas DevOps**.

---

## Conclusión

Este proyecto sirve como **base moderna y profesional para sistemas distribuidos**, aplicando tecnologías y patrones utilizados en entornos reales de producción.
