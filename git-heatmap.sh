#!/bin/bash
./git-heatmap.py . > git-heatmap.dat
echo "Heat map of git commit is created."
echo "Use gnuplot to process the .dat file with these commands:"
echo ""
echo "gnuplot"
echo "gnuplot > set terminal png"
echo "gnuplot > set output 'git-heatmap.png'"
echo "gnuplot > load 'git-heatmap.dat'"
echo "gnuplot > set output"
