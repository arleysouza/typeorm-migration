import { Router } from "express"
import GastoController from "../controllers/GastoController"

const routes = Router()

routes.get('/', GastoController.list)
routes.post('/', GastoController.create)
routes.put('/', GastoController.update)
routes.delete('/', GastoController.delete)

export default routes