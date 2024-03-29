# [kachkaev.uk](https://kachkaev.uk) / [.ru](https://kachkaev.ru)

This repository contains the source code of my personal mini-website.
It represents a simple instance of a&nbsp;Next.js app with server components, API routes and domain-based internationalization.
Feel free to explore this repository to learn something new or even to reuse its code in your own projects.

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
This simplifies the architecture and reduces the amount of the JavaScript to for browsers to download.

Profile infos are updated inside Next.js API routes.
A GET request to `/update-profiles/[profile-name]?[security-token]` scrapes a third-party service (e.g. GitHub, OpenStreetMap, etc.) and updates a&nbsp;corresponding YAML file.
Some profile infos are generated by making lightweight HTTP requests to JSON endpoints using [Axios](https://axios-http.com) and [Zod](https://zod.dev).
However, the most common approach involves using [Playwright](https://playwright.dev) which is a browser automation library.
This approach is used when it is easier to scrape a web page than to interact with an official third-party&nbsp;API.

Profiles are updated on a schedule (see [Deployment](#deployment) section).
Because `/update-profiles/*` endpoints are public, a security token is introduced to prevent unauthorised requests.

## Known issues

- **Internationalized (i18n) is hacky**  
  My go-to solution for internationalising Next.js pages is [`next-i18next`](https://www.npmjs.com/package/next-i18next).
  Because this package is incompatible with the `/app` directory (at least as of early March 2023), I have used a rather bare-bones approach inspired by the [app-dir-i18n-routing](https://github.com/vercel/next.js/tree/canary/examples/app-dir-i18n-routing) example.
  The current solution is not as polished as `next-i18next` when it comes to propagating translations to components, but it works well enough for my needs.
  I might consider following [i18next/next-13-app-dir-i18next-example](https://github.com/i18next/next-13-app-dir-i18next-example) in the future but I am generally waiting for this space to mature.

  In the meantime, I use [`@formatjs/intl`](https://www.npmjs.com/package/@formatjs/intl) to handle plurals, which is somewhat low-level and should not be done without a wrapper in a Next.js app.
  Ideally, I would like to have i18n resources available as React context and use components inside i18n strings (e.g. `Hello <a>world</a>!`).
  The latter is possible with [`<Trans />` component](https://react.i18next.com/latest/trans-component) in `react-i18next`, which I hope to use at some point.

- **Custom 404 page is implemented via `middleware.ts`**  
  As of early March 2023, Next.js [does not support](https://beta.nextjs.org/docs/api-reference/file-conventions/not-found) custom 404 pages inside the `/app` directory.
  Until a&nbsp;permanent solution is available, incoming requests are checked against `existingPathnamePatterns` in&nbsp;[`middleware.ts`](./middleware.ts).
  This enables custom 404 pages which are i18n-aware, but requires manual updates to `existingPathnamePatterns` each time a new app route is added.
  Thus, the current workaround is error-prone, especially for apps that have a lot of routes.

- **Progress bar for page navigation may need improvement**  
  I like using [`nprogress`](https://www.npmjs.com/package/nprogress) in apps with client-side navigation between pages.
  A progress bar improves the perceived performance of the app and makes it feel more responsive.
  Unfortunately, established approaches to integrating `nprogress` with Next.js do not work with server components.

  I hope to find a good solution to this problem in the future, but in the meantime, I have implemented a custom solution in [`app/[locale]/layout/next-app-nprogress.tsx`](app/[locale]/layout/next-app-nprogress.tsx).

  Related issues:

  - https://github.com/vercel/next.js/issues/45499
  - https://github.com/apal21/nextjs-progressbar/issues/86

## Local development

### Getting started

1.  Open a command line and ensure you have [git](https://git-scm.com) and [Node.js](https://nodejs.org) installed:

    ```sh
    git --version
    ## ≥ 2.30.0
    
    node --version
    ## ≥ 18.12.0
    
    corepack --version
    ## ≥ 0.14.0, comes with Node.js
    ```

1.  Clone the repo from GitHub:

    ```sh
    cd PATH/TO/MISC/PROJECTS ## replace example path with a directory of your choice
    git clone https://github.com/kachkaev/website.git
    cd website
    ```

1.  Prepare [pnpm](https://pnpm.io) for dependency management:

    ```sh
    corepack enable && corepack prepare --activate
    
    pnpm --version
    ## same as in package.json → packageManager
    ```

1.  Install dependencies:

    ```sh
    pnpm install
    ```

1.  Copy `.env` to `.env.local`:

    ```sh
    cp .env .env.local
    ```

    Unlike `.env`, `.env.local` is not tracked by git and can therefore be used to store sensitive environment variables (security tokens, etc.).
    We will need this file later.

1.  Start Next.js in development mode:

    ```sh
    pnpm dev
    ```

    If you see a home page with empty profiles at [localhost:3000](http://localhost:3000), congratulations!
    Modifying source files will automatically refresh the app.
    To stop running the dev server, press `ctrl+c`.

1.  If you want to try a copy of the app that is optimized for production, you can build and start it like this:

    ```sh
    pnpm build
    pnpm start
    ```

### Updating profile infos

To be able to update profile infos locally, you will need to define an environment variable named `UPDATE_PROFILE_SECURITY_TOKEN` .
To set it to `123`, add the following line to `.env.local`:

```sh
UPDATE_PROFILE_SECURITY_TOKEN=123
```

Once you have saved `.env.local` and have restarted the dev server (`pnpm dev`), you can update profile infos by making GET requests to `/update-profiles/[profile-name]?123`.
If a request is successful, the app will create or update a corresponding file named `data/profile-infos/[profile-name].yaml`.
The contents of this file are then used to render profile info on the home page.

The list of available profiles can be found in [`app/[locale]/update-profiles/`](app/[locale]/update-profiles/).
Note that updating Flickr profile requires API authentication, so requests to `/update-profiles/flickr?123` will fail without valid values for `FLICKR_USER_ID` and `FLICKR_API_KEY` inside `.env.local`.

### Playing with i18n

Internationalization (i18n) is setup in [`i18n-config.ts`](i18n-config.ts), [`i18n-server.ts`](i18n-server.ts) and [`middleware.ts`](middleware.ts).

By default, requests to [localhost:3000](http://localhost:3000) map to the `en` locale and requests to [ru.localhost:3000](http://ru.localhost:3000) map to the `ru` locale.
You can change this by setting `BASE_URL_RU` and `BASE_URL_EN` in `.env.local`.
For example, if you add `BASE_URL_RU=http://localhost:3000`, requests to [localhost:3000](http://localhost:3000) will be mapped to the `ru` locale.
Just like with any other changes in `.env.local`, you will need to restart the dev server (`pnpm dev`) for the new values to be read.

Note that `localhost` subdomains [need to be configured on your machine](https://stackoverflow.com/q/19016553/1818285) to become resolvable.

## Quality checks

### Linting

Codebase integrity is continuously checked with several [linting](<https://en.wikipedia.org/wiki/Lint_(software)>) tools.
You can find them in [`package.json`](`package.json`) under `scripts` → `lint:*`.
To run a specific linter, use `pnpm lint:<linter-name>` (e.g. `pnpm lint:eslint`).
To run all linters, use `pnpm lint`.

The linters examine the codebase from different angles and help with early detection of potential issues.
They are also used to maintain a consistent code style.
Some linters provide autofixes, which can be applied with `pnpm fix:<linter-name>` (e.g. `pnpm fix:eslint`).

All linters are executed as part of the CI pipeline ([`.github/workflows/ci.yaml`](.github/workflows/ci.yaml)).
They run for pull requests as well as pushes to the `main` branch.

### Testing

TODO implement

## Deployment

Next.js apps are often deployed to cloud-native environments such as [Vercel](https://vercel.com), [Netlify](https://netlify.com), [AWS Amplify](https://aws.amazon.com/amplify/), etc.
This makes them highly scalable and resilient to failures.
One limitation that cloud-native deployments impose on Next.js apps is to do with the the size of the [Lambda functions](https://en.wikipedia.org/wiki/AWS_Lambda).
These functions handle API requests and render React pages on the server side.

<img src="https://gitlab.com/kachkaev/website/uploads/a416ccf87b7a1cd2e2bb386f8109f936/thinking.png" alt="thinking meme face" width="120" /><br>

With Playwright browser used in `/update-profiles/[profile-name]?[security-token]`, the size of some Lambda functions would exceed the [limit of 50 MB](https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html).
Besides, deploying this mini-website to a cloud-native environment would make it harder for me to co-host it with other projects on the same domains.

To overcome these two limitations, I have decided to deploy the app to a [Kubernetes](https://kubernetes.io) cluster, in which I run most of my side projects.

### Docker

I use [Docker](https://www.docker.com) to make the Next.js app deployable to Kubernetes.
You can dockerize the app locally with this command:

```sh
docker build --tag website .
```

Once the container image is created, you can test it at [localhost:3000](http://localhost:3000) like this:

```sh
docker run \
  --env-file=.env.local \
  --publish 3000:3000 \
  --rm \
  --volume $(pwd)/data:/data \
  website
```

The ‘official’ website image is created from GitHub Actions ([`.github/workflows/generate-docker-image.yaml`](.github/workflows/generate-docker-image.yaml)) and is hosted on GitHub ([github.com/kachkaev/website/pkgs/container/website](https://github.com/kachkaev/website/pkgs/container/website)).

### Kubernetes (K8s)

<img src="https://gitlab.com/kachkaev/website/uploads/c0799225fbfc40e2c493ed290bc345d1/doing.png" alt="concentrated meme face" width="120" />

[Kubernetes](https://kubernetes.io) is an open platform for running custom cloud-native workloads.
Just as any K8s deployment, this mini-website is described in yaml files which are located in [`k8s`](k8s) directory of this repo.
These yamls can serve as examples for deploying similar Next.js apps with ‘heavy’ API handlers.
Such handlers would be [slow inside Lambda functions](https://github.com/orgs/vercel/discussions/496) or even exceed their size limit.

The commands in this section assume that a Kubernetes cluster is already setup, `kubectl` client is configured against it and the current Kubernetes user is able to create resources in the `website` namespace.
It is also assumed that the cluster’s [ingress controller](https://kubernetes.io/docs/concepts/services-networking/ingress/) is in place, so the creation of `Ingress` objects leads to exposing Kubernetes services to the outer world via HTTP and HTTPS.
If you are not using [Traefik](https://traefik.io) as the ingress controller, you might need to replace a couple of annotations in the yamls (e.g. `traefik.ingress.kubernetes.io/router.tls`).
You may also want to modify some other bits such as those containing host names.

#### Namespace

First, let’s ensure that a namespace called `website` exists in your cluster:

```sh
kubectl apply -f k8s/namespace.yaml
```

#### Persistent volume claim for data

We don’t want profile infos to be erased every time the app deployment is updated.
To achieve this, we will use a persistent volume claim (PVC):

```sh
kubectl apply -f k8s/pvc.yaml
```

#### Secrets

We can pass environment variables to the app deployment directly inside the yaml.
However, because some of the values are sensitive, it is better to maintain them as Kubernetes secrets:

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

#### The app (deployment, service, ingress)

Now that we have a namespace, a PVC and the secrets, we can deploy the app itself:

```sh
kubectl apply -f k8s/app.yaml
```

To manually update the app deployment, this commands can be used:

```sh
NEW_IMAGE_TAG=$(git rev-parse --short HEAD)
kubectl set image --namespace=website deployment/website-app main=ghcr.io/kachkaev/website:${NEW_IMAGE_TAG}
```

Alternatively, it is possible to modify Docker image urls directly in yaml files and then run `kubectl apply ...` again.
In any case, the updates will run with zero downtime because of their rolling nature.

#### Initial profile infos

Because profile infos have not been collected yet, the app will ‘gracefully degrade’ by showing blank space instead of statistics.
We can instantiate profile infos by manually requesting corresponding URLs: `/update-profiles/[profile-name]?[security-token]`.

#### Cron jobs (recurring updates to profile infos)

We can always update profile infos by opening `/update-profiles/[profile-name]?[security-token]`.
To automate this process, we can use Kubernetes cron jobs which will make GET requests on a schedule:

```sh
kubectl apply -f k8s/cron-jobs.yaml
```

All done!

<img src="https://gitlab.com/kachkaev/website/uploads/83aa65c795d488f754a34a4e61d57cfd/done.png" alt="happy meme face" width="120" /><br><br>

The real production cluster contains other Kubernetes payload including redirects from www domains to non-www ones.
These yamls are omitted from the repository to keep it focused.

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

The repository is available under [BSD-3-Clause license](./LICENSE.md), so you are free to do whatever you want with it!

<img src="https://gitlab.com/kachkaev/website/uploads/749d5f4679392be346e7e986f2e5e5e1/thumbs-up.png" alt="thumbs-up meme face" width="160" />
