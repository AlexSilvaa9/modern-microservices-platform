locals {
  common_tags = merge(var.tags, {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "terraform"
  })

  non_kafka_manifest_files = concat(
    fileset(var.k8s_manifest_root, "*.yaml"),
    fileset(var.k8s_manifest_root, "RBAC/*.yaml")
  )

  kafka_manifest_files = concat(
    fileset(var.k8s_manifest_root, "infra/*.yaml"),
    fileset(var.k8s_manifest_root, "kafka/*.yaml")
  )

  frontend_files = fileset(var.frontend_dist_dir, "**")

  mime_types = {
    "css"   = "text/css"
    "gif"   = "image/gif"
    "html"  = "text/html"
    "ico"   = "image/x-icon"
    "jpeg"  = "image/jpeg"
    "jpg"   = "image/jpeg"
    "js"    = "application/javascript"
    "json"  = "application/json"
    "map"   = "application/json"
    "png"   = "image/png"
    "svg"   = "image/svg+xml"
    "txt"   = "text/plain"
    "webp"  = "image/webp"
    "woff"  = "font/woff"
    "woff2" = "font/woff2"
    "xml"   = "application/xml"
  }
}
