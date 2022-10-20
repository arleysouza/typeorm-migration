import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm"
import { Usuario } from "./Usuario"

@Entity({
    name:"gastos"
})
export class Gasto {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @ManyToOne((type) => Usuario, { onDelete: 'CASCADE' })
    @JoinColumn({  //Defines which side of the relation contains the join column with a foreign key 
        name: "idusuario",
        referencedColumnName: "id",
        foreignKeyConstraintName: "fk_user_id"
    })
    usuario: Usuario

    @Column({length:50,nullable:false})
    descricao: string

    @Column({type: 'decimal', precision: 10, scale: 2, nullable:false})
    valor: number
}