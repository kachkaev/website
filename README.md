# [kachkaev.uk](https://kachkaev.uk) / [.ru](https://kachkaev.ru) source code

This repository contains the source code of my personal mini-website.
It represents a simple instance of a Next.js app with server components, API routes and domain-based internationalization.
Feel free to use this codebase to learn something new or to reuse some of its bits in your own projects.

## Key ingredients

- [Next.js](https://nextjs.org) (with `/app` directory) as the architecture framework
- [React](https://reactjs.org) to define the UI (server and client components)
- [Tailwind CSS](https://tailwindcss.com) to style the UI
- [FormatJS](https://formatjs.io) to handle internationalization ([ICU](https://formatjs.io/docs/core-concepts/icu-syntax/) plurals etc.)
- [Playwright](https://playwright.dev), [Zod](https://zod.dev) and [Axios](https://axios-http.com) to update profile infos in API handlers
- [ESLint](https://eslint.org), [Markdownlint](https://github.com/DavidAnson/markdownlint), [Prettier](https://prettier.io) and [TypeScript](https://www.typescriptlang.org) to statically check and autocorrect source files
- [pnpm](https://pnpm.io) to manage dependencies
- [Docker](https://www.docker.com) to generate deployable production artifacts
- [Kubernetes](https://kubernetes.io) to run the app in production
- [GitHub Actions](https://github.com/features/actions) to run CI/CD pipelines

## Short-term plans

- [ ] finish README
- [ ] improve locale animation (use framer-motion)

## Project structure

TODO

## Known issues

- **Components inside i18n strings**, e.g. `Hello <a>world</a>!`  
  This is possible with [`<Trans />` component](https://react.i18next.com/latest/trans-component) in `react-i18next` (pending a version that supports `/app` directory and server components).
- TODO: elaborate on
  - 404s (permanent solution)
  - nbprogress
    - https://github.com/vercel/next.js/issues/45499
    - https://github.com/apal21/nextjs-progressbar/issues/86

## Local development

TODO describe how to run the app locally

```sh
pnpm install
pnpm dev
```

## Deployment

![thinking meme face](https://gitlab.com/kachkaev/website/uploads/a416ccf87b7a1cd2e2bb386f8109f936/thinking.png)

TODO describe how to deploy the app

### Docker

```sh
docker build --tag website .

docker run \
  --env-file=.env.local \
  --publish 3000:3000 \
  --rm \
  --volume $(pwd)/profile-infos:/data/profile-infos \
  website
```

### Kubernetes (K8S)

![concentrated meme face](https://gitlab.com/kachkaev/website/uploads/c0799225fbfc40e2c493ed290bc345d1/doing.png)

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

![happy meme face](https://gitlab.com/kachkaev/website/uploads/83aa65c795d488f754a34a4e61d57cfd/done.png)

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

![thumbs-up meme face](https://gitlab.com/kachkaev/website/uploads/749d5f4679392be346e7e986f2e5e5e1/thumbs-up.png)
