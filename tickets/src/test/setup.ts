import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../app";
import jwt from 'jsonwebtoken'
declare global {
    namespace NodeJS {
      interface Global {
        signin(): string[]
      }
    }
  }
let mongo: any;
beforeAll(async () => {
    process.env.JWT_KEY = 'dilu';
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  
    mongo = new MongoMemoryServer()
    await mongo.start()
    
    const uri = await mongo.getUri()
    
    const mongooseOptions = {
        useNewUrlParser:true,
    };
    
    await mongoose.connect(uri)
  });
  
  beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();
  
    for (let collection of collections) {
      await collection.deleteMany({});
    }
  });
  
    afterAll(async () => {
      await mongo.stop();
      await mongoose.connection.close();
    });
  

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

(global as any).signin =  () => {
    const payload ={
      email:'test@test.com',
      id: new mongoose.Types.ObjectId().toHexString()

    }

    const token = jwt.sign(payload,process.env.JWT_KEY!)
    const session ={jwt:token}
    const jsonSession = JSON.stringify(session);
    const base64 = Buffer.from(jsonSession).toString('base64')
    
    return [`session=${base64}`]
  };