import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { AccessKey } from '../../access-keys/entities/access-key.entity';

@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column({ type: 'varchar', length: 255 })
  companyName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  contactPerson: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  contactNumber: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 50, default: 'active' })
  status: string = 'active';

  @OneToMany(() => AccessKey, (key) => key.client)
  accessKeys: AccessKey[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
