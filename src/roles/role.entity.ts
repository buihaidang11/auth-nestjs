import { User } from "src/users/user.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()

export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar')
    role: string;

    @ManyToMany(
        () => User,
        user => user.roles,
        { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' }
    )

    users: User[]
}