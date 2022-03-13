'use strict'

const Boom = require('boom')
const Joi = require('joi')

/**
 * Express wrapper-ware for a route
 * @param {object} route - The route to validate
 * @param {object} route.validate - The Joi's schema for the request
 * @param {object} route.response - The Joi's schema for the response
 * @param {object} options - Joi's options
 * @param {function} formatFcn - Optional function to format Joi Errors.
 *                             Must return an object of the form:
 *                             {
 *                               message: 'Some Joi error message',
 *                               details: [
 *                                 {
 *                                   // Joi error details
 *                                 }
 *                               ]
 *                             }
 */
module.exports = (route, options, formatFcn) => {
  // If no formatFcn is provided, define a default behavior
  // which doesn't modify the error data
  formatFcn = formatFcn || (err => ({
    message: err.message,
    details: err.details
  }))

  /**
   * Attemps to run a user-defined error handler. This can be used to
   * provide custom formatting to Joi Errors. If the user-defined handler
   * throws an error for whatever reason, the original error message and
   * details are returned (not taking into account the custom error handler)
   * @param  {Error} originalError  The Joi Error
   * @return {Object}     returns an object of the form:
   * {
   *   message: 'some Joi error message',
   *   details: [
   *     {
   *       // Joi error details
   *     },
   *     {}
   *   ]
   * }
   */
  function handleError (originalError) {
    let message
    let details

    try {
      const formattedDetails = formatFcn(originalError)
      message = formattedDetails.message
      details = formattedDetails.details
    } catch (e) {
      message = originalError.message
      details = originalError.details
    }

    message = message || ''
    details = details || []

    return {
      message,
      details
    }
  }
  // This function will be the actual route
  return (req, res, next) => {
    if (route.response) {
      // Monkey patch the 'send'
      const originalSend = res.send

      res.send = function (body) {
        route.response.status = route.response.status || {}

        const schema = route.response.status[this.statusCode] || route.response.schema

        /**
         * Called after a response validation. If an error occured,
         * it is processed (formatted if necessary) and returned
         * @param  {Error} err
         * @return      Returns the response body if successful,
         *                else, calls the next() callback with a Boom Error
         */
        function responseValidationDone (err) {
          if (err) {
            const { message, details } = handleError(err)
            return next(Boom.badImplementation(message, details))
          }

          // Restoring it
          res.send = originalSend

          return res.send(body)
        }

        if (schema) {
          Joi.validate(body || {}, schema, options, responseValidationDone)
        } else {
          responseValidationDone()
        }
      }.bind(res)
    }

    /**
     * Called after a request validation. If an error occured,
     * it is processed (formatted if necessary) and returned
     * @param  {Error} err
     * @return      Calls the route handler if successful,
     *                else, calls the next() callback with a Boom Error
     */
    function requestValidationDone (err, request) {
      request = request || {}
      if (err) {
        const { message, details } = handleError(err)

        return next(Boom.badRequest(message, details))
      }

      // Copy the validated data to the req object
      Object.assign(req, request)

      return route.handler(req, res)
    }

    if (route.validate) {
      const request = ['headers', 'params', 'body', 'query']
        .filter((type) => route.validate[type] && req[type])
        .reduce((acc, type) => {
          acc[type] = req[type]
          return acc
        }, {})
      return Joi.validate(request, route.validate, options, requestValidationDone)
    }

    return requestValidationDone()
  }
}
