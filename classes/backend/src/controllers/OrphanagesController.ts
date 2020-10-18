import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import Orphanage from '../models/Orphanage';
import orphanagesView from '../views/orphanagesView';
import OrphanageView from '../views/orphanagesView';

export default {
  async index(request: Request, response: Response) {
    const orphanagesRepository = getRepository(Orphanage);
    const orphanages = await orphanagesRepository.find({
      relations: ['images']
    })

    return response.status(200).json(orphanagesView.renderMany(orphanages));
  },
  async show(request: Request, response: Response) {
    const { id} = request.params; /* Object Destructing */

    const orphanagesRepository = getRepository(Orphanage);
    const orphanage = await orphanagesRepository.findOneOrFail(id, {
      relations: ['images']
    });

    return response.status(200).json(orphanagesView.render(orphanage));
  },
  /*
    Rota = Conjunto
    Recurso = Usuário
    Métodos HTTP = GET/POST/DELETE/PUT
    Parâmetros
      Query params: Enviados na própria rota: /users?search=pedro&carol
        console.log(request.query);
      Route params: DELETE /users/1 (identificar um recurso que já existe)
        console.log(request.params);
      Body: Parâmetros vão no body da request
        console.log(request.body);
  */
  async create(request: Request, response: Response) {
    const {
      name,
      latitude,
      longitude,
      about,
      instructions,
      opening_hours,
      open_on_weekends,
    } = request.body;
      
    const orphanagesRepository = getRepository(Orphanage);

    /* 
      Acesso às imagens enviadas via upload na requisição 
      Necessário o cast para informar que request.files é um array de files do multer
    */
    const requestImages = request.files as Express.Multer.File[];

    /*
      Itera sobre o array, com o Map jogando pra 'images' o filename de cada imagem
    */
    const images = requestImages.map(image => {
      return { path: image.filename }
    });

    const orphanage = orphanagesRepository.create({
      name,
      latitude,
      longitude,
      about,
      instructions,
      opening_hours,
      open_on_weekends,
      images
    });
      
    /* Retorna uma Promise */
    await orphanagesRepository.save(orphanage);
      
    /* 201 = Status que representa que o POST deu certo */
    return response.status(201).json(orphanage);
  }
};