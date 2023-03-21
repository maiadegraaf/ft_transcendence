import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Avatar {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    filename:string;
}