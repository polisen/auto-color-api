import {app} from './api';
const port = process.env.PORT || 3333;

app.listen(port, () => console.log('available at port ', port));

