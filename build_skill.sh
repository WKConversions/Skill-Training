#!/bin/sh
# Builds senior-motion-designer.zip: the skill (SKILL.md) with the whole library bundled in library/,
# without the sound library's audio files (size; some sounds may never be published).
set -e
cd "$(dirname "$0")"
rm -rf dist && mkdir -p dist/senior-motion-designer
cp senior-motion-designer/SKILL.md dist/senior-motion-designer/
cp -R library dist/senior-motion-designer/library
find dist/senior-motion-designer/library \( -name '*.wav' -o -name '*.mp3' -o -name '*.flac' -o -name '*.ogg' \
  -o -name '*.aif' -o -name '*.aiff' -o -name '*.m4a' -o -name '__pycache__' -o -name '.DS_Store' \) -prune -exec rm -rf {} +
rm -f senior-motion-designer.zip
(cd dist && zip -qr ../senior-motion-designer.zip senior-motion-designer)
rm -rf dist
unzip -l senior-motion-designer.zip | tail -1
