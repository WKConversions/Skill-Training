#!/usr/bin/env bash
# The delivery files from out/final.mp4 (the blurred render with the mix, made with library/scripts/render_chunks.sh):
# TV-range BT.709 yuv420p video (Remotion writes full range), the finished mix as it is (already −15 LUFS).
#   bash scripts/deliver.sh
set -euo pipefail
cd "$(dirname "$0")/.."
color=(-colorspace bt709 -color_primaries bt709 -color_trc bt709)
ffmpeg -v error -y -i out/final.mp4 -i public/audio/mix.wav -map 0:v -map 1:a \
  -vf "scale=in_range=full:out_range=tv,format=yuv420p" "${color[@]}" -c:v libx264 -preset slow -crf 18 -profile:v high \
  -c:a aac -b:a 256k -ar 48000 -movflags +faststart -shortest out/KB-desk-1080p.mp4
web() {   # 720p for the website and LinkedIn: with the mix ("sound"), or without it for autoplay ("")
  local audio=(-an)
  [ -n "$1" ] && audio=(-i public/audio/mix.wav -map 0:v -map 1:a -c:a aac -b:a 128k -ar 48000)
  ffmpeg -v error -y -i out/final.mp4 "${audio[@]}" \
    -vf "scale=1280:720:in_range=full:out_range=tv:flags=lanczos,format=yuv420p" "${color[@]}" -c:v libx264 -preset slow -crf 23 \
    -profile:v high -movflags +faststart -shortest "$2"
}
web sound out/KB-desk-web.mp4
web "" out/KB-desk-web-muted.mp4
ls -la out/KB-desk-*.mp4
