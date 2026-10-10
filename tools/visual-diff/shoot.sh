#!/usr/bin/env bash
# Screenshot every page of two running copies of the site so they can be compared.
# usage: tools/visual-diff/shoot.sh <url-a> <url-b> <outdir>
#   e.g. tools/visual-diff/shoot.sh http://localhost:4321 http://localhost:4322 /tmp/vd
# Requires Google Chrome. Writes <page>_<width>_{a,b}.png for desktop (1280) and phone (375).
set -euo pipefail
A=${1:?url a}; B=${2:?url b}; OUT=${3:?outdir}
CHROME=${CHROME:-"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"}
mkdir -p "$OUT"
for w in 1280 375; do
  for pg in "" visit/ collections/ research/ get-involved/ about/; do
    n=$(echo "${pg:-home}" | tr '/' '_')
    for side in a b; do
      base=$([ $side = a ] && echo "$A" || echo "$B")
      "$CHROME" --headless=new --disable-gpu --hide-scrollbars --window-size=$w,14000 --force-device-scale-factor=1 \
        --host-resolver-rules="MAP maps.google.com 127.0.0.1:9" --virtual-time-budget=8000 \
        --screenshot="$OUT/${n}_${w}_${side}.png" "${base%/}/$pg" >/dev/null 2>&1
    done
  done
done
echo "Screenshots in $OUT. Next: python3 tools/visual-diff/diff.py $OUT"
