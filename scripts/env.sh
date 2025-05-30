#!/bin/bash

set -o allexport

if [ -f .env ]; then
    source .env
fi

if [ -f .env.local ]; then
    source .env.local
fi

if [ -f .env.export ]; then
    source .env.export
fi

set +o allexport 