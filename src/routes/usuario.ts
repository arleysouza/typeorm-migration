import { Router } from "express"
import UsuarioController from "../controllers/UsuarioController"
import {authorization} from '../middlewares'

const routes = Router()

routes.post('/', UsuarioController.create)
routes.put('/', authorization, UsuarioController.update)

export default routes