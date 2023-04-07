// export class CreateUserPostDto {
//     title: string;
//     description: string;
// }


// *********** Entity for Post ************ (example and not needed for trancendance)

// import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
// import { User } from "./User";

// @Entity({ name: 'user_posts' })
// export class Post {

//     @PrimaryGeneratedColumn()
//     id: number;

//     @Column()
//     title: string;

//     @Column()
//     description: string;

//     // (=>) = map it to?
//     @ManyToOne(() => User, (user) => user.posts)
//     user: User;
// }
