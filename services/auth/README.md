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
| [Docker](https://www.docker.com/) | A platform designed to help developers build, share, and run container applications | `27.2.0` |
| [Fastify](https://fastify.dev/) | Fast and low overhead web framework, for Node.js | `5.0.0` |
| [Fluent-json-schema](https://github.com/fastify/fluent-json-schema/tree/master#fluent-json-schema) | Fluent API to generate JSON schemas | `5.0.0` |
| [Fastify-swagger](https://github.com/fastify/fastify-swagger#fastifyswagger) | Serving [Swagger (OpenAPI v2)](https://swagger.io/specification/v2/) or [OpenAPI v3](https://swagger.io/specification) schemas | `9.0.0` |
| [Jest](https://jestjs.io/) | JavaScript Testing Framework | `29.7.0` |
| [Faker](https://fakerjs.dev/) | Generate massive amounts of fake (but realistic) data for testing and development | `9.0.3` |
| [Undici](https://github.com/nodejs/undici) | An HTTP/1.1 client, written from scratch for Node.js. | `6.19.8` |
| [Fast-jwt](https://github.com/nearform/fast-jwt#fast-jwt) | Fast JSON Web Token implementation. | `4.0.5` |

## How to set up

> **NOTE:** Before installing dependencies and running the project, please install the [`pnpm`](https://pnpm.io/installation) dependency manager.

1. Download project (i.e. service) dependencies using the following command:

    ```bash
    pnpm install
    ```

2. To create and verify authorization JWT tokens, you need to generate `EdDSA` keys using the following command:

    ```bash
    $ openssl genpkey -algorithm ED25519 | tee ./ed25519.pem
    -----BEGIN PRIVATE KEY-----
    MC4CAQAwBQYDK2VwBCIEICrDqHiXizmAHQYFnwX6dE/qP8KblxKXYEucmVZTbMwy
    -----END PRIVATE KEY-----

    $ openssl pkey -in ./ed25519.pem -pubout | tee ./ed25519.pub.pem
    -----BEGIN PUBLIC KEY-----
    MCowBQYDK2VwAyEA/DIbglGpx4BhW+yFV3q8A7xgmrIS0QtPU1ABUMps+UM=
    -----END PUBLIC KEY-----
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

## How to Debug the Service in Visual Studio Code

1. Place some breakpoints in the TypeScript source code, where you want to debug.

2. Open the Command Palette in Visual Studio Code by pressing `Ctrl + Shift + P` (Windows/Linux) or `Cmd + Shift + P` (macOS).

3. Type `Debug: Select and Start Debugging` in the Command Palette and select `Node.js...` from the dropdown list.

4. In the dropdown list, choose the following option: `Run Script: run:dev`

    - It will automatically launch a `JavaScript Debug Terminal`
    - It compiles TypeScript using `esbuild` utility
    - By the left source maps in the compiled code, it connect breakpoint from TypeScript source code to compiled JavaScript code in `dist` folder

### How to see available API endpoints

1. Launch the service in development mode according to the
   [steps](#how-to-run) described above.

2. Service integrated with [Swagger UI](https://swagger.io/tools/swagger-ui/), so to see available API endpoints, open the browser and navigate to the following URL: `http://<SERVICE_HOST>:<SERVICE_PORT>/swagger/docs`

## References

**Node Platform:**

- [CJS and ESM Modules in Node.js](https://vectoscalar.com/cjs-and-esm-modules-in-node-js-a-comparison-of-advantages-and-disadvantages/#:~:text=They%20are%20simple%20to%20use,load%20faster%20than%20CJS%20modules.)
- [Force adding `.js` extension when importing from `.ts` files](https://github.com/microsoft/vscode/issues/131837)
- [TypeScript runtime comparisons](https://github.com/privatenumber/ts-runtime-comparison?tab=readme-ov-file#typescript-runtime-comparisons)
