import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate } from "typeorm"
import * as bcrypt from "bcrypt"

@Entity({name:"usuarios"})
export class Usuario {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({length: 70, nullable: false, unique:true})
    mail: string

    @Column({nullable: false,  select: false})
    senha: string

    @BeforeInsert()
    @BeforeUpdate()
    hashPassword(): void {
        if (this.senha) {
            this.senha = bcrypt.hashSync(this.senha, bcrypt.genSaltSync(10))
        }
    }

    compare(senha: string): Promise<boolean> {
        return bcrypt.compare(senha, this.senha)
    }
}
