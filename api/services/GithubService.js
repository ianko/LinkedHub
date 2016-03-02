/**
 * GitHub Service
 *
 * Scrape, extract and parse the GitHub public profile.
 *
 */

// DEPENDENCIES

var _ = require('lodash');

// https://github.com/petkaantonov/bluebird/
var Promise = require('bluebird');

// https://github.com/mikedeboer/node-github
var GitHubApi = require('github');
var github = new GitHubApi({
  version: '3.0.0', // required
  debug:   false   // optional
});

module.exports = {

  /****************************************************************************
  *                                                                           *
  * Helper function to parse and sanitize the GitHub username                 *                                                               *
  *                                                                           *
  ****************************************************************************/

  _username: function(user) {
    user = (user || '').replace(/^https?:\/\/github.com\//, '');
    user = user.replace(/\/$/, '');
    user = user.replace(/^@/, '');

    return user;
  },

  /****************************************************************************
  *                                                                           *
  * Authenticate against the GitHub API using the credentials and             *
  * strategy defined in the config file                                       *                                                               *
  *                                                                           *
  ****************************************************************************/

  authenticate: function authenticate(user) {
    github.authenticate(sails.config.linkedhub.github.authenticate);
  },

  /****************************************************************************
  *                                                                           *
  * Gets the data already fetched, or request the public profile to the       *
  * GitHub API                                                                *
  *                                                                           *
  ****************************************************************************/

  getProfile: function getProfile(user) {
    user = this._username(user);

    return new Promise(function(resolve, reject) {

      Github
        .findOne({username: user})
        .then(function(data) {

          // we already have the profile scraped
          if (data) {
            return resolve(data.profile);
          }

          // request the GH user profile
          github.user.getFrom({user: user}, function(err, profile) {
            if (err) return reject(err);

            // resolve right away
            resolve(profile);

            // save to the database
            Github
              .create({username: user, profile: profile})
              .exec(function(err, data) {}); // don't care if success or not
          });
        });
    });
  },

  /****************************************************************************
  *                                                                           *
  * Matches the user stars, repositories and forks againnt the skills array   *
  *                                                                           *
  ****************************************************************************/

  matchSkills: function matchSkills(user, skills, cb) {
    var _this = this;

    user = this._username(user);

    // **
    // ** @TODO: change to Promises
    // **

    // define what we know as a language
    _this.reduceLanguages(skills).then(function(languages) {

      var langs = _.union(
        _.map(languages, 'name'),
        _.flatten(_.compact(_.map(langs, 'aliases')))
      );

      var technologies = {
        languages: langs,
        projects:  _.difference(skills, langs)
      };

      // **
      // ** @TODO: change to Promises
      // **
      _this.getStars(user, technologies, function(err, counts) {
        if (err) return cb && cb(err);

        cb && cb(null, counts);
      });
    })
    .catch(function(err) {
      cb && cb(err);
    });
  },

  /****************************************************************************
  *                                                                           *
  * Get only the Languages on the skills arrays                               *
  *                                                                           *
  ****************************************************************************/

  reduceLanguages: function reduceLanguages(skills) {
    var skillsParams = [];

    _.forEach(skills, function(skill) {
      skillsParams.push(new RegExp('^' + skill + '$', 'i'));
    });

    return Languages
      .find({
        where: {
          $or: [
            {
              name: {$in: skillsParams}
            },
            {
              aliases: {$in: skillsParams}
            }
          ]
        }
      });
  },

  /****************************************************************************
  *                                                                           *
  * Get the users stars                                                       *
  *                                                                           *
  ****************************************************************************/

  getStars: function getStars(user, technologies, cb) {
    var _this = this;

    // search configuraton
    var limit = sails.config.linkedhub.github.limit || 100;
    var opts  = {user: user, per_page: limit};

    // reset the limit
    github._requestsLeft = sails.config.linkedhub.github.maxPages;

    // normalize and initialize the counts
    var langs = technologies.languages;
    var projs = technologies.projects;

    // initialize with zeros
    var counts = {
      languages: _.zipObject(langs, _.fill(_.clone(langs), 0)),
      projects:  _.zipObject(projs, _.fill(_.clone(projs), 0))
    };

    // hit the server
    github.repos.getStarredFromUser(opts, function(err, repos) {
      if (err) return cb && cb(err);

      // parse and request other pages if there is more
      _this._parseRepos(err, repos, function(data) {
        if (err) return cb && cb(err);

        // no data? it means the party is over,
        // time to go back home
        if (!data) {
          return cb && cb(null, counts);
        }

        // sum the languages we have so far
        counts.languages = _.mergeWith(counts.languages, data.languages,
          function(objValue, srcValue) {
            return (objValue || 0) + (srcValue || 0);
          }
        );

        // sum the repositories we have so fr
        counts.projects = _.mergeWith(counts.projects, data.projects,
          function(objValue, srcValue) {
            return (objValue || 0) + (srcValue || 0);
          }
        );
      });
    });
  },

  /****************************************************************************
  *                                                                           *
  * Parse the initial request, and follow the links while still exists        *
  *                                                                           *
  ****************************************************************************/

  _parseRepos: function _parseRepos(err, repos, cb) {
    if (err) return sails.log.error(err);

    var _this = this;
    var found = {
      languages: {},
      projects:  {}
    };

    _.forEach(repos, function(repo) {
      var lang = repo.language;
      var name = repo.name;

      // count languages
      if (lang && _.has(found.languages, lang)) {
        found.languages[lang]++;
      }
      else {
        found.languages[lang] = 1;
      }

      // count projects
      if (name && _.has(found.projects, name)) {
        found.projects[name]++;
      }
      else {
        found.projects[name] = 1;
      }

    });

    // let the caller function count the results
    if (_.isFunction(cb)) {
      cb(found);
    }

    // **
    // ** @TODO: change recursivity to avoid stacking calls
    // **

    if (github._requestsLeft < 1) {
      return cb(null); // empty data
    }

    if (github.hasNextPage(repos.meta.link)) {
      // hit the server again
      github.getNextPage(repos.meta.link, function(err, data) {
        // keep track of how many pages we can still request
        github._requestsLeft--;

        // call the function again
        _this._parseRepos(err, data, cb);
      });
    }
    else {
      // let the caller function count the results
      if (_.isFunction(cb)) {
        cb(null);
      }
    }
  }

};
