#!/bin/bash

cd photopro-app/api
python3 -m flask run --no-debugger
cd ..
npm start