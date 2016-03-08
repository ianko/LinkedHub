/**
 * ParseController
 *
 * @description :: Server-side logic for managing parses
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

// DEPENDENCIES

// https://github.com/petkaantonov/bluebird/
var Promise = require('bluebird');

module.exports = {

  parse: function(req, res, next) {

    // the required params
    var linkedin = req.param('linkedin');
    var github   = req.param('github');

    if (!linkedin) {
      return res.badRequest('The LinkedIn account is required.');
    }

    if (!github) {
      return res.badRequest('The GitHub account is required.');
    }

    // authenticate right away
    GithubService.authenticate();

    // Scrape of the linkedin profile page and get github profile
    Promise
      .all([

        // get the linkedin data, then save to the database
        LinkedinService.getProfile(linkedin),

        // get the Github data, then save to the database
        GithubService.getProfile(github)

      ])
      .then(function(profiles) {

        // start the GitHub stars and repo crawl
        GithubService
          .matchSkills(github, profiles[0].skills, function(err, counts) {
            if (err) {
              sails.log.error('[ParseController][matchSkills]', err);
              res.badRequest('Error parsing and mathing users skills');
            }

            // return the profiles
            res.json({
              linkedin: profiles[0],
              github:   profiles[1],
              counts:   counts
            });
          });
      })
      .catch(function(err) {
        sails.log.error('[ParseController][scrape]', err);
        res.badRequest('Error parsing the public profiles');
      }
    );

    // get the github data
  }

};

