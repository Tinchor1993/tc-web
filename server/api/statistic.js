import { Router } from "express"
import model from "../models/statistic"

export default ({ config, db }) => {
  const router = Router()
  const statistic = model({ config, db })


  return router
}
