import { Router } from "express"
import auth from "./auth"
import lessons from "./lessons"
import subjects from "./subjects"
import students from "./students"
import elements from "./elements"
import files from "./files"

export default context => {
  let api = Router()

  api.use("/auth", auth(context))
  api.use("/lessons", lessons(context))
  api.use("/subjects", subjects(context))
  api.use("/students", students(context))
  api.use("/elements", elements(context))
  api.use("/files", files(context))

  api.get("/", (req, res) => {
    res.json({ success: true })
  })

  return api
}
