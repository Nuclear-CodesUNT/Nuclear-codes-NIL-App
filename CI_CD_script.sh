#!/bin/bash
sudo git fetch https://mdl0245:$1@github.com/Nuclear-CodesUNT/Nuclear-codes-NIL-App.git main
sudo git pull https://mdl0245:$1@github.com/Nuclear-CodesUNT/Nuclear-codes-NIL-App.git main
sudo systemctl restart NIL_app_frontend.service && sudo systemctl restart NIL_app_backend.service