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

  @Column()
  download_url: string;

  @Column()
  cover: string;

  @Column()
  score: string;

  @Column()
  origin_place: string;

  @Column()
  actor: string;

  @Column()
  type: string;

  @Column()
  country: string;

  @Column()
  rate: string;

}



