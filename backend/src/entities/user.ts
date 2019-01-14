import { Column, PrimaryGeneratedColumn, Entity, Timestamp } from 'typeorm'

@Entity()
export class User {
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  open_id: string;
}



