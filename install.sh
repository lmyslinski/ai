#!/usr/bin/env bash

set -e

REPO="lmyslinski/ai"
VERSION=$(curl -s https://api.github.com/repos/$REPO/releases/latest | grep tag_name | cut -d '"' -f 4)
OS=$(uname -s)
ARCH=$(uname -m)
BINARY=""

if [[ "$OS" == "Linux" ]]; then
  BINARY="ai-linux"
elif [[ "$OS" == "Darwin" ]]; then
  BINARY="ai-macos"
elif [[ "$OS" == "MINGW"* || "$OS" == "MSYS"* || "$OS" == "CYGWIN"* ]]; then
  BINARY="ai-windows.exe"
else
  echo "Unsupported OS: $OS"
  exit 1
fi

URL="https://github.com/$REPO/releases/download/$VERSION/$BINARY"

curl -L "$URL" -o "$BINARY"
chmod +x "$BINARY"
sudo mv "$BINARY" /usr/local/bin/ai

echo "✅ Installed 'ai' CLI version $VERSION"
