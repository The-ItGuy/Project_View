import { PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

export abstract class AbstractEntity implements IAbstractEntity<string> {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;
}

export interface IAbstractEntity<TId = string> {
  id: TId;
  createdAt: Date;
}
