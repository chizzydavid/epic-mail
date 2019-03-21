import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import routes from './routes/index';
import swaggerDoc from '../epicmail-doc.json';
import Tables from './db/db';


dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
app.use(routes);
const runTables = async() => {
	await Tables.dropAllTables();
	await Tables.createAllTables();	
}
runTables();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  // console.log(`App running at port ${PORT}`);
});


export default app;
