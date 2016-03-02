/**
 * Languages.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  autoCreatedAt: false,
  autoUpdatedAt: false,

  attributes: {

    /**************************************************************************
    *                                                                         *
    * PUBLIC                                                                  *
    *                                                                         *
    **************************************************************************/

    type: {
      type: 'string'
    },

    name: {
      type:     'string',
      required: true,
      index:    true
    },

    group: {
      type:  'string',
      index: true
    },

    aliases: {
      type:  'array',
      index: true
    },

    color: {
      type:  'string'
    }

  }
};

