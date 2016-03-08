/**
 * Default LinkedHub configuration
 * (sails.config.linkedhub)
 *
 * For more info on Sails models, see:
 * http://sailsjs.org/documentation/reference/configuration
 */

module.exports.linkedhub = {

  /***************************************************************************
  *                                                                          *
  * GitHub API                                                               *
  *                                                                          *
  ***************************************************************************/
  github: {
    // @see: https://github.com/mikedeboer/node-github
    authenticate: {
      type:  'oauth',
      token: '{TOKEN}'
    },

    limit: 100,

    // for development, we will limit this calls
    maxPages: 1
  }

};
