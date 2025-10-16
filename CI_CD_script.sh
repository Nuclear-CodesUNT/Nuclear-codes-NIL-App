#!/bin/bash
sudo git fetch
mdl0245
$1
sudo git pull
mdl0245
$1
sudo systemctl restart NIL_app_backend.service
sudo systemctl restart NIL_app_frontend.service