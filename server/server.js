import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import routes from './routes/index';

dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  //console.log(`App running at port ${PORT}`);
});


export default app;
