import { Column, Entity, IsNull, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({
        type: String,
        nullable: true,
    })
    twoFactorAuthSecret!: string | null;
}
