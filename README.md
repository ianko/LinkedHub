# LinkedHub

This is a [Sails](http://sailsjs.org) API that fetches a LinkedIn public profile and a github account.

### Get started:

**With [node](http://nodejs.org) [installed](http://sailsjs.org/#!documentation/new-to-nodejs):**
```sh
# Get the latest stable release of Sails
$ sudo npm install sails -g

# Clone this project
$ git clone git@github.com:ianko/LinkedHub_API.git

# Enter the directory
$ cd LinkedHub_API

# Install the dependencies
$ npm install

# Run the API
$ sails lift
```

### Configuration:

Open the `config/linkedhub.js` file and update with the preferred authenticate object. See https://github.com/mikedeboer/node-github for options.

### How it works:

When you lift the API, the Seed Languages Hook will check if the `languages.yml` file was already loaded in the database. If not, will do it.

The API will receive `POST` calls on the `/parse` endpoint. The expected payload is:

```json
{
    "linkedin": "{LINKEDIN_PUBLIC_URL}",
    "github": "{GITHUB_USERNAME}"
}
```

The response has three main attributes:

```json
{
  "linkedin": {}, // the scraped linkedin profile
  "github": {}, // the github profile fetched from the API
  "counts": {} // the languages and projects that matches the linkedin skills
}
```


