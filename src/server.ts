import { Server } from 'http';
import app from './app'
import config from "./config";
import mongoose from 'mongoose';



let server: Server;
async function main() {
  await mongoose.connect(config.database_url!);
  console.log('Connected to Book Server Database using Mongoose');
  server = app.listen(config.port, () => {
    console.log(`App listening on port ${config.port}`)
  })

}
main()

