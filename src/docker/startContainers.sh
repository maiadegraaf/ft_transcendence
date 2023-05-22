#!/bins/bash

set -x
cd /usr/src/app

ls -la
cd frontend
npm install
npm run build

cd ../backend
npm install
npm run build
npm run start:prod