import { Entity, ObjectId, ObjectIdColumn, Column } from "typeorm";

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
}
export default UserModel;
