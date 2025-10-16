#!/bin/bash
sudo git pull https://mdl0245:$1/Nuclear-CodesUNT/Nuclear-codes-NIL-App.git
sudo systemctl restart NIL_app_frontend.service && sudo systemctl restart NIL_app_backend.service