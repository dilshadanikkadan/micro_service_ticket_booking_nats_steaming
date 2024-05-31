import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../app";

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

(global as any).signin = async () => {
    const email = "test@test.com";
    const password = "password";
  
    try {
      const response = await request(app)
        .post("/api/users/signup")
        .send({ email, password })
        .expect(201);
  
      const cookie = response.get("Set-Cookie");
      return cookie;
    } catch (error) {
      console.error("Error during signin:", error);
      throw error;
    }
  };