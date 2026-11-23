#!/usr/bin/env bash
# Phone-width (390px) screenshots of a page, in vertical segments.
# Headless Chrome enforces a ~500px minimum window, so the page is rendered inside a 390px iframe.
#
# Usage: tools/shot.sh <page relative to repo root> <out dir> [theme: light|dark] [segments, default 5]
#   e.g. tools/shot.sh v06/credit-default-swaps.html "$SCRATCH/shots" dark 6
# Output: <out dir>/<name>-<i>.png, each segment 1800 CSS px tall (3600px image).
set -euo pipefail
PAGE="$1"; OUT="$2"; THEME="${3:-light}"; SEGS="${4:-5}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
NAME="$(basename "$PAGE" .html)"
mkdir -p "$OUT"
for ((i = 0; i < SEGS; i++)); do
  OFF=$((i * 1750))
  cat > "$OUT/_harness.html" <<EOF
<html><body style="margin:0"><div style="width:390px;height:1800px;overflow:hidden">
<iframe id="f" src="file://$ROOT/$PAGE" style="width:390px;height:14000px;border:0;display:block;margin-top:-${OFF}px"></iframe></div>
<script>document.getElementById('f').onload=function(){try{this.contentDocument.documentElement.dataset.theme='$THEME'}catch(e){}}</script>
</body></html>
EOF
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --allow-file-access-from-files \
    --window-size=390,1800 --force-device-scale-factor=2 --virtual-time-budget=4000 \
    --screenshot="$OUT/$NAME-$i.png" "file://$OUT/_harness.html" 2>/dev/null
  echo "$OUT/$NAME-$i.png"
done
