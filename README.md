# [kachkaev.ru](https://kachkaev.ru) / [.uk](https://kachkaev.uk) source code

## TODO

- [x] location of site data → env
- [x] google analytics
  - https://github.com/MauricioRobayo/nextjs-google-analytics/issues/304
- [x] chron job for fetching profile infos
- [ ] locale animation
- [ ] 404s
- [ ] nbprogress
  - https://github.com/vercel/next.js/issues/45499
  - https://github.com/apal21/nextjs-progressbar/issues/86

## Docker

```sh
docker build --tag website .

docker run \
  --env-file=.env.local \
  --publish 3000:3000 \
  --rm \
  --volume $(pwd)/profile-infos:/data/profile-infos \
  website
```

## K8S

## Deployment

### namespace

```sh
kubectl apply -f k8s/namespace.yaml
```

### secrets

```sh
FLICKR_USER_ID=??
FLICKR_API_KEY=??
kubectl create secret generic flickr-api \
  --from-literal=user_id=${FLICKR_USER_ID} \
  --from-literal=api_key=${FLICKR_API_KEY} \
  --namespace=website

LINKEDIN_PROXY_SERVER=??
kubectl create secret generic linkedin \
  --from-literal=proxy_server=${LINKEDIN_PROXY_SERVER} \
  --namespace=website

UPDATE_PROFILE_SECURITY_TOKEN=??
UPDATE_PROFILE_PROXY_SERVER_URL=??
kubectl create secret generic update-profile \
  --namespace=website \
  --from-literal=security-token=${UPDATE_PROFILE_SECURITY_TOKEN} \
  --from-literal=proxy-server-url=${UPDATE_PROFILE_PROXY_SERVER_URL}
```

### persistent volume claim for data

```sh
kubectl apply -f k8s/pvc.yaml
```

### the app

```sh
kubectl apply -f k8s/app.yaml
```

### cron jobs (profile updates)

```sh
kubectl apply -f k8s/cron-jobs.yaml
```

### App image updates

```sh
NEW_IMAGE_TAG=$(git rev-parse --short HEAD)
kubectl set image --namespace=website deployment/website-app main=ghcr.io/kachkaev/website:${NEW_IMAGE_TAG}
```

## Unsolved problems

- **Components inside i18n strings**, e.g. `Hello <a>world</a>!`  
  This is possible with [`<Trans />` component](https://react.i18next.com/latest/trans-component) in `react-i18next` (pending a version that supports `/app` folder and server components).
