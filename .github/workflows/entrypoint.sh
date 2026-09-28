#!/usr/bin/env bash
# OpenCode AI Agent Entrypoint
# This script validates environment setup and launches the AI code-review agent
# with GitHub Copilot credentials

set -euo pipefail

if [[ -z "${OPENCODE_MODEL:-}" ]]; then
  echo "Error: OPENCODE_MODEL is required. Run 'opencode models github-copilot' to list valid models after login." >&2
  exit 1
fi

AUTH_FILE="${XDG_DATA_HOME:-${HOME}/.local/share}/opencode/auth.json"
if [[ ! -r "${AUTH_FILE}" ]]; then
  echo "Error: GitHub Copilot credentials not found at ${AUTH_FILE}. Authenticate once outside the container with 'opencode auth login --provider github-copilot', then mount ~/.local/share/opencode into the container." >&2
  exit 1
fi

MODEL="github-copilot/${OPENCODE_MODEL#github-copilot/}"

# Determine source code directory (defaults to /workspace/source)
if [[ -z "${SOURCE_CODE:-}" ]]; then
  SOURCE_CODE="/workspace/source"
fi

# Validate source code directory exists
if [[ ! -d "${SOURCE_CODE}" ]]; then
  echo "Source directory not found: ${SOURCE_CODE}. Mount the repository source directory at /workspace/source or set SOURCE_CODE." >&2
  exit 1
fi

# Set output path for the security review report
REPORT_FILE="/workspace/reports/pentest-verification-report.md"

# Test write permissions to reports directory before proceeding
if ! touch "${REPORT_FILE}" 2>/dev/null; then
  echo "Error: /workspace/reports is not writable or does not exist. Verify the mount: docker compose with -v ./reports:/workspace/reports" >&2
  exit 1
fi
# Clean up any existing report file to start fresh
rm -f "${REPORT_FILE}"

# Launch the OpenCode agent with the validated configuration and review prompt
echo "Starting OpenCode agent harness with model: ${MODEL}..."
opencode run --model "${MODEL}" --auto -- "$(cat "/workspace/.claude/commands/${ENTRY_PROMPT}")"