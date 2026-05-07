#!/usr/bin/env ruby
require 'yaml'
require 'date'

OUTPUT_FILE = 'llms.txt'
POSTS_DIR = '_posts'

header = <<~HEADER
# hugs4bugs.me
> Practical deep dives into cloud security, Microsoft Sentinel, Docker, DevSecOps, Security Architecture, and AI Security Frameworks by Shubhendu Shubham.

## About
- Author: Shubhendu Shubham
- Site: https://hugs4bugs.me
- Twitter: https://twitter.com/myselfshubhendu
- GitHub: https://github.com/sivolko
- LinkedIn: https://linkedin.com/in/shubhendu-shubham
- Topics: cybersecurity, cloud security, DevSecOps, Microsoft Sentinel, Docker, AI security, security architecture, AI security frameworks

## Content
This blog publishes technical tutorials, security research, and hands-on guides for SOC analysts, DevSecOps engineers, security architects, and cloud security practitioners.

## Posts
HEADER

posts = []

Dir.glob("#{POSTS_DIR}/*.md").each do |file|
  content = File.read(file)
  next unless content =~ /\A---\s*\n(.*?)\n---\s*\n/m

  front_matter = YAML.safe_load($1) || {}
  filename = File.basename(file, '.md')
  slug = filename.sub(/^\d{4}-\d{2}-\d{2}-/, '')
  title = front_matter['title'] || slug.gsub('-', ' ').capitalize
  description = (front_matter['description'] || '').gsub(/<[^>]*>/, '').strip.gsub(/\s+/, ' ')[0..150]
  date = front_matter['date']

  posts << { slug: slug, title: title, description: description, date: date }
end

posts.sort_by! { |p| p[:date] || Date.new(2000, 1, 1) }.reverse!

posts_content = posts.map { |p| "- /#{p[:slug]}/: #{p[:description].empty? ? p[:title] : p[:description]}" }.join("\n")

topics = <<~TOPICS

## Topics covered
- Microsoft Sentinel: authentication, KQL queries, analytics rules, SOAR playbooks
- Docker & Containers: sandboxing, secrets management, container security, runtime security
- DevSecOps: CI/CD pipeline security, GitHub Actions, IaC scanning, SLSA framework
- AI Security: agent risks, prompt injection, LLM red teaming, AI security frameworks
- Security Architecture: threat modeling, zero trust, cloud security design, STRIDE
- Cloud Security: AWS, Azure, GCP misconfigurations, CSPM
- AppSec: CVE triage, DMARC/DKIM/SPF, supply chain attacks, OWASP Top 10
TOPICS

File.write(OUTPUT_FILE, header + posts_content + topics)
puts "Generated #{OUTPUT_FILE} with #{posts.length} posts"
