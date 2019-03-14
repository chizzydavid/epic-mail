import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import routes from './routes/index';
import swaggerDoc from '../epicmail-doc.json';

dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
app.use(routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  // console.log(`App running at port ${PORT}`);
});


export default app;
