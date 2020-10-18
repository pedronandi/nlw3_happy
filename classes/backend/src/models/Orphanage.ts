import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn } from 'typeorm';
import Image from './Image';

@Entity('orphanages')
export default class Orphanage {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;
    
  @Column()
  latitude: number;
    
  @Column()
  longitude: number;
    
  @Column()
  about: string;
    
  @Column()
  instructions: string;
    
  @Column()
  opening_hours: string;
    
  @Column()
  open_on_weekends: boolean;

  /*
    @OneToMany(() => Image, image => image.orphanage)
      Qual é o atributo da classe Image que possui o id do orfanato?
      É orphanage
    @JoinColumn({name: 'orphanage_id'})
      Qual é a coluna da tabela da classe Image que irá armazenar o orfanato?
      A tabela é 'images' e a coluna é 'orphanage_id'

    Não tem decorator @Column pq não é campo do banco
    O atributo é um array de imagens
  */
  @OneToMany(() => Image, image => image.orphanage, {
    cascade: ['insert', 'update']
  })
  @JoinColumn({name: 'orphanage_id'})
  images: Image[];
}