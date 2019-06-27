#!/bin/bash

if ! [ -x "$(command -v firebase)" ]; then
  exit 0
fi

firebase use staging
firebase functions:config:get > .runtimeconfig.json