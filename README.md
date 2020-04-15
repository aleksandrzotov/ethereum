## Local deployment

### Installation

1. Install `Docker`
2. `make rebuild start` for building and starting the whole system
3. `make db-init` to init database, after
4. `npm i` in root folder for eslint work in IDE

### Database

1. `make db-migrate` to run migrations
Important! Execute the `make db-init` or `make db-migrat` command in a separate console tab after the container with the application has started and print `database system is ready to accept connections`

### Starting application

1. `make start` for starting the whole system

### Curl example:

getting richest recipient - `curl -i http://localhost:9000/recipients/richest`

### Run script for getting richest recipient over the last 100 blocks

`node searchRichestRecipient.js`
