#!/usr/bin/env bash
set -euo pipefail

# --- 1️⃣ Extract grep value ---
TAGS=""
i=1
while [ $i -le $# ]; do
  arg="${!i}"
  case "$arg" in
    --grep=*)
      TAGS="${arg#*=}"
      ;;
    --grep)
      next=$((i+1))
      if [ $next -le $# ]; then
        TAGS="${!next}"
      fi
      ;;
  esac
  i=$((i+1))
done

if [ -z "${TAGS:-}" ]; then
  TAGS="${TESTOMATIO_GREP:-${grep:-}}"
fi

# --- 2️⃣ Clean and convert grep expression ---
if [ -n "$TAGS" ]; then
  # Remove leading/trailing parentheses
  TAGS="${TAGS#\(}"
  TAGS="${TAGS%\)}"

  # Convert "T1|T2" → "@T1 or @T2"
  EXPRESSION="@${TAGS//|/ or @}"

  echo "🟢 Using cucumberOpts.tagExpression: $EXPRESSION"
  exec npm run test:ios "$EXPRESSION"
else
  echo "⚪ No grep provided — running full suite"
  exec npm run test:ios:full
fi