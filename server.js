import express from 'express';
import bodyParser from 'body-parser';
import routes from './server/routes/index';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(routes);

const PORT = process.env.port || 5000;
app.listen(PORT, () => {
  console.log(`App running at port ${PORT}`);
});


export default app;
