# 0verMalaysiaSpring
馬春班

## Contributing
### Install Dependencies
```
git clone https://github.com/0verseas/0verMalaysiaSpring.git
cd 0verMalaysiaSpring
npm install
```
### Setup
```
cp src/env.js.example src/env.js
```
edit the config file in `src/env.js`

### Testing
```
$ npm run serve
```

### Building
```
$ npm run build
```

## Docker 🐳
1. Install [Docker](https://docs.docker.com/engine/install/) & [Docker Compose](https://docs.docker.com/compose/install/)
2. Edit docker compose file: `docker/docker-compose.yaml`
2. `cp docker/.env.example docker/.env` and edit it (if you need).
3. If static file doesn't yet be built, you should build it before running docker.
3. `cd docker && docker-compose up -d`
