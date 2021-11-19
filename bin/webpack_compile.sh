#!/bin/bash
#This script forces the webpack to compile in the container

set -e

rake webpacker:compile

exec "$@"