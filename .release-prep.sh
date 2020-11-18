#!/bin/bash

if [ -n "$1" ]
then
	npx replace-in-file "/Version: (.*)/g" "Version: $1" style.css --isRegex
	npx json -f package.json -I -e "this.version = '$1'"
	npx json -f package-lock.json -I -e "this.version = '$1'"
	zip -r ../tux-wp-child.zip . -x@.zip-exclude.lst
	exit 0
else
	exit 1
fi
