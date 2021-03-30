#!/bin/bash

ROOT=$(cd "$(dirname "$0")" ; cd ..; pwd -P )

SCRIPT=$ROOT/main.js

TEST=$ROOT/test

TMP_EXPLODED_EPUBS=$TEST/tmp/exploded-epubs

EXPECTED=$TEST/expected/exploded-epubs
FIXTURES=$TEST/fixtures/exploded-epubs

function clean() {
    rm -fr $TMP_EXPLODED_EPUBS/*
    touch $TMP_EXPLODED_EPUBS/.gitkeep
}

function setup() {
    echo "Copying fixtures into tmp..."
    cp -pr $FIXTURES/* $TMP_EXPLODED_EPUBS/
}

clean

setup

node $SCRIPT

diff --exclude .gitkeep -r $EXPECTED $TMP_EXPLODED_EPUBS

if [ $? -eq 0 ]
then
  echo 'OK'
else
  echo 'FAIL'
fi



