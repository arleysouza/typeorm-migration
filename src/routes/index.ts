import { Router, Request, Response } from "express"
import usuario from './usuario'
import gasto from './gasto'
import UsuarioController from "../controllers/UsuarioController"
import {authorization} from '../middlewares'

const routes = Router()

routes.use("/usuario", usuario)
routes.use("/gasto", authorization, gasto)
routes.post("/login", UsuarioController.login)

//aceita qualquer método HTTP ou URL
routes.use( (req:Request,res:Response) => res.json({error:"Requisição desconhecida"}) )

export default routes
