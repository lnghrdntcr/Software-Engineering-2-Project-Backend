const express = require('express')
const subsRouter = express.Router()

const {
  authorizationMiddleware
} = require('../../managers/token/TokenManager')

const PLAN_GET = require('../../stub_endpoint/subs/plan_GET')
const PLAN_POST = require('../../stub_endpoint/subs/plan_POST')

const {
  isTestEnabled
} = require('../../utils/testUtils')

subsRouter.use(authorizationMiddleware('company'))

subsRouter.get('/plan', async (req, res, next) => {
  const action = isTestEnabled(req)
  if (action) {
    res
      .status(PLAN_GET[action].status)
      .send(PLAN_GET[action])
  }
  // TODO: Implement
})

subsRouter.post('/plan', (req, res, next) => {
  const action = isTestEnabled(req)
  if (action) {
    res
      .status(PLAN_POST[action].status)
      .send(PLAN_POST[action])
    return
  }
  // TODO: Implement
})

module.exports = subsRouter