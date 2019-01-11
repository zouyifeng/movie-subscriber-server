import { Column, PrimaryGeneratedColumn, Entity, Timestamp } from 'typeorm'

@Entity()
export class Movie {
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  publish_time: string;

  @Column()
  intro: string;

  @Column({
    length: 500
  })
  download_url: string;

  @Column()
  cover: string;

  @Column()
  actor: string;

  @Column()
  country: string;

  @Column()
  rate: string;

  @Column()
  create_time: string;
  
  @Column()
  type: string;
}



