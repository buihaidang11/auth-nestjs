import { Column } from "typeorm";

export class SignInDto {
    @Column()
    id: number
    @Column()
    username: string
    @Column()
    password: string
}