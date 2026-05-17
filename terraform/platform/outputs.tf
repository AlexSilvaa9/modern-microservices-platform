output "frontend_bucket_name" {
  description = "S3 bucket hosting frontend static assets."
  value       = aws_s3_bucket.frontend.bucket
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID for frontend."
  value       = aws_cloudfront_distribution.frontend.id
}

output "cloudfront_domain_name" {
  description = "CloudFront distribution domain name."
  value       = aws_cloudfront_distribution.frontend.domain_name
}

output "frontend_url" {
  description = "Primary frontend URL."
  value       = "https://${var.domain_name}"
}

output "k8s_base_manifests_applied" {
  description = "Count of non-Kafka Kubernetes manifests applied by Terraform."
  value       = length(kubectl_manifest.k8s_base)
}

output "k8s_kafka_manifests_applied" {
  description = "Count of Kafka-related Kubernetes manifests applied by Terraform."
  value       = length(kubectl_manifest.k8s_kafka)
}
