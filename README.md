# Gamified Personal Manager Backend (GPMB)

## Overview

**Gamified Personal Manager (GPM)** - is an app designed to enhance productivity and personal growth through gamification principles.

By transforming daily tasks and goals into engaging challenges, GPM encourages users to develop positive habits, stay organized, and achieve their personal and professional objectives in a fun and interactive way.

## Services

- [Authorization Service](./services/auth/README.md)

## Dependencies

| Name | Description | Version |
| :-: | :-- | :-: |
| [Docker](https://www.docker.com/) | A platform designed to help developers build, share, and run container applications | `27.2.0` |
| [Docker Compose](https://docs.docker.com/compose/) | A tool for defining and running multi-container applications | `2.29.2` |

## How to install

1. **Clone the repository** using the following command:

    ```bash
    # HTTPS
    git clone https://github.com/RenZorRUS/gpm-backend.git
    # SSH
    git clone git@github.com:RenZorRUS/gpm-backend.git
    ```

## How to run

> **NOTE:** Before running the GPM backend, please install [Docker](https://docs.docker.com/get-started/get-docker/) platform.

1. Run multiple GPM backend `Docker` containers using the following command:

    ```bash
    docker compose up --detach --force-recreate --remove-orphans
    ```

2. To shutdown the GPM backend `Docker` containers, use the following command:

    ```bash
    docker compose down --remove-orphans --volumes
    ```

## References

**Programming Languages:**

- [JavaScript Tutorial](https://javascript.info/)
- [TypeScript](https://www.typescriptlang.org/)

**Docker:**

- [10 best practices to containerize Node.js](https://snyk.io/blog/10-best-practices-to-containerize-nodejs-web-applications-with-docker/)
- [How to Use the Postgres Docker Official Image](https://www.docker.com/blog/how-to-use-the-postgres-docker-official-image/)
