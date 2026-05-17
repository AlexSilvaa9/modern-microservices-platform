variable "aws_region" {
  description = "Primary AWS region for frontend infrastructure resources."
  type        = string
  default     = "eu-west-1"
}

variable "project_name" {
  description = "Project name used in tags and resource naming."
  type        = string
  default     = "microservices-template"
}

variable "environment" {
  description = "Environment name used in tags and resource naming."
  type        = string
  default     = "prod"
}

variable "frontend_bucket_name" {
  description = "Global-unique bucket name for frontend static files."
  type        = string
}

variable "frontend_dist_dir" {
  description = "Path to the built frontend files to upload to S3."
  type        = string
  default     = "../../frontend/dist/microservices-front/browser"
}

variable "domain_name" {
  description = "Primary public domain name for the frontend (example: app.example.com)."
  type        = string
}

variable "hosted_zone_id" {
  description = "Route53 hosted zone ID that owns domain_name."
  type        = string
}

variable "create_www_record" {
  description = "If true, creates www.domain_name DNS alias to CloudFront."
  type        = bool
  default     = false
}

variable "enable_ingress_nginx" {
  description = "If true, installs ingress-nginx controller in local Kubernetes cluster."
  type        = bool
  default     = true
}

variable "enable_strimzi" {
  description = "If true, installs Strimzi operator in namespace kafka before applying Kafka CRs."
  type        = bool
  default     = true
}

variable "kubeconfig_path" {
  description = "Path to kubeconfig for local Kubernetes cluster."
  type        = string
  default     = "~/.kube/config"
}

variable "k8s_manifest_root" {
  description = "Path to k8s manifests directory to apply with Terraform."
  type        = string
  default     = "../../k8s"
}

variable "tags" {
  description = "Common tags applied to AWS resources."
  type        = map(string)
  default     = {}
}
