'use strict'

const people = {}

/**
 * @description In-memory cache and middleware methods for `people` endpoints.
 * @class PeopleCache
 */
class PeopleCache {
  constructor () {
    this.propsPerCharacter = [
      'id',
      'name',
      'height',
      'mass',
      'hair_color',
      'skin_color',
      'eye_color',
      'birth_year',
      'gender',
      'homeworld',
      'films',
      'species',
      'vehicles',
      'starships'
    ]
  }

  /**
   * @description  Only returns `name` and `id` props from every character in cache.
   * @returns {Object[]}
   */
  getNamesAndIds () {
    return Object.keys(people).map(id => people[id].nameAndId)
  }

  /**
   * @description Sets an array of characters into cache, in two objects.
   * nameAndId: only contains `name` & `id` properties.
   * character: has every property in `propsPerCharacter` plus its `id`.
   * @param {Object[]} everyone - Array of characters to be set on cache.
   * @returns {void}
   */
  setById (everyone) {
    everyone.forEach(character => {
      const id = new URL(character.url).pathname.split('/')[3]

      people[id] = {
        nameAndId: { name: character.name, id },
        character: filterProps({ ...character, id }, this.propsPerCharacter)
      }
    })
  }

  /**
   * @description Cache middleware.
   * Gets every character from cache.
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns {Object[]}
   */
  getEveryone (req, res, next) {
    try {
      if (Object.keys(people).length > 0) {
        // statsd.increment('cache_hit', { resource: 'people', api: 'everyone' })
        return res
          .status(200)
          .json(this.getNamesAndIds())
      }

      next()
    } catch (error) { next(error) }
  }

  /**
   * @description Cache middleware.
   * Gets a character by `id` from cache.
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns {Object}
   */
  getById (req, res, next) {
    try {
      const id = req.params.id

      if (people[id] && people[id].character) {
        // statsd.increment('cache_hit', { resource: 'people', api: 'byId' })

        return res
          .status(200)
          .json(people[id].character)
      }

      next()
    } catch (error) { next(error) }
  }
}

/**
 * @description Filter properties to only keep those declared in props argument.
 * @param {Object} obj - To be filtered.
 * @param {string[]} props - Properties to keep.
 * @returns {Object}
 */
function filterProps (obj, props) {
  return Object.keys(obj).reduce((acc, key) => {
    if (props.includes(key)) {
      acc[key] = obj[key]
    }

    return acc
  }, {})
}

module.exports = PeopleCache
