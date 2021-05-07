#!/bin/bash
shopt -s extglob
rm ./backend/db.sqlite3
rm -r ./backend/api/migrations/!(__init__.py)
rm -r ./backend/media/*
echo "Database nuked."
