'use strict'

const { PeopleCache } = require('../modules')
const request = require('request-promise')

const uri = 'https://swapi.co/api/people'
const peopleCache = new PeopleCache()

/**
 * @description Get characters recursively until there are no more pages left.
 * @param {string} uri - API endpoint.
 * @param {Array} accumulator - For recursive calls.
 * @returns {Object[]}
 */
async function fetchEveryone (uri, accumulator) {
  const { results, next } = await request.get({ uri, json: true })

  accumulator = [...accumulator, ...results]

  if (next) return fetchEveryone(next, accumulator)

  return accumulator
}

/**
 * @description Endopint handler. Gets every Star Wars character.
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns {Object[]}
 */
async function people (req, res, next) {
  try {
    const everyone = await fetchEveryone(uri, [])
    peopleCache.setById(everyone)
    // statsd.gauge('total_characters', everyone.length)

    return res
      .status(200)
      .json(peopleCache.getNamesAndIds())
  } catch (error) { next(error) }
}

/**
 * @description Endopint handler. Gets an Star Wars character by its id.
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns {Object}
 */
async function peopleById (req, res, next) {
  try {
    const id = req.params.id

    const character = await request.get({ uri: `${uri}/${id}`, json: true })
    // statsd.increment('byId_get')

    return res
      .status(200)
      .json({
        ...{ id: id },
        ...character
      })
  } catch (error) { next(error) }
}

module.exports = { people, peopleById }
