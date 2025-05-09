# AI Command Generator

A command-line tool that uses AI to generate shell commands from natural language descriptions.

## Features

- Convert natural language requests into shell commands
- OS-aware command generation (Linux, macOS, Windows)
- Linux distribution detection for more specific commands
- Copy generated commands to clipboard
- Configurable AI model selection
- Simple and intuitive interface

## Prerequisites

- OpenRouter API key

## Installation

```bash
curl -fsSL https://raw.githubusercontent.com/lmyslinski/ai/main/install.sh | bash
```

2. Set up your OpenRouter API key:
```bash
export OPENROUTER_API_KEY='your-api-key-here'
```

## Usage

Basic usage:
```bash
./ai "find all PDF files"
```

With model selection:
```bash
./ai --model "mistralai/mistral-7b-instruct-v0.2" "list all images"
```

Show help:
```bash
./ai --help
```

## Available Options

- `--model <model>`: Set the OpenRouter model to use (default: microsoft/phi-3-mini-128k-instruct)
- `--help`: Show help message

## Examples

```bash
# Find all PDF files
./ai "find all PDF files"

# Check what's running on port 8080
./ai "check what's on port 8080"

# List all images in home directory
./ai "list all images in ~/"

# Use a different model
./ai --model "mistralai/mistral-7b-instruct-v0.2" "find all PDF files"
```

## How It Works

1. The tool takes your natural language request
2. Detects your operating system and Linux distribution (if applicable)
3. Uses AI to generate an appropriate shell command
4. Copies the generated command to your clipboard
5. Displays the command for verification

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License 