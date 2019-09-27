'use strict'

const { people } = require('../controllers')
const router = require('express').Router()
const { PeopleCache } = require('../modules')
const peopleCache = new PeopleCache()

// Get people by id.
router.get('/:id',
  (...args) => peopleCache.getById(...args),
  people.peopleById
)

// Get everyone.
router.get('/',
  (...args) => peopleCache.getEveryone(...args),
  people.people
)

module.exports = router
