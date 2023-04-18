# MPS Embed

An [oEmbed](http://oembed.com/) provider for embedding resources from the Harvard University Library. Based on Stanford's [SUL-Embed](https://github.com/sul-dlss/sul-embed)

* A HTML page here: https://localhost:23018/
* A Health Check page here: https://localhost:23018/healthcheck
* API:
  * https://localhost:23018/api/legacy?recordIdentifier=xxxx
  * https://localhost:23018/api/mps?urn=xxxx&manifestVersion=3

## Technology Stack
##### Language
NodeJS

##### Framework
Express

##### Development Operations
Docker Compose

## Local Development Environment Setup Instructions

### 1: Clone the repository to a local directory
```git clone git@gitlab.com:harvard-library-web-team/mps-embed.git```

### 2: Create app config

##### Create config file for environment variables
- Make a copy of the config example file `./env-example.txt`
- Rename the file to `.env`
- Replace placeholder values as necessary

*Note: The config file .env is specifically excluded in .gitignore and .dockerignore, since it contains credentials it should NOT ever be committed to any repository.*

### 4: Start

##### START

This command builds all images and runs all containers specified in the docker-compose-local.yml configuration.

```
docker-compose -f docker-compose-local.yml up --build --force-recreate
```

### 5: SSH into Container (optional)

##### Run docker exec to execute a shell in the container by name

Open a shell using the exec command to access the mps-embed container.

```
docker exec -it mps-embed bash
```

### 6: Stop

##### STOP AND REMOVE

This command stops and removes all containers specified in the docker-compose-local.yml configuration. This command can be used in place of the 'stop' and 'rm' commands.

```
docker-compose -f docker-compose-local.yml down
```

