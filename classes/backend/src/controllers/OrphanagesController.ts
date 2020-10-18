import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import * as Yup from 'yup';

import Orphanage from '../models/Orphanage';
import orphanagesView from '../views/orphanagesView';
import deleteFromDisk from '../config/deleteFromDisk';

export default {
  async index(request: Request, response: Response) {
    const orphanagesRepository = getRepository(Orphanage);
    const orphanages = await orphanagesRepository.find({
      relations: ['images']
    })

    return response.status(200).json(orphanagesView.renderMany(orphanages));
  },
  async show(request: Request, response: Response) {
    const {id} = request.params; /* Object Destructing */

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

    const data = {
      name,
      latitude,
      longitude,
      about,
      instructions,
      opening_hours,
      open_on_weekends,
      images
    };

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      latitude: Yup.number().required(),
      longitude: Yup.number().required(),
      about: Yup.string().required().max(300),
      instructions: Yup.string().required(),
      opening_hours: Yup.string().required(),
      open_on_weekends: Yup.boolean().required(),
      images: Yup.array(
        Yup.object().shape({
          path: Yup.string().required()
      }))
    });

    await schema.validate(data, {
      /* se abortEarly for true, no primeiro erro de validação ele já retorna */
      abortEarly: false,

    });

    const orphanage = orphanagesRepository.create(data);
      
    /* Retorna uma Promise */
    await orphanagesRepository.save(orphanage);
      
    /* 201 = Status que representa que o POST deu certo */
    return response.status(201).json(orphanage);
  },
  async remove(request: Request, response: Response) {
    const {id} = request.params;

    const orphanagesRepository = getRepository(Orphanage);
    const orphanage = await orphanagesRepository.findOneOrFail(id, {
      relations: ['images']
    });
    const images = orphanage.images;
    
    await orphanagesRepository.remove(orphanage);
    await deleteFromDisk(images);
    /*
      conseguiu apagar o orfanato e suas imagens do banco?
      importar o multer aqui pra deletar os arquivos, pelo nome, de ../../uploads
    */

    return response.status(200).json({
      message: `id ${id} successfully deleted`
    });
  },
  async removeAll(request: Request, response: Response) {
    const orphanagesRepository = getRepository(Orphanage);
    const orphanages = await orphanagesRepository.find({
      relations: ['images']
    });
    
    if (orphanages.length >= 1) {
      for (const orphanage of orphanages) {
        const images = orphanage.images;

        await orphanagesRepository.remove(orphanage);
        await deleteFromDisk(images);
      }
  
      return response.status(200).json({
        message: `orphanages successfully deleted`
      });
    }

    return response.status(400).json({
      message: `there is no orphanage to delete`
    });
  }
};