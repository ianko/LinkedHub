/**
 * Seed Languages
 *
 * If not already seeded, add the programming languages
 * to the Languages Collection
 *
 */

var _ = require('lodash');

module.exports = function seedLanguages(sails) {
  var _this = this;

  /**
   * Run when sails loads
   *
   * @see http://sailsjs.org/documentation/concepts/extending-sails/hooks/hook-specification/initialize
   *
   * @param  {Function} next  - be sure and call this method.
   */
  this.initialize = function(next) {
    sails.after('hook:orm:loaded', function() {

      Languages
        .count()
        .then(function(found) {

          // if we already have content there, do not do it again
          if (found) return next();

          // https://github.com/jeremyfa/yaml.js
          var YAML = require('yamljs');

          // load and parse YAML string
          var languages = YAML.load(__dirname + '/languages.yml');
          languages = _.map(languages, function(value, key) {
            return _.extend(value, {name: key});
          })

          Languages.create(languages).exec(function(err, created) {
            // It's very important to trigger this callback method when you are
            // finished with the bootstrap!  (otherwise your server will never
            // lift, since it's waiting on the bootstrap)
            next();
          });
        })
        .catch(next);
    });
  };

  return {
    initialize: _this.initialize
  }
};
