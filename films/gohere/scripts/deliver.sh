#!/usr/bin/env bash
# The delivery files from out/final-raw.mp4 (the blurred render, made with library/scripts/render_chunks.sh):
# TV-range BT.709 yuv420p video (Remotion writes full range), the finished mix as it is (already −15 LUFS).
#   bash scripts/deliver.sh
set -euo pipefail
cd "$(dirname "$0")/.."
color=(-colorspace bt709 -color_primaries bt709 -color_trc bt709)
full() {  # 1080p master with one music version
  ffmpeg -v error -y -i out/final-raw.mp4 -i "public/audio/mix-$1.wav" -map 0:v -map 1:a \
    -vf "scale=in_range=full:out_range=tv,format=yuv420p" "${color[@]}" -c:v libx264 -preset slow -crf 18 -profile:v high \
    -c:a aac -b:a 256k -ar 48000 -movflags +faststart -shortest "$2"
}
web() {   # 720p for the website: with the mix ("sound"), or without it for autoplay ("")
  local audio=(-an)
  [ -n "$1" ] && audio=(-i public/audio/mix-found.wav -map 0:v -map 1:a -c:a aac -b:a 128k -ar 48000)
  ffmpeg -v error -y -i out/final-raw.mp4 "${audio[@]}" \
    -vf "scale=1280:720:in_range=full:out_range=tv:flags=lanczos,format=yuv420p" "${color[@]}" -c:v libx264 -preset slow -crf 23 \
    -profile:v high -movflags +faststart -shortest "$2"
}
full found out/GoHere-hero-1080p.mp4
full composed out/GoHere-hero-1080p-composed-music.mp4
web sound out/GoHere-hero-web.mp4
web "" out/GoHere-hero-web-muted.mp4
ls -la out/GoHere-hero-*.mp4
