venv\Scripts\Activate.ps1
Set-Location -Path .\backend
python manage.py makemigrations
python manage.py migrate
python manage.py initadmin
python manage.py setsocialapps
pause
