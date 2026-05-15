---
layout: post
title: "Docker Agent: Building Your Own AI Agent Teams from the Terminal"
date: 2026-05-12 12:22:39 UTC
category: docker
tags:
  - docker
  - ai
  - agents
subtitle: "Docker Agent Tutorial: Multi-Agent AI Setup"
description: "A practical guide to what is a Docker Agent — the open-source framework for building AI agent teams. Includes working YAML configs, filesystem and shell toolsets, model provider options, and a full coding agent walkthrough."
image: https://i.pinimg.com/736x/8b/81/38/8b8138c4491769dd53c5dc09b6548ecf.jpg
optimized_image: author: Shubhendu Shubham
author: Shubhendu Shubham
---

# Docker Agent: Building Your Own AI Agent Teams from the Terminal

You've probably used GitHub Copilot to autocomplete a line of code, or maybe you've typed something into ChatGPT and copy-pasted the result into your editor. That workflow is... fine. But what if you could have a team of AI agents sitting in your terminal, each one with a specific job, passing work between each other, running your tests, reading your files, and actually finishing tasks end to end?

That's what Docker Agent is. It's an open-source framework for defining and running teams of specialized AI agents. Not one big generalist model that tries to do everything â actual focused agents, each with their own instructions, their own model, and their own tools.

Let's dig into what it is, how it works, and how to actually use it.

## What Even Is Docker Agent?

Docker Agent (sometimes written as `docker-agent`) is a framework Docker built to let you define multi-agent AI systems in plain YAML files and run them from your terminal with a single command.

The core idea: instead of prompting one model with a 2000-word context window explaining your entire codebase, your tech stack, your testing requirements, and your coding style â you break the problem into smaller, focused agents. Each agent knows what it's responsible for. When it needs something outside its lane, it hands off to another agent.

Docker manages the coordination. You just write YAML.

It's worth clarifying: Docker Agent is not Gordon (`docker ai`), which is Docker's built-in AI assistant for Docker-related questions. Docker Agent is for building your own custom agent teams.

## Why Agent Teams Instead of One Big Prompt?

Here's the honest problem with single-agent setups: context switching kills quality.

When you tell one model "you're a developer, a code reviewer, a documentation researcher, and a test writer," it has to juggle all of that simultaneously. Context fills up fast. The model loses track of what it was supposed to be doing.

Agent teams sidestep this by splitting work across focused agents. A bug investigator focuses purely on analyzing the problem. A fixer focuses purely on writing the fix. They don't share knowledge (each agent has its own context), which actually works in your favor â each one stays sharp on its specific job.

## Installation

Docker Agent ships inside Docker Desktop 4.63 and later. If you're already on a recent version of Docker Desktop, you might already have it.

For Docker Engine users or if you want to install it separately:

```bash
# macOS with Homebrew
brew install docker-agent

# Windows with Winget
winget install Docker.Agent
```

