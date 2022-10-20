import { AppDataSource } from "../app-data-source"
import { Request, Response } from 'express'
import { Gasto } from '../entity/Gasto'
import { Usuario } from '../entity/Usuario'

class GastoController {
    public async create(req: Request, res: Response): Promise<Response> {
        const { descricao, valor } = req.body
        // obtém o id do usuário que foi salvo na autorização na middleware
        const { id } = res.locals
        const usuario: any = await AppDataSource.manager.findOneBy(Usuario, { id }).catch((e) => {
            return { error: "Identificador inválido" }
        })

        if (usuario && usuario.id) {
            const gasto = new Gasto()
            gasto.usuario = usuario
            gasto.descricao = descricao
            gasto.valor = parseFloat(valor)
            await AppDataSource.manager.save(Gasto, gasto)
            res.json({id:gasto.id,descricao:gasto.descricao,valor:gasto.valor})
        }
        else {
            return res.json(usuario)
        }
    }

    public async update(req: Request, res: Response): Promise<Response> {
        const { id, descricao, valor } = req.body
        const gasto: any = await AppDataSource.manager.findOneBy(Gasto, { id }).catch((e) => {
            return { error: "Identificador inválido" }
        })
        if (gasto && gasto.id) {
            gasto.descricao = descricao
            gasto.valor = valor
            const r = await AppDataSource.manager.save(Gasto, gasto).catch((e) => e.message)
            return res.json(r)
        }
        else if (gasto && gasto.error) {
            return res.json(gasto)
        }
        else {
            return res.json({ error: "Gasto não localizado" })
        }
    }

    public async delete(req: Request, res: Response): Promise<Response> {
        const { id } = req.body
        const gasto: any = await AppDataSource.manager.findOneBy(Gasto, { id }).catch((e) => {
            return { error: "Identificador inválido" }
        })

        if (gasto && gasto.id) {
            const r = await AppDataSource.manager.remove(Gasto, gasto).catch((e) => e.message)
            return res.json(r)
        }
        else if (gasto && gasto.error) {
            return res.json(gasto)
        }
        else {
            return res.json({ error: "Gasto não localizado" })
        }
    }

    public async list(req: Request, res: Response): Promise<Response> {
        // obtém o id do usuário que foi salvo na autorização na middleware
        const { id } = res.locals
        const usuario: any = await AppDataSource.manager.findOneBy(Usuario, { id }).catch((e) => {
            return { error: "Identificador inválido" }
        })

        if (usuario && usuario.id) {
            const repo = AppDataSource.getRepository(Gasto)
            const gastos = await repo.find({
                /*relations:{
                    usuario:true
                },*/
                where: { usuario: { id } },
                order: {
                    descricao: 'asc'
                }
            })
            return res.json(gastos)
        }
        else if (!usuario) {
            return res.json({ error: "Usuário não identificado" })
        }
        else {
            return res.json(usuario)
        }
    }
}

export default new GastoController()