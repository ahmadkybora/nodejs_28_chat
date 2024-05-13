import { Entity, ObjectId, ObjectIdColumn, Column, OneToMany } from "typeorm";

@Entity("users")
class UserModel {
    @ObjectIdColumn()
    _id: ObjectId

    @Column()
    name: string

    @Column()
    email: string

    @Column()
    password: string

    @Column()
    token: string

    @Column()
    token_revoke: boolean
}
export default UserModel;
