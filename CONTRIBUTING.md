# CONTRIBUTING.md

# Contributing to LimitLayer

First off, thank you for considering contributing to LimitLayer!

We welcome bug reports, feature requests, documentation improvements, and pull requests.

## Development Setup

Clone the repository:

```bash
git clone https://github.com/gargavi-oss/limitlayer.git
cd limitlayer
pnpm install
```

Build the project:

```bash
pnpm build
```

Run tests:

```bash
pnpm test
```

## Project Structure

```
packages/
    core/
    express/

examples/
```

* `@limitlayer/core` contains the framework-agnostic rate limiting engine.
* `@limitlayer/express` contains the Express adapter.

## Coding Guidelines

* Write TypeScript with strict typing.
* Prefer readable code over clever code.
* Keep functions focused on a single responsibility.
* Add tests for new functionality.
* Keep public APIs backward compatible whenever possible.

## Pull Requests

Before opening a pull request:

* Ensure all tests pass.
* Build all packages successfully.
* Add or update documentation if necessary.
* Keep commits focused on a single change.

## Reporting Issues

When opening an issue, please include:

* Node.js version
* Package version
* Steps to reproduce
* Expected behavior
* Actual behavior

Thank you for helping improve LimitLayer!
