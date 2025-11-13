#!/usr/bin/env bash
set -euo pipefail

# Simple helper to download a local Maven and build the spring-backend module
ROOT_DIR=$(cd "$(dirname "$0")" && pwd)
cd "$ROOT_DIR"

MAVEN_VERSION="3.9.4"
MAVEN_DIR="$ROOT_DIR/.maven/apache-maven-$MAVEN_VERSION"
MAVEN_BIN="$MAVEN_DIR/bin/mvn"

if [ ! -x "$MAVEN_BIN" ]; then
  echo "Maven not found locally. Downloading Apache Maven $MAVEN_VERSION..."
  ARCHIVE="apache-maven-$MAVEN_VERSION-bin.tar.gz"
  URL="https://archive.apache.org/dist/maven/maven-3/$MAVEN_VERSION/binaries/$ARCHIVE"

  tmpfile="$ROOT_DIR/$ARCHIVE"
  if command -v curl >/dev/null 2>&1; then
    curl -L -o "$tmpfile" "$URL"
  elif command -v wget >/dev/null 2>&1; then
    wget -O "$tmpfile" "$URL"
  else
    echo "Error: neither curl nor wget is available to download Maven. Please install one or install Maven manually." >&2
    exit 2
  fi

  mkdir -p "$ROOT_DIR/.maven"
  tar -xzf "$tmpfile" -C "$ROOT_DIR/.maven"
  rm -f "$tmpfile"
  echo "Maven downloaded to $MAVEN_DIR"
fi

echo "Building spring-backend with local Maven..."
"$MAVEN_BIN" -f "$ROOT_DIR/pom.xml" -DskipTests package

JAR="$ROOT_DIR/target/spring-backend-0.0.1-SNAPSHOT.jar"
if [ -f "$JAR" ]; then
  echo "Build succeeded. Jar: $JAR"
  echo "To run: java -jar $JAR"
else
  echo "Build finished but jar not found. Check Maven output for errors." >&2
  exit 3
fi
