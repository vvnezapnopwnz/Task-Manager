install:
	npm install

dev-db:
	make db-migrate db-seed

db-migrate:
	npx knex migrate:latest

db-seed:
	npx knex seed:run

build:
	npm run build

start:
	heroku local -f Procfile

dev:
	heroku local -f Procfile.dev

start-backend:
	npx nodemon --exec npx babel-node server/bin/server.js

start-frontend:
	npx webpack serve

lint:
	npx eslint .

test:
	npm test -s
	
test-coverage:
	npm test -- --coverage --coverageProvider=v8
