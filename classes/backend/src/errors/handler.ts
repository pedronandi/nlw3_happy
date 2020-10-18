import { ErrorRequestHandler } from 'express';
import { ValidationError } from 'yup';

interface ValidationErrors {
  [key: string]: string[];
}

const errorHandler: ErrorRequestHandler = (error, request, response, next) => {
  if (error instanceof ValidationError) {
    let errors: ValidationErrors = {};

    error.inner.forEach(err => {
      /*
        Quando não existe o tratamento para erros de validação no aqui no handler.ts
        o console.log exibe o error.inner (array de erros de validação) e nele
        path guarda o no nome do campo
        errors é um array de erros de validação envolvendo o campo
      */

      errors[err.path] = err.errors;
    });

    return response.status(400).json({
      message: 'Validation fails',
      errors
    });
  }

  console.error(error);

  return response.status(500).json({
    message: 'Internal Server Error'
  });
};

export default errorHandler;