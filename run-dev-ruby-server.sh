#!/bin/bash

export GOOGLE_CLIENT_ID=$(cat src/config/dev.js | grep "googleClientID" | sed -e 's/googleClientID\(.*\)"/\1/' | sed -e 's/: \(.*\)"/\1/' | sed -e 's/, \(.*\)"/\1/'  | tr -d '[:space:]')
export SESSION_SECRET="developement-super-session-secret-1234567890"

printenv | grep GOOGLE_CLIENT_ID
printenv | grep SESSION_SECRET

rerun --pattern **/*.{rb} --quiet 'rackup'