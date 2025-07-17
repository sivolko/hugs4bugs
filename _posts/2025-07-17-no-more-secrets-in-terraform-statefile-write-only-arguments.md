---
layout: post
title: "Terraform's Secret Weapon: Write Only Arguments"
subtitle: "Let's keep it simpler"
description: "Let's understand what's new write only arguments in terraform 1.11, how IaaC engineers no need to store secrets in state file"
image: https://res.cloudinary.com/hugs4bugs/image/upload/v1752723091/hugs4bugs/terraform/terraform_writeonly_svg_b3zno4.svg
optimized_image: https://res.cloudinary.com/hugs4bugs/image/upload/v1752723091/hugs4bugs/terraform/terraform_writeonly_svg_b3zno4.svg
author: Shubhendu Shubham
category: Cyber Security
tags:
- IaaC
- Cybersecurity
---
If you've been working with Terraform for a while, you've probably run into this frustrating situation: you need to pass a password or API token to a resource, but you don't want that sensitive data sitting in your state file for everyone to see. Maybe you've tried creative workarounds with external data sources or complex scripting, but let's be honest – it always felt like a hack.

Well, good news! Terraform 1.11 introduces write-only arguments, and they're about to change how we handle secrets in our infrastructure code. Think of them as a secure handoff mechanism – you can pass sensitive data to resources during deployment, but Terraform immediately forgets about it once the job is done.

**What Are Write-Only Arguments?**

Write-only arguments are exactly what they sound like: arguments that you can write to (pass values to) but Terraform never stores anywhere. No state file, no plan file, no logs – nowhere. It's like whispering a secret that gets forgotten the moment it's used.

Here's the key insight: most of the time, we don't actually need Terraform to remember passwords and tokens. We just need to pass them to the cloud provider during resource creation or updates. Once the resource is created, the cloud provider handles the secret internally.

**The Problem This Solves**

Before write-only arguments, here's what typically happened:

```
# The old way - DON'T do this!

resource "aws_db_instance" "example" {
  instance_class = "db.t3.micro"
  allocated_storage = "5"
  engine = "postgres"
  username = "dbuser"
  password = "super-secret-password"  # This ends up in state!
  skip_final_snapshot = true
}
```
That password would sit in your state file, readable by anyone with access to it. Not great for security.

**How Write-Only Arguments Work**

With Terraform 1.11, providers can now mark certain arguments as write-only. The AWS provider, for example, introduces *password_wo* (write-only) arguments for database resources:

```
resource "aws_db_instance" "example" {
  instance_class = "db.t3.micro"
  allocated_storage = "5"
  engine = "postgres"
  username = "dbuser"
  password_wo = "super-secret-password"  # Never stored!
  password_wo_version = 1
  skip_final_snapshot = true
}

```

Notice two things:

1. The *password_wo argument* – this is write-only
2. The *password_wo_version* argument – this is how we trigger updates

**The Version Argument Pattern**

Since Terraform can't track changes to write-only arguments (because it doesn't store them), providers use version arguments to detect when updates are needed. When you want to change a password, you increment the version:

```
resource "aws_db_instance" "example" {
  instance_class = "db.t3.micro"
  allocated_storage = "5"
  engine = "postgres"
  username = "dbuser"
  password_wo = "new-super-secret-password"
  password_wo_version = 2  # Incremented to trigger update
  skip_final_snapshot = true
}
```
Terraform sees the version change, knows something's different, and tells the provider to use the new password.

**Real World AWS Example: DB with Secrets Manager**

Here's where it gets really powerful. You can combine write-only arguments with ephemeral resources to create a fully automated, secure password management system:

```
# Generate a random password (ephemeral - exists only during apply)
ephemeral "random_password" "db_password" {
  length = 16
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

# Store it in AWS Secrets Manager
resource "aws_secretsmanager_secret" "db_password" {
  name = "rds-postgres-password"
  description = "Password for RDS PostgreSQL instance"
}

resource "aws_secretsmanager_secret_version" "db_password" {
  secret_id = aws_secretsmanager_secret.db_password.id
  secret_string_wo = ephemeral.random_password.db_password.result
  secret_string_wo_version = 1
}

# Retrieve it for use (also ephemeral)
ephemeral "aws_secretsmanager_secret_version" "db_password" {
  secret_id = aws_secretsmanager_secret_version.db_password.secret_id
}

# Create the database using the password
resource "aws_db_instance" "example" {
  identifier = "my-postgres-db"
  instance_class = "db.t3.micro"
  allocated_storage = 20
  engine = "postgres"
  engine_version = "13.7"
  username = "dbadmin"
  
  # Use the password from Secrets Manager
  password_wo = ephemeral.aws_secretsmanager_secret_version.db_password.secret_string
  password_wo_version = aws_secretsmanager_secret_version.db_password.secret_string_wo_version
  
  skip_final_snapshot = true
  
  tags = {
    Name = "Example PostgreSQL DB"
  }
}

```

**What happens here**:

1. Terraform generates a random password (ephemeral)
2. Stores it in AWS Secrets Manager (using write-only argument)
3. Retrieves it back (ephemeral)
4. Uses it to create the database (write-only argument)
5. The password never appears in state or plan files

As per my understanding I have figured out couple of best practices 

1. Always use version Arguments : without it terraform has no way to know when to update the resource:

```
resource "aws_db_instance" "example" {
  # ... other arguments
  password_wo = var.db_password
  password_wo_version = var.db_password_version  # Don't forget this!
}
```

2. Combine with Emphemeral Resources : Write only arguments work greate with emphemeral resources for fully automated secret management 

```
ephemeral "random_password" "api_key" {
  length = 32
}

resource "some_service" "example" {
  api_key_wo = ephemeral.random_password.api_key.result
  api_key_wo_version = 1
}

```
3. Use Local for version Management: when you need to update multiple resources with the same secret, use locals to manage versions:

```
locals {
  db_password_version = 2  # Increment this to rotate everywhere
}

resource "aws_db_instance" "primary" {
  password_wo = var.db_password
  password_wo_version = local.db_password_version
}

resource "aws_db_instance" "replica" {
  password_wo = var.db_password
  password_wo_version = local.db_password_version
}

```
**Common Gotchas**

**Write-Only Arguments Are Sent Every Time**

Unlike regular arguments, write-only arguments are sent to the provider during every Terraform operation. This is because Terraform can't compare them to detect changes.

**Plan Output Won't Show Changes**
Since write-only arguments aren't stored, terraform plan won't show their values or changes. It will only show version argument changes.

**Provider-Specific Implementation**

Each provider implements write-only arguments differently. Always check the provider documentation for specific details and supported resources.

**The Future of Secret Management**

Write-only arguments represent a significant step forward in Terraform's secret management capabilities. Combined with ephemeral resources, they enable patterns that were previously impossible or required complex workarounds.
This isn't just about security – it's about cleaner, more maintainable infrastructure code. When secrets aren't cluttering up your state files, debugging becomes easier, and you can focus on what really matters: building reliable infrastructure.

I'm still learning and adopting these new changes and best practices, let's see how's the future ? 

Thanks for reading, keep troubleshooting !!!