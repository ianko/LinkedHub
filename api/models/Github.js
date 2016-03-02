/**
* GitHub profiles
*
*/

module.exports = {

  attributes: {

    /**************************************************************************
    *                                                                         *
    * PUBLIC                                                                  *
    *                                                                         *
    **************************************************************************/

    username: {
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
