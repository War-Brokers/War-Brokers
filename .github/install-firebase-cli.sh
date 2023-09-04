#!/bin/bash
# from https://github.com/w9jds/firebase-action/blob/v12.4.0/entrypoint.sh

set -e

if [ -n "$GCP_SA_KEY" ]; then
    if echo "$GCP_SA_KEY" | jq empty 2>/dev/null; then
        echo "Storing GCP_SA_KEY in /opt/gcp_key.json"
        echo "$GCP_SA_KEY" >/opt/gcp_key.json
    else
        echo "Storing the decoded GCP_SA_KEY in /opt/gcp_key.json"
        echo "$GCP_SA_KEY" | base64 -d >/opt/gcp_key.json # If encoded base64 key, decode and save
    fi

    echo "Exporting GOOGLE_APPLICATION_CREDENTIALS=/opt/gcp_key.json"
    export GOOGLE_APPLICATION_CREDENTIALS=/opt/gcp_key.json
    echo "GOOGLE_APPLICATION_CREDENTIALS=/opt/gcp_key.json" >>"$GITHUB_ENV"
else
    echo "Either GCP_SA_KEY is required to run commands with the firebase cli"
    exit 126
fi

if [ -n "$PROJECT_PATH" ]; then
    cd "$PROJECT_PATH"
fi

pnpm install -g firebase-tools
