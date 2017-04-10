# [Phenomic](https://github.com/MoOx/phenomic) phenomic-theme-base

## Install dependencies

```sh
npm install
```

## Import data

Use [contentful-import](https://www.npmjs.com/package/contentful-import) to set up the space to work with the data `export/export.json`.

## Set up a config file

```json
{
  "space"       : "spaceId",
  "accessToken" : "someReallyLongToken"
}
```

## Run development server

```sh
npm start
```

## Build for production

```sh
npm run build
```
