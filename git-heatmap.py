#!/usr/bin/env python3

# https://bastian.rieck.me/blog/posts/2015/heat_maps_git/

import argparse
import datetime
import subprocess
import os
import sys

parser = argparse.ArgumentParser(description="Create heatmaps of git commits")
parser.add_argument("--author",  help="Author whose git commits are to be counted", type=str)
parser.add_argument("directory", help="git directory to use", metavar="DIR")

arguments = parser.parse_args()

directory = os.path.join(arguments.directory, ".git")
author    = arguments.author or ""

commits   = subprocess.check_output( ["git", "--git-dir=%s" % directory,
                                             "log",
                                             "--pretty=format:%ct",
                                             "--author=%s" % author ] )
counts = [ [0]*24 for _ in range(7) ]

for commit in commits.decode().split():
    d   = datetime.datetime.fromtimestamp(int(commit))
    row = d.weekday()
    col = d.hour

    counts[row][col] += 1

print('set size ratio 7.0/24.0\n'
      'set xrange [-0.5:23.5]\n'
      'set yrange [-0.5: 6.5]\n'
      'set xtics 0,1\n'
      'set ytics 0,1\n'
      'set xtics offset -0.5,0.0\n'
      'set tics scale 0,0.001\n'
      'set mxtics 2\n'
      'set mytics 2\n'
      'set grid front mxtics mytics linetype -1 linecolor rgb \'black\'\n'
      'plot "-" matrix with image notitle')
for row in range(7):
    for col in range(24):
        print("%d " % counts[row][col], end="")
    print("")
print("e")
