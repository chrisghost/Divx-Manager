ff=$(ffmpeg -i "$@" 2>&1)
d="${ff#*Duration: }"
echo "${d%%,*}"
