# Remix Nobu Stack

![The Remix Blues Stack](https://repository-images.githubusercontent.com/461012689/37d5bd8b-fa9c-4ab0-893c-f0a199d5012d)

Learn more about [Remix Stacks](https://remix.run/stacks).

```sh
npx create-remix@latest --template arolitec/remix-nobu-stack
# or
yarn create remix --template arolitec/remix-nobu-stack
```

## What's in the stack

- Healthcheck endpoint usable with Docker Compose
- [GitHub Actions](https://github.com/features/actions) for typecheck, lint and
  tests
- Email/Password Authentication with
  [remix-auth](https://github.com/sergiodxa/remix-auth)
- Database ORM with [Prisma](https://prisma.io)
- Styling with [Tailwind](https://tailwindcss.com/) and
  [Daisy UI](https://daisyui.com/)
- End-to-end testing with [Cypress](https://cypress.io)
- Local third party request mocking with [MSW](https://mswjs.io)
- Unit testing with [Vitest](https://vitest.dev) and
  [Testing Library](https://testing-library.com)
- Code formatting with [Prettier](https://prettier.io)
- Linting with [ESLint](https://eslint.org)
- Static Types with [TypeScript](https://typescriptlang.org)

Not a fan of bits of the stack? Fork it, change it, and use
`npx create-remix --template your/repo`! Make it your own.

## Development

- First run this stack's `remix.init` script and commit the changes it makes to
  your project.

  ```sh
  yarn remix init
  git init # if you haven't already
  git add .
  git commit -m "Initialize project"
  ```

- Start the Postgres Database in [Docker](https://www.docker.com/get-started):

  ```sh
  yarn docker
  ```

  > **Note:** The npm script will complete while Docker sets up the container in
  > the background. Ensure that Docker has finished and your container is
  > running before proceeding.

- Initial setup:

  ```sh
  yarn setup
  ```

- Run the first build:

  ```sh
  yarn build
  ```

- Start dev server:

  ```sh
  yarn dev
  ```

This starts your app in development mode, rebuilding assets on file changes.

The database seed script creates a new user with some data you can use to get
started:

- Email: `admin@remix.run`
- Password: `remixiscool`

### Relevant code:

This is a simple app with a production-ready auth flow, a perfect foundation for
you to build a full stack app with Prisma and Remix and Daisy UI.

- creating users, and logging in and out
  [./app/routes/\_auth+](./app/routes/_auth+)
- user sessions, and verifying them
  [./app/utils/session.server.ts](./app/utils/session.server.ts)

## Deployment

This Remix Stack comes with two GitHub Actions that handle typecheck (if
TypeScript used), unit and integration tests run.

To add a Docker image building or automatic deployment step, just update the
workflow.

## GitHub Actions

We use GitHub Actions for continuous integration and deployment. Anything that
gets into the `main` branch will be deployed to production after running
tests/build/etc. Anything in the `dev` branch will be deployed to staging.

## Testing

### Playwright

We use [Playwright](https://playwright.dev) for our End-to-End tests in this
project. You'll find those in the `tests` directory. As you make changes, add to
an existing file or create a new file in the `tests/e2e` directory to test your
changes.

To run these tests in development, run `yarn test:e2e:dev` which will start the
dev server for the app as well as the Playwright UI. Make sure the database is
running in docker as described above.

We have a fixture for testing authenticated features without having to go
through the login flow:

```ts
login(email?: string, password?: string);
// you are now logged in as a new user
```

We also have a fixture to setup database which reset and seed it (internally run
`prisma migrate reset`):

```ts
test.beforeAll(() => setupDb())
```

That way, we can keep your local db clean and keep your tests isolated from one
another.

### Vitest

For lower level tests of utilities and individual components, we use `vitest`.
We have DOM-specific assertion helpers via
[`@testing-library/jest-dom`](https://testing-library.com/jest-dom).

### Type Checking

This project uses TypeScript. It's recommended to get TypeScript set up for your
editor to get a really great in-editor experience with type checking and
auto-complete. To run type checking across the whole project, run
`yarn typecheck`.

### Linting

This project uses ESLint for linting. That is configured in `.eslintrc.js`.

### Formatting

We use [Prettier](https://prettier.io/) for auto-formatting in this project.
It's recommended to install an editor plugin (like the
[VSCode Prettier plugin](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode))
to get auto-formatting on save. There's also a `yarn format` script you can run
to format all files in the project.
