import multer from 'multer';
import path from 'path';

/* exportando um objeto JS */
export default {
  storage: multer.diskStorage({
    destination: path.join(__dirname, '..', '..', 'uploads'),
    /* função anônima */
    filename: (request, file, cb) => {
      /* as crases com ${} permitem a concatenação de variáveis às Strings */
      const filename = `${Date.now()}-${file.originalname}`;

      cb(null, filename);
    },
  })
};