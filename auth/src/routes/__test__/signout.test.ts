import request from 'supertest';
import { app } from '../../app';

it('clears the cookie after signing out', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201);

  const response = await request(app)
    .post('/api/users/signout')
    .send({})
    .expect(200);

  const setCookie = response.get('Set-Cookie');
  if (setCookie) {
    console.log(response.get("Set-Cookie"));
    
    expect(setCookie[0]).toEqual(
      'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly'
    );
  } else {
    throw new Error("Response doesn't contain 'Set-Cookie' header");
  }
});
