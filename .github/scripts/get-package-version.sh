#!/bin/bash

version=$(jq -r .version package.json)

git fetch --tags

git tags
