# [kachkaev.uk](https://kachkaev.uk) / [.ru](https://kachkaev.ru) source code

This repository contains the source code of my personal mini-website.
It represents a simple instance of a Next.js app with server components, API routes and domain-based internationalization.
Feel free to use this codebase to learn something new or to reuse various bits in your own projects.

## Key ingredients

- **[Next.js](https://nextjs.org)** (with `/app` directory) as the architecture framework
- **[React](https://reactjs.org)** to define the UI (server and client components)
- **[Tailwind CSS](https://tailwindcss.com)** to style the UI (including dark/light themes)
- **[FormatJS](https://formatjs.io)** to handle internationalization ([ICU](https://formatjs.io/docs/core-concepts/icu-syntax/) plurals etc.)
- **[Google Analytics](https://analytics.google.com)** to track website usage
- **[Axios](https://axios-http.com)**, **[Zod](https://zod.dev)** and **[Playwright](https://playwright.dev)** to update profile infos
- **[ESLint](https://eslint.org)**, **[Markdownlint](https://github.com/DavidAnson/markdownlint)**, **[Prettier](https://prettier.io)** and **[TypeScript](https://www.typescriptlang.org)** to statically check and autocorrect source files
- **[pnpm](https://pnpm.io)** to manage dependencies
- **[Docker](https://www.docker.com)** to generate a deployable production artifact
- **[Kubernetes](https://kubernetes.io)** to run the app in production
- **[GitHub Actions](https://github.com/features/actions)** to run [CI/CD](https://en.wikipedia.org/wiki/CI/CD) pipelines

## Project structure

The codebase is inspired by these Next.js examples:

- [app-dir-i18n-routing](https://github.com/vercel/next.js/tree/canary/examples/app-dir-i18n-routing)
- [with-tailwindcss](https://github.com/vercel/next.js/tree/canary/examples/with-tailwindcss)
- [with-typescript](https://github.com/vercel/next.js/tree/canary/examples/with-typescript)

The main web page renders a list of profiles and shows relevant stats.
The numbers are taken from a few [YAML](https://en.wikipedia.org/wiki/YAML) files that are stored locally.
Thanks to React server components, these files can be read directly by the Node.js process and there is no need to introduce any React state to re-hydrate profile infos on the client.
This simplifies the app architecture and reduces the amount of the JavaScript to download.

Profile infos are updated inside Next.js API routes.
A GET request to `/update-profiles/[profile-id]?[security-token]` scrapes a third-party service (e.g. GitHub, OpenStreetMap, etc.) and updates a corresponding YAML file.
Some profile infos are generated by making lightweight requests to JSON endpoints using [Axios](https://axios-http.com) and [Zod](https://zod.dev), but the most common approach involves using [Playwright](https://playwright.dev), a browser automation library.
Profiles are updated on a schedule (see [Deployment](#deployment) section).
Because API routes are public, a security token is introduced to prevent server abuse.

## Known issues

- **Internationalized (i18n) is hacky**  
  My go-to solution for internationalising Next.js pages is [`next-i18next`](https://www.npmjs.com/package/next-i18next).
  Because this package is incompatible with the `/app` directory (at least as of early March 2023), I have used a rather bare-bones approach inspired by the [app-dir-i18n-routing](https://github.com/vercel/next.js/tree/canary/examples/app-dir-i18n-routing) example.
  The current solution is not as polished as `next-i18next` when it comes to propagating translations to components, but it works well enough for my needs.
  I might consider following [i18next/next-13-app-dir-i18next-example](https://github.com/i18next/next-13-app-dir-i18next-example) in the future but I am generally waiting for this space to mature.

  In the meantime, I use [`@formatjs/intl`](https://www.npmjs.com/package/@formatjs/intl) to handle plurals, which is somewhat low-level and should not be done in Next.js apps.
  Ideally, I would like to have i18n resources available as React context and use components inside i18n strings (e.g. `Hello <a>world</a>!`).
  The latter is possible with [`<Trans />` component](https://react.i18next.com/latest/trans-component) in `react-i18next`, which I hope to use at some point.

- **Custom 404 page is implemented via `middleware.ts`**  
  As of early March 2023, Next.js [does not support](https://beta.nextjs.org/docs/api-reference/file-conventions/not-found) custom 404 pages inside the `/app` directory.
  Until a permanent solution is available, incoming requests are checked against `existingPathnamePatterns` in [`middleware.ts`](./middleware.ts).
  This enables custom 404 pages which are i18n-aware, but requires manual updates to `existingPathnamePatterns` each time a new app route is added.
  Thus, the workaround is error-prone, especially for apps that have a lot of routes.

- **No progress bar when navigating between pages**  
  I like using [`nprogress`](https://www.npmjs.com/package/nprogress) in apps with client-side navigation between pages.
  A progress bar improves the perceived performance of the app and makes it feel more responsive.
  Unfortunately, `nprogress` does not work well with Next.js apps that use server components.
  I hope to find a solution to this problem in the future.
  Related issues:
  - https://github.com/vercel/next.js/issues/45499
  - https://github.com/apal21/nextjs-progressbar/issues/86

## Local development

### Getting started

1.  Ensure you have [git](https://git-scm.com), [Node.js](https://nodejs.org) and [pnpm](https://pnpm.io) installed on your machine:

    ```sh
    git --version
    ## ≥ 2.30.0
    
    node --version
    ## ≥ 18.12.0
    
    pnpm --version
    ## ≥ 7.28.0
    ```

1.  Clone the repo from GitHub:

    ```sh
    cd PATH/TO/MISC/PROJECTS
    git clone https://github.com/kachkaev/website.git
    cd website
    ```

1.  Install dependencies:

    ```sh
    pnpm install
    ```

1.  Copy `.env` to `.env.local`:

    ```sh
    cp .env .env.local
    ```

    We will need `.env.local` later.
    Unlike `.env`, it is not tracked by git and is not committed to the repo.
    Because of that, .env.local` can be used to store secrets.

1.  Start Next.js in development mode:

    ```sh
    pnpm dev
    ```

    This will start the Next.js dev server on `http://localhost:3000`.
    Modifying source files will refresh the app.
    To stop running the dev server, press `ctrl+c`.

1.  If you want to try out a production copy of the app, build and run it like this:

    ```sh
    pnpm build
    pnpm start
    ```

### Updating profile infos

If you want to try updating profiles locally, you will need to set `UPDATE_PROFILE_SECURITY_TOKEN` in `.env.local`.

TODO

### Playing with i18n

TODO

## Deployment

TODO describe how to deploy the app

<img src="https://gitlab.com/kachkaev/website/uploads/a416ccf87b7a1cd2e2bb386f8109f936/thinking.png" alt="thinking meme face" width="120" />

### Docker

```sh
docker build --tag website .

docker run \
  --env-file=.env.local \
  --publish 3000:3000 \
  --rm \
  --volume $(pwd)/data:/data \
  website
```

### Kubernetes (K8S)

<img src="https://gitlab.com/kachkaev/website/uploads/c0799225fbfc40e2c493ed290bc345d1/doing.png" alt="concentrated meme face" width="120" />

#### Namespace

```sh
kubectl apply -f k8s/namespace.yaml
```

#### Secrets

```sh
FLICKR_USER_ID=??
FLICKR_API_KEY=??
kubectl create secret generic flickr-api \
  --from-literal=user_id=${FLICKR_USER_ID} \
  --from-literal=api_key=${FLICKR_API_KEY} \
  --namespace=website

UPDATE_PROFILE_SECURITY_TOKEN=??
UPDATE_PROFILE_PROXY_SERVER_URL=??
kubectl create secret generic update-profile \
  --namespace=website \
  --from-literal=security-token=${UPDATE_PROFILE_SECURITY_TOKEN} \
  --from-literal=proxy-server-url=${UPDATE_PROFILE_PROXY_SERVER_URL}
```

#### Persistent volume claim for data

```sh
kubectl apply -f k8s/pvc.yaml
```

#### The app (deployment, service, ingress)

```sh
kubectl apply -f k8s/app.yaml
```

#### Cron jobs (recurring profile updates)

```sh
kubectl apply -f k8s/cron-jobs.yaml
```

All done!

<img src="https://gitlab.com/kachkaev/website/uploads/83aa65c795d488f754a34a4e61d57cfd/done.png" alt="happy meme face" width="120" />

To manually update the app deployment, this commands can be used:

```sh
NEW_IMAGE_TAG=$(git rev-parse --short HEAD)
kubectl set image --namespace=website deployment/website-app main=ghcr.io/kachkaev/website:${NEW_IMAGE_TAG}
```

Alternatively, it is possible to modify docker image urls directly in yaml files and then run `kubectl apply ...` again.
In any case, the updates will run with zero downtime because of their rolling nature.

The real production cluster contains a couple of other microservices such as for redirecting www domains to non-www ones, but these yamls are omitted from the repository to keep it focused.

## Project history

My mini-website has been live since 2009.
You can find its historic snapshots on [📜 web.archive.org](https://web.archive.org):

- Russian version: [📜 kachkaev.ru](https://web.archive.org/web/*/kachkaev.ru) (2009+)
- English version: [📜 en.kachkaev.ru](https://web.archive.org/web/*/en.kachkaev.ru) (2010–2022), [📜 kachkaev.uk](https://web.archive.org/web/*/kachkaev.uk) (2022+)

I moved the English version to the `.uk` domain zone in 2022 to mitigate a potential loss of my primary hostname.
When Russia started its [‘special military operation’ in Ukraine](https://en.wikipedia.org/wiki/On_conducting_a_special_military_operation), I assumed a non-zero chance of ‘special civil servants’ taking over `kachkaev.ru` because of my ‘special attitude and activities’.

The first open-source version of this project was crafted in 2017 and it became my first TypeScript-enabled Next.js app.
This was before Next.js implemented [API routes](https://nextjs.org/docs/api-routes/introduction), so I had to split the app into two microservices: `frontend` and `graphql-server`.
I used [GitLab](https://gitlab.com) to host the repositories and to run CI/CD pipelines (GitHub Actions did not exist until 2019). You can still find the original open-source repositories at:

- [gitlab.com/kachkaev/website](https://gitlab.com/kachkaev/website)
- [gitlab.com/kachkaev/website-graphql-server](https://gitlab.com/kachkaev/website-graphql-server)
- [gitlab.com/kachkaev/website-frontend](https://gitlab.com/kachkaev/website-frontend)

When Next.js [announced](https://nextjs.org/blog/next-13) the new `/app` directory in late 2022, I saw this as an opportunity to refactor my mini-website and to experiment with [React server components](https://nextjs.org/docs/advanced-features/react-18/server-components).
So when I got a couple of spare weekends in early 2023, I replaced three GitLab repos with [github.com/kachkaev/website](https://github.com/kachkaev/website).
Doing so simplified things a lot!

## Getting involved

This is a pretty small personal project, so frankly speaking, there is not much to collaborate on.
Nevertheless, you might want to learn something new by playing with this repo or even decide to make your own (much better) website based on my code.
If you have questions, feel free to ask me anything by creating a new [GitHub issue](https://github.com/kachkaev/website/issues) or by [sending an email](mailto:alexander@kachkaev.uk)!

The repository is licensed under [BSD-3-Clause license](./LICENSE.md), so you are free to do whatever you want with this stuff!

<img src="https://gitlab.com/kachkaev/website/uploads/749d5f4679392be346e7e986f2e5e5e1/thumbs-up.png" alt="thumbs-up meme face" width="160" />