You can also grab pre-built binaries from the [GitHub releases page](https://github.com/docker/docker-agent/releases).

Once you have the binary, drop it into `~/.docker/cli-plugins` and you can use it as `docker agent`. Or run it directly as a standalone binary â both work.

## Your First Agent: Getting Something Running in 5 Minutes

Before writing anything fancy, let's get the absolute minimum working. Create a file called `agents.yml`:

```yaml
agents:
  root:
    model: openai/gpt-5-mini
    description: A basic coding assistant
    instruction: |
      You are a helpful coding assistant.
      Help me write and understand code.
```

Set your API key:

```bash
export OPENAI_API_KEY=your_key_here
# or if you prefer Anthropic
export ANTHROPIC_API_KEY=your_key_here
```

Run it:

```bash
docker agent run agents.yml
```

You'll get a prompt. Ask it "How do I handle errors in Go?" â it'll answer. This is real, it works. But the agent can't see your files yet and can't run anything. It's just a chat interface backed by the model you specified.

To actually be useful for development work, you need to give it tools.

## Adding Tools: Filesystem and Shell Access

Here's where things get interesting. Docker Agent has a concept called **toolsets** â built-in capabilities you can attach to any agent. The two most important ones for development work are `filesystem` and `shell`.

Update your `agents.yml`:

```yaml
agents:
  root:
    model: openai/gpt-5-mini
    description: A coding assistant with filesystem access
    instruction: |
      You are a helpful coding assistant.
      You can read and write files to help me develop software.
      Always check if code works before finishing a task.
    toolsets:
      - type: filesystem
      - type: shell
```

Restart the agent and ask: "Read the README.md and summarize what this project does."

It'll actually read the file and give you a real answer based on your project.

The `filesystem` toolset gives the agent access to files in the current directory. The `shell` toolset lets it run commands. The agent will request permission if it needs to go outside those boundaries.

Other available toolsets include `todo` (for tracking multi-step tasks), `fetch` (for fetching web pages), and `mcp` (for connecting to MCP servers like DuckDuckGo search).

## Writing Instructions That Actually Work

Generic instructions give you generic results. The single biggest thing you can do to improve your agent's output is to write precise, structured instructions.

Here's a pattern that works well â this is adapted from Docker's own example of a Go developer agent:

```yaml
agents:
  root:
    model: anthropic/claude-sonnet-4-5
    description: Expert Go developer
    instruction: |
      Your goal is to help with code-related tasks by examining, modifying,
      and validating code changes.

      <TASK>
          # Workflow:
          # 1. Analyze: Understand requirements and identify relevant code.
          # 2. Examine: Search for files, analyze structure and dependencies.
          # 3. Modify: Make changes following best practices.
          # 4. Validate: Run linters/tests. If issues found, return to Modify.
      </TASK>

      Constraints:
      - Be thorough in examination before making changes
      - Always validate changes before considering the task complete
      - Write code to files, don't show it in chat

      ## Development Workflow
      - `go build ./...` - Build the application
      - `go test ./...` - Run tests
      - `golangci-lint run` - Check code quality

    add_date: true
    add_environment_info: true
    toolsets:
      - type: filesystem
      - type: shell
      - type: todo
```

A few things to pay attention to here:

`add_date: true` injects the current date into the agent's context. Sounds small, but it matters â the model knows what "today" means.

`add_environment_info: true` tells the agent what OS and environment it's running in. Useful if you want it to write platform-appropriate commands.

The `todo` toolset is underrated. When you ask for something complex, the agent breaks it into tasks and tracks its own progress through them. You can actually watch it work through a checklist.

The structured workflow inside `<TASK>` tags gives the agent a mental model for how to approach problems. Without this, models often jump straight to writing code before understanding the problem. This instruction tells it: examine first, modify second, validate always.

## Building a Real Agent Team: Debugger + Fixer

Let's look at a multi-agent setup. This is the example from the Docker docs â a two-agent team for debugging:

```yaml
agents:
  root:
    model: openai/gpt-5-mini
    description: Bug investigator
    instruction: |
      Analyze error messages, stack traces, and code to find bug root causes.
      Explain what's wrong and why it's happening.
      Delegate fix implementation to the fixer agent.
    sub_agents: [fixer]
    toolsets:
      - type: filesystem
      - type: mcp
        ref: docker:duckduckgo

  fixer:
    model: anthropic/claude-sonnet-4-5
    description: Fix implementer
    instruction: |
      Write fixes for bugs diagnosed by the investigator.
      Make minimal, targeted changes and add tests to prevent regression.
    toolsets:
      - type: filesystem
      - type: shell
```

Save this as `debugger.yaml` and run:

```bash
docker agent run debugger.yaml
```

Now paste in an error message. The root agent investigates â it reads the relevant code, searches for context if needed via DuckDuckGo, and explains the root cause. Then it hands off to the `fixer` agent, which writes the actual fix with minimal changes and adds a regression test.

Two agents. Two models. Each focused on one thing.

Notice the model choice too: the investigator uses a lighter model (`gpt-5-mini`) since analysis is cheaper to run, while the fixer uses Claude Sonnet which has stronger reasoning for code generation. This is intentional cost optimization baked into the architecture.

## A Full Coding Agent with Documentation Research

Here's a more complete setup â a developer agent that can look up documentation on demand by delegating to a librarian:

```yaml
agents:
  root:
    model: anthropic/claude-sonnet-4-5
    description: Expert developer
    instruction: |
      Your goal is to help with code-related tasks by examining, modifying,
      and validating code changes.

      When you need to look up documentation or research how something works,
      ask the librarian agent.

      ## Workflow
      1. Analyze requirements and understand the task
      2. Examine relevant files and understand existing patterns
      3. Make targeted changes
      4. Run tests and validate everything works

      ## Constraints
      - Always read existing code before writing new code
      - Run tests before marking a task complete
      - Write code to files, never just show it in chat
      - Follow the existing code style

      ## Commands
      - `npm test` - Run tests
      - `npm run lint` - Lint
      - `npm run build` - Build

    add_date: true
    add_environment_info: true
    toolsets:
      - type: filesystem
      - type: shell
      - type: todo
    sub_agents:
      - librarian

  librarian:
    model: anthropic/claude-haiku-4-5
    description: Documentation researcher
    instruction: |
      You are the librarian. Your job is to find relevant documentation,
      articles, or resources to help the developer agent.

      Search the internet and fetch web pages as needed.
      Return concise, relevant summaries â don't dump entire pages.
    toolsets:
      - type: mcp
        ref: docker:duckduckgo
      - type: fetch
```

Now ask: "How should I handle rate limiting in my Express API? Then implement it."

The root agent recognizes it needs to research this, delegates to the librarian, gets back a summary of current best practices, and then writes the actual implementation in your codebase. All in one workflow.


## How the Agent Hierarchy Works

The architecture is worth understanding clearly:

- You always interact with the **root agent**
- The root agent can delegate to **sub-agents** listed under `sub_agents`
- Sub-agents can have their own sub-agents (deep hierarchies work fine)
- **Agents don't share context** â each has its own independent knowledge window

That last point is crucial. When the root agent hands work to a sub-agent, the sub-agent starts fresh. It doesn't know what the root agent has been doing. The root agent has to explicitly pass the relevant information in its delegation request.

This is by design. It keeps each agent's context clean and focused. But it means you need to write instructions that tell agents what information to include when they delegate.

## Sharing Agent Teams

Once you've built an agent team you like, you can package and share it as an OCI artifact â basically treating it like a container image:

```bash
# Push your agent config to Docker Hub
docker agent share push ./my-agent.yaml myusername/my-agent

# Pull it somewhere else
docker agent share pull myusername/my-agent
```

This is genuinely useful for teams. You build a well-tuned coding agent for your project's specific stack and conventions, push it to your organization's registry, and everyone on the team can pull and run the same agent configuration.

## Generating Agent Configs with AI

If you don't want to write the YAML from scratch, there's a shortcut:

```bash
docker agent new
```

This uses AI to help you generate an agent team configuration based on what you describe. You tell it what you want the agent to do, and it generates the YAML. Then you review and adjust from there.

## Model Provider Options

Docker Agent supports any LLM provider. You set the model in the format `provider/model-name`:

```yaml
# Anthropic
model: anthropic/claude-sonnet-4-5
model: anthropic/claude-haiku-4-5

# OpenAI
model: openai/gpt-5
model: openai/gpt-5-mini

# Google
model: google/gemini-2.5-pro
```

Set the corresponding environment variable before running:

```bash
export ANTHROPIC_API_KEY=sk-ant-...
export OPENAI_API_KEY=sk-...
export GOOGLE_API_KEY=...
```

You can also mix providers across agents in the same team. Cost-intensive reasoning tasks get expensive models; simple lookup tasks get cheap, fast models.

## Configuration Reference at a Glance

Here's a summary of the key YAML fields you'll use most:

```yaml
agents:
  agent-name:
    model: provider/model-name          # Required: which model to use
    description: "Short role summary"   # What this agent does
    instruction: |                      # The agent's system prompt
      Detailed instructions here...
    sub_agents: [agent-b, agent-c]      # Other agents this one can delegate to
    add_date: true                      # Inject current date into context
    add_environment_info: true          # Inject OS/env info
    toolsets:
      - type: filesystem                # File read/write access
      - type: shell                     # Run shell commands
      - type: todo                      # Task tracking
      - type: fetch                     # Fetch web pages
      - type: mcp                       # Connect to MCP servers
        ref: docker:duckduckgo          # Specific MCP server reference
```

## Practical Tips

**Start simple, add complexity as you hit limits.** A single agent with good instructions will handle 80% of what you need. Add sub-agents when you notice the main agent getting confused by context switching between different types of work.

**Your instructions are your biggest lever.** Spending 20 minutes writing precise, structured instructions will do more for output quality than switching to a more expensive model. Tell the agent exactly what workflow to follow, not just what to produce.

**Match models to task complexity.** Use Claude Sonnet or GPT-5 for reasoning-heavy work (complex code changes, debugging). Use Haiku or GPT-5-mini for simple tasks (documentation lookup, summarization). Your wallet will thank you.

**Add constraints when you see repeated mistakes.** If the agent keeps doing something you don't want â like modifying generated files or skipping test runs â add an explicit constraint. These are specific instructions about things it should never do.

**Use `todo` toolset for anything multi-step.** When you ask for something that takes more than one action, the todo toolset lets the agent track its own progress. You get visibility into what it's doing and it's less likely to forget a step.

## Wrapping Up

Docker Agent is one of those tools that, once you set it up properly for your project, genuinely changes how you work. The difference between "AI that answers questions" and "AI that actually works on your codebase" is a well-configured agent team with good instructions and the right tools.

The YAML-based configuration is a smart design choice â it's version-controllable, shareable, and readable. Your agent configuration can live right next to your code and evolve as your project does.

It's still experimental, and the ecosystem around it is early. But the core functionality is solid and the direction is clearly right. Worth spending an afternoon setting up for your project.

**Resources:**
- [Docker Agent Docs](https://docs.docker.com/ai/docker-agent/)
- [Tutorial: Building a Coding Agent](https://docs.docker.com/ai/docker-agent/tutorial/)
- [Best Practices](https://docs.docker.com/ai/docker-agent/best-practices/)
- [Configuration Reference](https://docs.docker.com/ai/docker-agent/reference/config/)
- [GitHub Repository](https://github.com/docker/docker-agent)
- [Example Configurations](https://github.com/docker/docker-agent/tree/main/examples)