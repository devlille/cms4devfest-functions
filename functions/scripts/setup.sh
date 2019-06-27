#!/bin/bash

firebase use staging
firebase functions:config:get > .runtimeconfig.json