/**
 * LinkedIn Service
 *
 * Scrape, extract and parse the LinkedIn public profile.
 *
 */

// DEPENDENCIES

// https://github.com/petkaantonov/bluebird/
var Promise = require('bluebird');

// https://github.com/danieljoppi/node-linkedin-scraper2
var linkedinScraper = require('linkedin-scraper2');

module.exports = {

  /****************************************************************************
  *                                                                           *
  * Gets the data already scraped, or scrapes the public profile              *
  *                                                                           *
  ****************************************************************************/

  getProfile: function getProfile(url) {
    return new Promise(function(resolve, reject) {

      Linkedin
        .findOne({url: url})
        .then(function(data) {

          // we already have the profile scraped
          if (data) {
            return resolve(data.profile);
          }

          // scrape the public profile
          linkedinScraper(url, function(err, profile) {
            if (err) return reject(err);

            // resolve right away
            resolve(profile);

            // save to the database
            Linkedin
              .create({url: url, profile: profile})
              .exec(function(err, data) {}); // don't care if success or not
          });
        })
        .catch(reject);
    });
  }

};
