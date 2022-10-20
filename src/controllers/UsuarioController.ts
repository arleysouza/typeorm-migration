import { AppDataSource } from "../app-data-source"
import { Request, Response } from 'express'
import { Usuario } from '../entity/Usuario'
import { generateToken } from '../middlewares'

class UsuarioController {
  public async login(req: Request, res: Response): Promise<Response> {
    const { mail, senha } = req.body
    // como a propriedade senha não está disponível para select {select: false},
    // então precisamos usar esta conulta para forçar incluir a propriedade 
    const usuario: any = await AppDataSource
      .getRepository(Usuario)
      .createQueryBuilder("user")
      .select()
      .addSelect('user.senha')
      .where("user.mail=:mail", { mail })
      .getOne()

    if (usuario && usuario.id) {
      const r = await usuario.compare(senha)
      if (r) {
        // cria um token codificando o objeto {idusuario,mail}
        const token = await generateToken({ id: usuario.id, mail: usuario.mail })
        // retorna o token para o cliente
        return res.json({
          id: usuario.id,
          mail: usuario.mail,
          token
        })
      }
      return res.json({ error: "Dados de login não conferem" })
    }
    else {
      return res.json({ error: "Usuário não localizado" })
    }
  }

  public async create(req: Request, res: Response): Promise<Response> {
    const { mail, senha } = req.body
    const obj = new Usuario()
    obj.mail = mail
    obj.senha = senha
    // o hook BeforeInsert não é disparado com AppDataSource.manager.save(Usuario,JSON),
    // mas é disparado com AppDataSource.manager.save(Usuario,objeto do tipo Usuario)
    // https://github.com/typeorm/typeorm/issues/5493
    const usuario:any = await AppDataSource.manager.save(Usuario, obj).catch((e) => {
      // testa se o e-mail é repetido
      if (/(mail)[\s\S]+(already exists)/.test(e.detail)) {
        return { error: 'e-mail já existe' }
      }
      return { error: e.message }
    })
    if (usuario.id){
       // cria um token codificando o objeto {idusuario,mail}
       const token = await generateToken({ id: usuario.id, mail: usuario.mail })
       // retorna o token para o cliente
       return res.json({
         id: usuario.id,
         mail: usuario.mail,
         token
       })
    }
    return res.json(usuario)
  }

  // o usuário pode atualizar somente os seus dados
  public async update(req: Request, res: Response): Promise<Response> {
    const { mail, senha } = req.body
    // obtém o id do usuário que foi salvo na autorização na middleware
    const { id } = res.locals
    const usuario: any = await AppDataSource.manager.findOneBy(Usuario, { id }).catch((e) => {
      return { error: "Identificador inválido" }
    })
    if (usuario && usuario.id) {
      if (mail !== "") {
        usuario.mail = mail
      }
      if (senha !== "") {
        usuario.senha = senha
      }
      const r = await AppDataSource.manager.save(Usuario, usuario).catch((e) => {
        // testa se o e-mail é repetido
        if (/(mail)[\s\S]+(already exists)/.test(e.detail)) {
          return ({ error: 'e-mail já existe' })
        }
        return e
      })
      if( !r.error ){
        return res.json({id:usuario.id,mail:usuario.mail})
      }
      return res.json(r)
    }
    else if (usuario && usuario.error) {
      return res.json(mail)
    }
    else {
      return res.json({ error: "Usuário não localizado" })
    }
  }

}

export default new UsuarioController()