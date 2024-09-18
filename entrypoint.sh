#!/bin/sh

npm run migrate:deploy
# sync command update .snaplet/dataModel.json
npx @snaplet/seed sync

exec "$@"