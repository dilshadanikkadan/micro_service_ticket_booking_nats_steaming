import request from 'supertest';
import { app } from '../../app';

const createTicket = () => {
    const cookie = (global as any).signin()
    console.log("cookie",cookie);
    
  return request(app).post('/api/tickets').set('Cookie', cookie).send({
    title: 'asldkf',
    price: 20,
  });
};

it('can fetch a list of tickets', async () => {
  await createTicket();
  await createTicket();
  await createTicket();

  const response = await request(app).get('/api/tickets').send()
   console.log("response",response.body);
   
  expect(response.body.length).toEqual(3);
});
