# Hugs4Bugs

This is an open-source blog where I write about various technical aspects. This project is built using Jekyll, a simple, blog-aware, static site generator for personal, project, or organization sites. The site is hosted on Firebase and uses GitHub Actions for continuous integration.

## Architecture

The project follows a straightforward architecture:
- **Jekyll**: Generates static site content from Markdown files.
- **GitHub Actions**: Automates CI/CD pipeline, including CodeQL security analysis.
- **Firebase**: Hosts the generated static site.
- **Docker**: Provides containerized development and deployment environments.

### Directory Structure

hugs4bugs/ ├── _posts/ │ ├── ... ├── _site/ │ ├── ... ├── Dockerfile ├── docker-compose.yml ├── Gemfile ├── ..


## Running Locally

To run the project locally, follow these steps:

1. Clone the repository:
   ```sh
   git clone https://github.com/sivolko/hugs4bugs.git
   cd hugs4bugs
   ```
2. Install dependencies and run the Jekyll server:
  ```
   gem install bundler && bundle install
   bundle exec jekyll serve

```
3. To load the server live, add the -l option:
```
bundle exec jekyll serve -l
```

## Run inside Container (Docker)

To run the project inside a Docker container, follow these steps:

1. Edit the docker-compose.yml file as per your preferences.
2. Start the server:
   ```
    docker-compose up
   ```
3. Stop the server:
```
docker-compose stop
```

**Continuous Integration**

The repository uses GitHub Actions to automate the CI/CD pipeline. The workflow includes:

1. **CodeQL Analysis**: Performs security analysis on the codebase to detect vulnerabilities.
2. **Firebase Deployment**: Deploys the static site to Firebase Hosting.
You can find the workflow configuration in the .github/workflows directory.

**Contributions**
Feel free to raise PRs or issues if you find something useful or have suggestions for improvements.
