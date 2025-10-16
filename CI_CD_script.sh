#!/bin/bash
sudo git fetch https://mdl0245:$1/Nuclear-CodesUNT/Nuclear-codes-NIL-App.git mdl0245-CI
sudo git pull https://mdl0245:$1/Nuclear-CodesUNT/Nuclear-codes-NIL-App.git mdl0245-CI
sudo systemctl restart NIL_app_frontend.service && sudo systemctl restart NIL_app_backend.service