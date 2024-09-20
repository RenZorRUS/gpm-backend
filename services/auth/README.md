# GPM Authorization Service

## Overview

**GPM Authorization Service** - is a microservice responsible for managing user authentication and authorization.

It provides endpoints for user registration, login, and token refresh. The service uses JSON Web Tokens (JWT) to authenticate and authorize user requests.

## Dependencies

| Name | Description | Version |
| :-: | :-- | :-: |
| [Node.js](https://nodejs.org/en/learn/getting-started/introduction-to-nodejs#introduction-to-nodejs) | An open-source and cross-platform `JS` runtime environment | `20.16.0` |
| [Pnpm](https://pnpm.io/installation) | Fast, disk space efficient package manager | `9.10.0` |
| [TypeScript](https://www.typescriptlang.org/) | A strongly typed programming language that builds on JavaScript | `5.6.2` |
| [ESbuild](https://esbuild.github.io/getting-started/) | An extremely fast bundler for the web | `0.23.1` |
| [ESLint](https://eslint.org) | TypeScript statical code analyzer | `9.10.0` |
| [Prettier](https://prettier.io/) | An opinionated code formatter | `3.3.3` |
| [Husky](https://typicode.github.io/husky/) | Ultra-fast modern native `git` hooks | `9.1.6` |
| [Lint-staged](https://github.com/lint-staged/lint-staged#-lint-staged) | Linter for staged `git` files | `15.2.10` |
| [Docker](https://www.docker.com/) | A platform designed to help developers build, share, and run container applications | `27.2.0` |

## How to set up

> **NOTE:** Before installing dependencies and running the project, please install the [`pnpm`](https://pnpm.io/installation) dependency manager.

1. Download project (i.e. service) dependencies using the following command:

    ```bash
    pnpm install --ignore-scripts
    ```

2. Initialize [`Husky`](https://typicode.github.io/husky/get-started.html#install) pre-commit checker tool using the following commands:

    ```bash
    pnpm exec husky init
    ```

3. Copy the following content to the file `.husky/pre-commit`:

    ```bash
    # Git pre-commit hooks: https://typicode.github.io/husky/how-to.html
    # Git include a `-n`/`--no-verify` option to skip hooks
    cd services/auth
    pnpm test
    npx lint-staged
    ```

4. Update the `"prepare"` script in the `package.json` file to the following command:

    ```bash
    cd ../.. && husky services/auth/.husky
    ```

5. Link the pre-commit checker to your `git` repository using the following command:

    ```bash
    pnpm prepare
    ```

6. Clear the previous `.husky/_/husky.sh` content and copy the following content to the file `.husky/_/husky.sh`:

    ```bash
    #!/usr/bin/env sh
    . "$(dirname -- "$0")/_/husky.sh"

    npx lint-staged --allow-empty
    ```

## How to run

To run the authorization service, you have three possible options:

- **Using Docker Image:**

    > **NOTE:**
    >
    > - **Buildx** - is the client and the user interface for running and managing builds.
    > - **BuildKit** - is the server, or builder, that handles the build execution.

    1. Firstly, we should create a Docker image (i.e. a standalone, executable file used to create a Docker container) using `Dockerfile.prod` the following command:

        ```bash
        docker buildx build --file=Dockerfile.prod --tag=auth-service --target=prod .
        ```

        To list all Docker images, use the following command:

        ```bash
        docker image list
        ```

        To remove a specific Docker image, use the following command:

        ```bash
        docker image remove auth-service
        ```

    2. Then, based on the Docker image `auth-service`, we can create a container using the following command:

        ```bash
        docker container run --detach --env-file=.env --name=auth-service --rm --expose=8081 auth-service
        ```

        To list all Docker containers, use the following command:

        ```bash
        docker container list --all --latest
        ```

        To kill one or more containers, use the following command:

        ```bash
        docker container kill auth-service
        ```

- **Direct File Execution:**

    1. To run the service directly from the TypeScript source file, use the following command:

        ```bash
        pnpm run:dev:direct
        ```

        To run the service in development mode, after the source code was bundled into
        `dist/bundle.dev.mjs` by `esbuild`, use the following command:

        ```bash
        pnpm run:dev
        ```

        To run the service in production mode, after the source code was bundled into
        minified `dist/bundle.prod.mjs` by `esbuild`, use the following command:

        ```bash
        pnpm run:prod
        ```

- **JavaScript Bundle Execution:**

    1. Firstly, you should build a JavaScript bundle in development or production mode using one of the following commands:

        ```bash
        # Create bundle for development environment
        pnpm build:dev
        # Create bundle for production environment
        pnpm build:prod
        ```

        After script creates the bundle in `dist` folder, you can directly execute it using the following command:

        ```bash
        # Development bundle
        node dist/bundle.dev.mjs
        # Production bundle
        node dist/bundle.prod.mjs
        ```

## References

**Node Platform:**

- [CJS and ESM Modules in Node.js](https://vectoscalar.com/cjs-and-esm-modules-in-node-js-a-comparison-of-advantages-and-disadvantages/#:~:text=They%20are%20simple%20to%20use,load%20faster%20than%20CJS%20modules.)
- [Force adding `.js` extension when importing from `.ts` files](https://github.com/microsoft/vscode/issues/131837)
- [TypeScript runtime comparisons](https://github.com/privatenumber/ts-runtime-comparison?tab=readme-ov-file#typescript-runtime-comparisons)
