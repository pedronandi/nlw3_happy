import express from 'express';
import 'express-async-errors';
import path from 'path';
import routes from './routes';

import './database/connection';

const app = express();

/*
  Express não entende JSON por padrão
  Necessário 'add o plugin'
*/
app.use(express.json());
app.use(routes);
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.listen(3333); /* localhost:3333 */