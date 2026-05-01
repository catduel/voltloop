#!/usr/bin/env bash
set -euo pipefail

SOURCE_ICON="assets/voltloop-icon-1024.png"
ICONSET="ios/App/App/Assets.xcassets/AppIcon.appiconset"

if [ ! -f "$SOURCE_ICON" ]; then
  echo "Missing $SOURCE_ICON"
  exit 1
fi

mkdir -p "$ICONSET"
rm -f "$ICONSET"/*.png "$ICONSET"/Contents.json

make_icon() {
  local size="$1"
  local filename="$2"
  sips -z "$size" "$size" "$SOURCE_ICON" --out "$ICONSET/$filename" >/dev/null
}

make_icon 40 "AppIcon-20@2x.png"
make_icon 60 "AppIcon-20@3x.png"
make_icon 58 "AppIcon-29@2x.png"
make_icon 87 "AppIcon-29@3x.png"
make_icon 80 "AppIcon-40@2x.png"
make_icon 120 "AppIcon-40@3x.png"
make_icon 120 "AppIcon-60@2x.png"
make_icon 180 "AppIcon-60@3x.png"
make_icon 20 "AppIcon-iPad-20@1x.png"
make_icon 40 "AppIcon-iPad-20@2x.png"
make_icon 29 "AppIcon-iPad-29@1x.png"
make_icon 58 "AppIcon-iPad-29@2x.png"
make_icon 40 "AppIcon-iPad-40@1x.png"
make_icon 80 "AppIcon-iPad-40@2x.png"
make_icon 76 "AppIcon-iPad-76@1x.png"
make_icon 152 "AppIcon-iPad-76@2x.png"
make_icon 167 "AppIcon-iPad-83.5@2x.png"
make_icon 1024 "AppIcon-1024.png"

cat > "$ICONSET/Contents.json" <<'JSON'
{
  "images": [
    {
      "idiom": "iphone",
      "size": "20x20",
      "scale": "2x",
      "filename": "AppIcon-20@2x.png"
    },
    {
      "idiom": "iphone",
      "size": "20x20",
      "scale": "3x",
      "filename": "AppIcon-20@3x.png"
    },
    {
      "idiom": "iphone",
      "size": "29x29",
      "scale": "2x",
      "filename": "AppIcon-29@2x.png"
    },
    {
      "idiom": "iphone",
      "size": "29x29",
      "scale": "3x",
      "filename": "AppIcon-29@3x.png"
    },
    {
      "idiom": "iphone",
      "size": "40x40",
      "scale": "2x",
      "filename": "AppIcon-40@2x.png"
    },
    {
      "idiom": "iphone",
      "size": "40x40",
      "scale": "3x",
      "filename": "AppIcon-40@3x.png"
    },
    {
      "idiom": "iphone",
      "size": "60x60",
      "scale": "2x",
      "filename": "AppIcon-60@2x.png"
    },
    {
      "idiom": "iphone",
      "size": "60x60",
      "scale": "3x",
      "filename": "AppIcon-60@3x.png"
    },
    {
      "idiom": "ipad",
      "size": "20x20",
      "scale": "1x",
      "filename": "AppIcon-iPad-20@1x.png"
    },
    {
      "idiom": "ipad",
      "size": "20x20",
      "scale": "2x",
      "filename": "AppIcon-iPad-20@2x.png"
    },
    {
      "idiom": "ipad",
      "size": "29x29",
      "scale": "1x",
      "filename": "AppIcon-iPad-29@1x.png"
    },
    {
      "idiom": "ipad",
      "size": "29x29",
      "scale": "2x",
      "filename": "AppIcon-iPad-29@2x.png"
    },
    {
      "idiom": "ipad",
      "size": "40x40",
      "scale": "1x",
      "filename": "AppIcon-iPad-40@1x.png"
    },
    {
      "idiom": "ipad",
      "size": "40x40",
      "scale": "2x",
      "filename": "AppIcon-iPad-40@2x.png"
    },
    {
      "idiom": "ipad",
      "size": "76x76",
      "scale": "1x",
      "filename": "AppIcon-iPad-76@1x.png"
    },
    {
      "idiom": "ipad",
      "size": "76x76",
      "scale": "2x",
      "filename": "AppIcon-iPad-76@2x.png"
    },
    {
      "idiom": "ipad",
      "size": "83.5x83.5",
      "scale": "2x",
      "filename": "AppIcon-iPad-83.5@2x.png"
    },
    {
      "idiom": "ios-marketing",
      "size": "1024x1024",
      "scale": "1x",
      "filename": "AppIcon-1024.png"
    }
  ],
  "info": {
    "version": 1,
    "author": "xcode"
  }
}
JSON
