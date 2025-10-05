node joyless-parser/cli.js --input-dir joyless-content/ --things-output joyless.things.json

node joyless-yts/generate-filter.mjs --source json --input joyless.things.json --output joyless-yts/public/joyless.seen.json
