#!/bin/bash
sudo git fetch
echo mdl0245
echo $1
sudo git pull
echo mdl0245
echo $1
sudo systemctl restart NIL_app_frontend.service && sudo systemctl restart NIL_app_backend.service