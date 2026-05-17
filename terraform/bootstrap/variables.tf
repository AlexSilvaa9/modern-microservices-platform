variable "aws_region" {
  description = "AWS region for the Terraform state bucket and lock table."
  type        = string
  default     = "eu-west-1"
}

variable "state_bucket_name" {
  description = "Global-unique S3 bucket name to store Terraform state."
  type        = string
}

variable "lock_table_name" {
  description = "DynamoDB table name used for Terraform state locking."
  type        = string
  default     = "terraform-state-locks"
}

variable "tags" {
  description = "Common tags applied to all bootstrap resources."
  type        = map(string)
  default     = {}
}
