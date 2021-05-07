#!/bin/bash
echo "Start initializing..."
source venv/bin/activate
cd backend
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py initadmin
python3 manage.py setsocialapps
