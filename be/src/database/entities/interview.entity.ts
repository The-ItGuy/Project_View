import { Column, Entity } from 'typeorm';
import { AbstractEntity } from './abstract.entity';

@Entity()
export class Interview extends AbstractEntity {
  @Column()
  title: string;

  @Column({ nullable: true })
  tech?: string;

  @Column({ nullable: true })
  skill_fe?: string;

  @Column({ nullable: true })
  skill_be?: string;

  @Column({ nullable: true })
  skill_db?: string;

  @Column({ nullable: true })
  skill_infra?: string;

  @Column({ nullable: true })
  availability?: string;
}
