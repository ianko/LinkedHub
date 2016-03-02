/**
* LinkedIn profiles
*
*/

module.exports = {

  attributes: {

    /**************************************************************************
    *                                                                         *
    * PUBLIC                                                                  *
    *                                                                         *
    **************************************************************************/

    url: {
      type:     'string',
      required: true,
      index:    true
    },

    profile: {
      type:     'json',
      required: false
    }

  }

};
