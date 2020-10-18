import express from 'express';
import 'express-async-errors';
import path from 'path';
import cors from 'cors';
import routes from './routes';
import errorHandler from './errors/handler';

import './database/connection';

const app = express();

app.use(cors());
/*
  Express não entende JSON por padrão
  Necessário 'add o plugin'
*/
app.use(express.json());
app.use(routes);
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use(errorHandler);

app.listen(3333); /* localhost:3333 */