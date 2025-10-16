#!/bin/bash

sudo git fetch
exec echo mdl0245
exec echo $1
sudo git pull
exec echo mdl0245
exec echo $1
sudo systemctl restart NIL_app_frontend.service && sudo systemctl restart NIL_app_backend.service