# [kachkaev.ru](https://kachkaev.ru) / [.uk](https://kachkaev.uk) source code

## Docker

```sh
docker build --tag website .

docker run \
  --env-file=.env.local \
  --publish 3000:3000 \
  --rm \
  --volume $(pwd)/profile-infos:/app/profile-infos \
  website
```

## Unsolved problems

- **Components inside i18n strings**, e.g. `Hello <a>world</a>!`  
  This is possible with [`<Trans />` component](https://react.i18next.com/latest/trans-component) in `react-i18next` (pending a version that supports `/app` folder and server components).
