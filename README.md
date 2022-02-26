# Next Boilerplate 2022

This [Next.js](https://nextjs.org/) boilerplate 2022 allows you to kick off your new project with all necessary tools for building a large-scale client-side web app.

![Vercel](https://vercelbadge.vercel.app/api/DumDumGeniuss/dumdum-next-boilerplate-2022)

## Features

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

### i18n

i18n, A.K.A [Internationalization and localization](https://en.wikipedia.org/wiki/Internationalization_and_localization), is a **"must-to-implement"** feature in your application when you want to target customers in different languages.

In this repository, we use [next-i18next](https://github.com/isaachinman/next-i18next) that helps implement i18n in next.js!

### TailwindCSS

Tired of using opinioated **"UI libraries"** or build-from-scratch **"styled components"**? Let's try [TailwindCSS](https://tailwindcss.com/) which provides a bunch of tiny but helpful **"utility classes"**, allowing a blanced way of styling your elements!

### Redux

Loose-coupling is always a goal we want to achieve in software development, with [Redux](https://redux.js.org/), you can keep your data flow out of box but still make your data accessible by your components.

With the helps of [next-redux-wrapper](https://github.com/kirill-konshin/next-redux-wrapper) and [redux toolkit](https://redux-toolkit.js.org/), we can smoothly integrate redux to our next.js without sacrificing readability and flexibility!

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

Coming soon, maybe.

## E2E Tests

Not yet decided which tool to go with [Cypress](https://www.cypress.io/) of [Playwright](https://playwright.dev/)?.
