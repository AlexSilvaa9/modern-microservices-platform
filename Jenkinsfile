pipeline {
    agent any

    environment {
        // Variable para controlar si hubo algun cambio que requiera e2e
        RUN_E2E = 'false'
    }

    stages {
        stage('Determine Changes') {
            steps {
                script {
                    // Asumimos que podemos obtener los archivos modificados en el último commit o PR.
                    // Ajustar este comando dependiendo de si se usa pull requests, merge a main, etc.
                    def gitDiffOutput = sh(script: 'git diff --name-only HEAD~1 HEAD || true', returnStdout: true).trim()
                    
                    if (gitDiffOutput == "") {
                        echo "No se encontraron cambios o no se pudo ejecutar git diff."
                        return
                    }

                    def changedFiles = gitDiffOutput.split('\n')
                    
                    // Lógica para detectar qué microservicios se han modificado
                    env.BUILD_CART    = changedFiles.any { it.startsWith('backend/services/cart-service/') || it.startsWith('backend/core/') || it.startsWith('k8s/cart-service') }
                    env.BUILD_MAIL    = changedFiles.any { it.startsWith('backend/services/mail-service/') || it.startsWith('backend/core/') || it.startsWith('k8s/mail-service') }
                    env.BUILD_ORDER   = changedFiles.any { it.startsWith('backend/services/order-service/') || it.startsWith('backend/core/') || it.startsWith('k8s/order-service') }
                    env.BUILD_PRODUCT = changedFiles.any { it.startsWith('backend/services/product-service/') || it.startsWith('backend/core/') || it.startsWith('k8s/product-service') }
                    env.BUILD_USER    = changedFiles.any { it.startsWith('backend/services/user-service/') || it.startsWith('backend/core/') || it.startsWith('k8s/user-service') }
                    env.BUILD_FRONTEND = changedFiles.any { it.startsWith('frontend/') }
                    env.BUILD_TERRAFORM = changedFiles.any { it.startsWith('terraform/') }

                    if (env.BUILD_CART == 'true' || env.BUILD_MAIL == 'true' || env.BUILD_ORDER == 'true' || env.BUILD_PRODUCT == 'true' || env.BUILD_USER == 'true' || env.BUILD_FRONTEND == 'true') {
                        env.RUN_E2E = 'true'
                    }

                    echo "Changes detected:"
                    echo "Cart: ${env.BUILD_CART}"
                    echo "Mail: ${env.BUILD_MAIL}"
                    echo "Order: ${env.BUILD_ORDER}"
                    echo "Product: ${env.BUILD_PRODUCT}"
                    echo "User: ${env.BUILD_USER}"
                    echo "Frontend: ${env.BUILD_FRONTEND}"
                    echo "Terraform: ${env.BUILD_TERRAFORM}"
                }
            }
        }

        stage('Deploy Infrastructure (Terraform)') {
            when {
                expression { env.BUILD_TERRAFORM == 'true' }
            }
            steps {
                echo "Cambios en infraestructura detectados. Ejecutando pipeline de Terraform..."
                build job: 'terraform-pipeline', propagate: true, wait: true
            }
        }

        stage('Deploy Modified Services (Parallel)') {
            steps {
                script {
                    def jobs = [:]

                    if (env.BUILD_CART == 'true') {
                        jobs['cart-service'] = {
                            build job: 'cart-service-pipeline', propagate: true, wait: true
                        }
                    }
                    if (env.BUILD_MAIL == 'true') {
                        jobs['mail-service'] = {
                            build job: 'mail-service-pipeline', propagate: true, wait: true
                        }
                    }
                    if (env.BUILD_ORDER == 'true') {
                        jobs['order-service'] = {
                            build job: 'order-service-pipeline', propagate: true, wait: true
                        }
                    }
                    if (env.BUILD_PRODUCT == 'true') {
                        jobs['product-service'] = {
                            build job: 'product-service-pipeline', propagate: true, wait: true
                        }
                    }
                    if (env.BUILD_USER == 'true') {
                        jobs['user-service'] = {
                            build job: 'user-service-pipeline', propagate: true, wait: true
                        }
                    }
                    if (env.BUILD_FRONTEND == 'true') {
                        jobs['frontend'] = {
                            build job: 'frontend-pipeline', propagate: true, wait: true
                        }
                    }

                    if (jobs.size() > 0) {
                        parallel jobs
                    } else {
                        echo "No hay servicios para desplegar según los cambios del commit."
                    }
                }
            }
        }

        stage('Run E2E Tests') {
            when {
                expression { env.RUN_E2E == 'true' }
            }
            steps {
                echo "Ejecutando pruebas End-to-End después de un despliegue exitoso..."
                // Llamamos a un pipeline dedicado a correr las pruebas E2E en Playwright
                build job: 'e2e-tests-pipeline', propagate: true, wait: true
            }
        }
    }

    post {
        always {
            echo "Pipeline Orquestador Finalizado."
        }
        failure {
            echo "Hubo un fallo en la orquestación, despliegue o en las pruebas E2E."
            // mail to: 'admin@empresa.com', subject: 'Fallo en Pipeline Orquestador'
        }
    }
}
