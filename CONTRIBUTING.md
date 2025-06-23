# Contributing to the Thunderbird Debugger Extension for Visual Studio Code

First off, thank you for considering contributing to this project! We're excited to have you. This document is a comprehensive guide to help you get started with the project, understand its architecture, and successfully contribute.

## Table of Contents

1.  [Code of Conduct](#code-of-conduct)
2.  [Getting Started: Your First Contribution](#getting-started-your-first-contribution)
    * [Prerequisites](#prerequisites)
    * [Setting Up the Development Environment](#setting-up-the-development-environment)
3.  [Building and Developing](#building-and-developing)
    * [Development Workflow Scripts](#development-workflow-scripts)
    * [Launching the Extension for Testing](#launching-the-extension-for-testing)
4.  [Architectural Deep Dive](#architectural-deep-dive)
    * [Core Components](#core-components)
    * [The Debug Adapter Protocol (DAP)](#the-debug-adapter-protocol-dap)
    * [Communication with Thunderbird](#communication-with-thunderbird)
5.  [How to Debug the Debugger](#how-to-debug-the-debugger)
    * [Debugging the Extension (Host)](#debugging-the-extension-host)
    * [Debugging the Debug Adapter](#debugging-the-debug-adapter)
    * [Logging](#logging)
6.  [Making Changes](#making-changes)
    * [Finding an Issue to Work On](#finding-an-issue-to-work-on)
    * [The Git Workflow](#the-git-workflow)
    * [Code Quality and Style](#code-quality-and-style)
    * [Running Tests](#running-tests)
7.  [Submitting Your Contribution](#submitting-your-contribution)
    * [Creating a Pull Request](#creating-a-pull-request)
    * [Code Review Process](#code-review-process)
8.  [Working with WebExtensions (Deep Dive)](#working-with-webextensions-deep-dive)
    * [Overview](#overview)
    * [Launch Configuration for WebExtensions](#launch-configuration-for-webextensions)
    * [Debugging Different Script Types](#debugging-different-script-types)
        * [Background Scripts](#background-scripts)
        * [Content Scripts](#content-scripts)
    * [Path Mapping for WebExtensions](#path-mapping-for-webextensions)
    * [Reloading your WebExtension](#reloading-your-webextension)
    * [Troubleshooting WebExtension Debugging](#troubleshooting-webextension-debugging)
9.  [Release Process](#release-process)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior.

## Getting Started: Your First Contribution

This section will guide you through setting up your local development environment so you can start contributing.

### Prerequisites

You'll need the following software installed on your machine:

* [Node.js](https://nodejs.org/) (which includes `npm`)
* [Visual Studio Code](https://code.visualstudio.com/)
* [Git](https://git-scm.com/)
* A recent version of [Thunderbird](https://www.thunderbird.net/en-US/)

### Setting Up the Development Environment

1.  **Fork the repository:**
    Click the "Fork" button on the top right of the [GitHub repository page](https://github.com/thunderbird/vscode-thunderbird-debug). This will create a copy of the repository in your own GitHub account.

2.  **Clone your fork:**
    ```bash
    git clone [https://github.com/YOUR_USERNAME/vscode-thunderbird-debug.git](https://github.com/YOUR_USERNAME/vscode-thunderbird-debug.git)
    cd vscode-thunderbird-debug
    ```

3.  **Install dependencies:**
    This project uses `npm` for package management. Run the following command in the root of the project to install all necessary dependencies:
    ```bash
    npm install
    ```

## Building and Developing

Once your environment is set up, you can use several scripts to build, watch, and check the code.

### Development Workflow Scripts

These scripts, defined in `package.json`, are your main tools for development:

* `npm run compile`: This command compiles the TypeScript code for both the extension and the debug adapter once. This is useful for creating a build before testing.
* `npm run watch`: This is one of the most useful commands for active development. It will compile the code and then "watch" for any file changes. When you save a file, it will automatically recompile the code, saving you time.
* `npm run typecheck`: Runs the TypeScript compiler in `noEmit` mode to check for any type errors in the codebase. It's a good practice to run this before committing your changes to catch potential issues early.
* `npm run lint`: Runs ESLint to check the code against our defined styling and quality rules.
* `npm test`: Executes the automated test suite located in the `src/test` directory.

### Launching the Extension for Testing

To launch the extension in a special VS Code window called the "Extension Development Host":

1.  Open the project in your primary VS Code window.
2.  Press `F5`, or go to the "Run and Debug" panel (Ctrl+Shift+D) and click the green play button for the "Launch Extension" configuration.

This will open a new VS Code window where your development version of the Thunderbird Debugger extension is installed and active, ready for you to test your changes.

## Architectural Deep Dive

Understanding the architecture of the extension is crucial for making meaningful contributions.

### Core Components

The extension is composed of two main parts:

1.  **The Extension (Client):** This is the part that runs in the VS Code "Extension Host" process. It's responsible for the UI elements you see in VS Code, like the debug configuration provider, commands, and views. The code for the extension is located in the `src/extension` directory.

2.  **The Debug Adapter (Server):** This is the core of the debugger. It's a separate process that implements the [Debug Adapter Protocol (DAP)](#the-debug-adapter-protocol-dap) and communicates with Thunderbird's remote debugging server. The code for the debug adapter is in `src/adapter`.

### The Debug Adapter Protocol (DAP)

VS Code's debugging architecture is built around the Debug Adapter Protocol. This protocol defines a standardized way for a debugger (like this extension) to communicate with a development tool (VS Code).

* **Requests:** VS Code sends requests to the debug adapter (e.g., `setBreakpoints`, `continue`, `next`).
* **Responses:** The debug adapter sends responses back to VS Code for each request.
* **Events:** The debug adapter sends events to VS Code to notify it of changes in the debuggee's state (e.g., `stopped`, `terminated`).

A deep understanding of the DAP is essential for working on the debug adapter. You can find the full specification [here](https://microsoft.github.io/debug-adapter-protocol/).

### Communication with Thunderbird

The debug adapter communicates with Thunderbird using the Thunderbird Remote Debugging Protocol, which is a custom protocol based on RDP. This communication happens over a TCP socket.

The `ThunderbirdConnection` class in `src/adapter/thunderbird/connection.ts` encapsulates the logic for communicating with Thunderbird. It handles sending commands and receiving responses and events from the Thunderbird debugger server.

## How to Debug the Debugger

Since the extension is split into two processes, you'll need to use different techniques to debug each part.

### Debugging the Extension (Host)

You can debug the extension part directly from your primary VS Code window.

1.  Set breakpoints in the extension code (`src/extension/**/*.ts`).
2.  Launch the extension by pressing `F5`.
3.  When you perform an action that triggers your code, the breakpoints will be hit, and the debugger in your main VS Code window will pause.

### Debugging the Debug Adapter

To debug the debug adapter, you need to attach a second debugger to it.

1.  In your main VS Code window, go to the "Run and Debug" panel.
2.  Select the **"Attach to Adapter"** configuration from the dropdown menu.
3.  First, launch the extension (`F5` with the "Launch Extension" configuration).
4.  In the Extension Development Host window, start a debugging session for a Thunderbird instance. This will start the adapter process.
5.  Switch back to your main VS Code window and now launch the "Attach to Adapter" configuration (press `F5` again). This will attach a debugger to the running adapter process.
6.  Now you can set breakpoints in the debug adapter code (`src/adapter/**/*.ts`), and they will be hit.

### Logging

The extension produces detailed logs that can be very helpful for debugging. To view these logs:

1.  In the VS Code window where you're debugging your application, open the "Output" panel (`View > Output`).
2.  Select "Thunderbird Debug" from the dropdown menu in the Output panel.

You can enable more verbose logging by setting the `trace` property in your `launch.json` configuration to `true`.

## Making Changes

Ready to start coding? Here's how to approach making changes to the codebase.

### Finding an Issue to Work On

Check the [issue tracker](https://github.com/thunderbird/vscode-thunderbird-debug/issues) on GitHub. Issues labeled `good first issue` are a great place to start if you're new to the project.

If you have an idea for a new feature or a bug fix that's not already in the issue tracker, feel free to open a new issue to discuss it with the maintainers.

### The Git Workflow

We use a standard fork-and-pull-request workflow.

1.  Create a new branch for your changes:
    ```bash
    git checkout -b your-feature-branch
    ```

2.  Make your changes, commit them with a descriptive message, and push the branch to your fork:
    ```bash
    git add .
    git commit -m "feat: A brief description of your feature"
    git push origin your-feature-branch
    ```

3.  Create a pull request from your branch to the `main` branch of the main repository.

### Code Quality and Style

Before submitting a pull request, please ensure your code adheres to the project's quality standards.

1.  **Check for type errors:**
    ```bash
    npm run typecheck
    ```
2.  **Check for linting issues and automatically fix them:**
    ```bash
    npm run lint -- --fix
    ```

### Running Tests

We have a suite of tests to ensure the quality and stability of the extension. To run the full test suite, use the following command:

```bash
npm test
````

Please add new tests for any new functionality you introduce and ensure that all tests pass before submitting a pull request.

## Submitting Your Contribution

### Creating a Pull Request

When you're ready to submit your changes, open a pull request on GitHub. Provide a clear and detailed description of the changes you've made and why you've made them. If your PR addresses an existing issue, be sure to link to it in the description (e.g., `Fixes #123`).

### Code Review Process

Once you've submitted a pull request, the project maintainers will review your code. They may ask for changes or improvements. Please be responsive to feedback and be prepared to make further changes to your code. Once your PR is approved, a maintainer will merge it into the main branch.

## Working with WebExtensions (Deep Dive)

### Overview

The Thunderbird Debugger extension provides comprehensive support for debugging WebExtensions. You can debug background scripts, content scripts, and other scripts that are part of your add-on. This section will walk you through the process of setting up your environment and debugging your WebExtension.

### Launch Configuration for WebExtensions

To start a debugging session for your WebExtension, you'll need to create a `launch.json` configuration. The key property for WebExtension debugging is `addonPath`, which should be the absolute path to the directory containing your `manifest.json` file.

Here's a typical `launch.json` configuration for a WebExtension:

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Launch WebExtension",
            "type": "thunderbird",
            "request": "launch",
            "reAttach": true,
            "addonPath": "${workspaceFolder}/path/to/your/addon"
        }
    ]
}
```

The `${workspaceFolder}` variable is a VS Code variable that resolves to the root path of your project. You should replace `/path/to/your/addon` with the actual path to your add-on's root directory.

### Debugging Different Script Types

WebExtensions are often composed of different types of scripts that run in different contexts.

#### Background Scripts

Background scripts run in the background of the browser and have a longer lifecycle than other scripts. You can set breakpoints in your background scripts just like you would in any other JavaScript file.

#### Content Scripts

Content scripts are injected into web pages and run in the context of that page. You can debug content scripts in the same way as background scripts.

### Path Mapping for WebExtensions

The debugger automatically sets up path mappings for WebExtensions. It maps the `moz-extension://` URLs used by Thunderbird to the local files in your `addonPath`. This allows you to set breakpoints in your local source files, and the debugger will correctly map them to the corresponding files running in the browser.

### Reloading your WebExtension

You can easily reload your WebExtension during a debugging session to see your changes.

  * **Manual Reload:** Use the "Thunderbird: Reload add-on" command from the VS Code command palette (`extension.thunderbird.reloadAddon`). This will reload your add-on without restarting the entire debug session.
  * **Automatic Reload:** You can configure the debugger to automatically reload your WebExtension whenever you save a file. This is done using the `reloadOnChange` property in your `launch.json`.

Here's an example of how to configure `reloadOnChange` to watch all JavaScript files in your add-on's directory:

```json
"reloadOnChange": {
    "watch": [ "${workspaceFolder}/path/to/your/addon/**/*.js" ],
    "ignore": [ "${workspaceFolder}/path/to/your/addon/node_modules/**" ]
}
```

### Troubleshooting WebExtension Debugging

  * **Breakpoints not hitting:** If your breakpoints are not being hit, make sure that your `addonPath` in `launch.json` is correct and that the files are being loaded by Thunderbird. You can check the "Loaded Scripts" view in the debug sidebar to see which scripts have been loaded.
  * **"Couldn't find source adapter" error:** This error can sometimes occur if the debugger has trouble mapping the scripts running in the browser to your local source files. Check your `pathMappings` in `launch.json`.

## Release Process

The release process is handled by the project maintainers. It involves:

1.  Updating the version number in `package.json`.
2.  Updating the `CHANGELOG.md` file with the latest changes.
3.  Creating a new git tag for the release.
4.  Publishing the new version to the Visual Studio Code Marketplace.

Thank you for contributing to the Thunderbird Debugger extension\! Your help is greatly appreciated.
