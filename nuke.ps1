Get-ChildItem .\backend\api\migrations -Exclude __init__.py | Remove-Item
Remove-Item -Path .\backend\db.sqlite3
Get-ChildItem .\backend\media | Remove-Item
echo "Database nuked. You need to delete browser cookies manually."
pause
