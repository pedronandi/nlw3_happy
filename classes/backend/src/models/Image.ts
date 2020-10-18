import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import Orphanage from './Orphanage';

@Entity('images')
export default class Image {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  path: string;

  /*
    @ManyToOne(() => Orphanage, orphanage => orphanage.images  
      Qual é o atributo da classe Orphanage que possui o id do orfanato?
      É images (o array)
    
    Não tem decorator @Column pq não é campo do banco
    O atributo guarda um orfanato (que é o dono da imagem)
  */
  @ManyToOne(() => Orphanage, orphanage => orphanage.images)
  @JoinColumn({name: 'orphanage_id'})
  orphanage: Orphanage;
}