# Development Guide

### Linting

We use [eslint](https://eslint.org/) along with [airbnb](https://github.com/airbnb/javascript) js style guide and [prettier](https://prettier.io/) to help you write succident and beautiful code!

### Typescript

In modern World of javascript, [Typescript](https://www.typescriptlang.org/) becomes a must, since it allows you to build typesafe js applications with less efforts, making them more reliable!

### Unit Test

With [jest](https://jestjs.io/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/), you are allowed to build unit-tests in a smooth way!

### Lint Staged

[Lint Staged](https://github.com/okonet/lint-staged) is a tool that allows us to only play with the changes added to **"staging"** status in git, this is helpful when you only want to test to style-check the chagnes that have been pushed in staging.

### Hustky

Worrying about commiting shit code by accident ? [Husky](https://typicode.github.io/husky/#/) is right here for you, with it you can easily create git hooks, e.g: Building a **"pre-commit"** hook.

## Commands

### Installation

```bash
yarn
```

### Development

```bash
yarn dev
```

### Building Assets

Run this command to build bundles.

```bash
yarn build
```

### Hosting Dynamic Content (Server-Side Rendering)

```bash
yarn start
```

### Building Tests

```bash
yarn test:watch
```

### Sytle Checks

```bash
yarn lint
```

### Pre Commit Hook

Please make .husky/pre-commit executable

```bash
chmod +x .husky/pre-commit
```

## Storybook

Please run these two commands in separate tabs

```bash
yarn tailwind:watch
```

```bash
yarn storybook
```

## E2E Tests

Not yet decided which tool to go with [Cypress](https://www.cypress.io/) of [Playwright](https://playwright.dev/)?.
