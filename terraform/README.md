# Terraform - Microservices Template

Este directorio contiene dos stacks Terraform:

- `bootstrap/`: crea infraestructura para estado remoto de Terraform (S3 + DynamoDB lock).
- `platform/`: despliega Kubernetes local (manifiestos `k8s/`) y frontend en AWS (S3 + CloudFront + Route53 + ACM).

## 1) Bootstrap del estado remoto

```bash
cd terraform/bootstrap
terraform init
terraform apply -var="state_bucket_name=YOUR_UNIQUE_STATE_BUCKET" -var="lock_table_name=terraform-state-locks"
```

Con los outputs, configura backend remoto en los stacks que quieras:

```hcl
terraform {
  backend "s3" {
    bucket         = "YOUR_UNIQUE_STATE_BUCKET"
    key            = "platform/terraform.tfstate"
    region         = "eu-west-1"
    dynamodb_table = "terraform-state-locks"
    encrypt        = true
  }
}
```

## 2) Stack principal (k8s local + front AWS)

```bash
cd terraform/platform
cp terraform.tfvars.example terraform.tfvars
# editar terraform.tfvars
terraform init
terraform plan
terraform apply
```

## Qué hace el stack platform

- Instala `ingress-nginx` (opcional, por defecto activado).
- Crea namespace `kafka`.
- Instala operador Strimzi (opcional, por defecto activado).
- Aplica manifiestos de `k8s/*.yaml` y `k8s/RBAC/*.yaml`.
- Aplica manifiestos Kafka de `k8s/infra/*.yaml` y `k8s/kafka/*.yaml`.
- Crea bucket S3 privado para frontend.
- Sube los artefactos compilados desde `frontend_dist_dir`.
- Crea CloudFront con OAC.
- Solicita certificado ACM en us-east-1 y valida por DNS.
- Crea registros Route53 A/AAAA para el dominio del front.

## Requisitos

- Terraform >= 1.5
- AWS credentials configuradas (perfil/env vars)
- `kubectl` con acceso a cluster local (kubeconfig)
- Cluster local funcionando (kind/minikube/docker-desktop)
- Front compilado en `frontend/dist/microservices-front/browser` (o ajustar variable)

## Notas

- Los manifiestos de `k8s/secrets.yaml` contienen secretos en claro en el repo. Para producción, migra esos valores a variables/secret manager.
- El stack no crea el cluster local, solo despliega recursos dentro del cluster que ya tengas levantado.
