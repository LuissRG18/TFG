const request = require('supertest');
const jwt = require('jsonwebtoken');
const { buildTestApp } = require('./testApp');
const { crearUsuario } = require('./helpers');

const app = buildTestApp();

describe('POST /api/auth/registro', () => {
  test('registra un usuario nuevo y devuelve token + 201', async () => {
    const res = await request(app)
      .post('/api/auth/registro')
      .send({
        nombre: 'María García',
        email: 'maria@example.com',
        password: 'mipassword123',
        areasInteres: ['cs'],
      });

    expect(res.status).toBe(201);
    expect(res.body.ok).toBe(true);
    expect(res.body.token).toEqual(expect.any(String));
    expect(res.body.usuario.email).toBe('maria@example.com');
    expect(res.body.usuario.rol).toBe('usuario');
    expect(res.body.usuario).not.toHaveProperty('password');
  });

  test('rechaza email duplicado con 400', async () => {
    await crearUsuario({ email: 'dup@example.com' });

    const res = await request(app)
      .post('/api/auth/registro')
      .send({ nombre: 'Otra', email: 'dup@example.com', password: 'otrapass1' });

    expect(res.status).toBe(400);
    expect(res.body.ok).toBe(false);
    expect(res.body.mensaje).toMatch(/ya existe/i);
  });

  test('rechaza email con formato inválido con 500 (validación Mongoose)', async () => {
    const res = await request(app)
      .post('/api/auth/registro')
      .send({ nombre: 'Mal', email: 'no-es-email', password: 'algopass' });

    expect(res.status).toBe(500);
    expect(res.body.ok).toBe(false);
  });
});

describe('POST /api/auth/login', () => {
  test('devuelve 200 + token con credenciales correctas', async () => {
    await crearUsuario({ email: 'ok@example.com', password: 'passwordok' });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'ok@example.com', password: 'passwordok' });

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.token).toEqual(expect.any(String));
  });

  test('responde 401 con contraseña incorrecta', async () => {
    await crearUsuario({ email: 'badpass@example.com', password: 'correctpw1' });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'badpass@example.com', password: 'pass-equivocada' });

    expect(res.status).toBe(401);
    expect(res.body.ok).toBe(false);
  });

  test('responde 401 con email inexistente', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'no-existe@example.com', password: 'cualquiera1' });

    expect(res.status).toBe(401);
  });

  test('responde 400 si falta email o password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'algo@example.com' });

    expect(res.status).toBe(400);
  });

  test('responde 401 si el usuario está desactivado', async () => {
    await crearUsuario({ email: 'inactivo@example.com', password: 'algopass1', activo: false });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'inactivo@example.com', password: 'algopass1' });

    expect(res.status).toBe(401);
  });
});

describe('Middleware proteger (rutas privadas)', () => {
  test('responde 401 si no se envía Authorization header', async () => {
    const res = await request(app).get('/api/auth/perfil');
    expect(res.status).toBe(401);
    expect(res.body.mensaje).toMatch(/token/i);
  });

  test('responde 401 con token inválido', async () => {
    const res = await request(app)
      .get('/api/auth/perfil')
      .set('Authorization', 'Bearer no-es-un-jwt-valido');

    expect(res.status).toBe(401);
  });

  test('responde 401 con token firmado con otro secret', async () => {
    const tokenFake = jwt.sign({ id: '507f1f77bcf86cd799439011' }, 'otro-secret', { expiresIn: '1h' });
    const res = await request(app)
      .get('/api/auth/perfil')
      .set('Authorization', `Bearer ${tokenFake}`);

    expect(res.status).toBe(401);
  });

  test('responde 200 con un token válido y devuelve el usuario', async () => {
    const { usuario, token } = await crearUsuario({ email: 'priv@example.com' });

    const res = await request(app)
      .get('/api/auth/perfil')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.usuario.email).toBe(usuario.email);
  });
});

describe('Middleware soloAdmin (rutas de administración)', () => {
  test('un usuario normal recibe 403 en /api/usuarios', async () => {
    const { token } = await crearUsuario({ email: 'normal@example.com', rol: 'usuario' });

    const res = await request(app)
      .get('/api/usuarios')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(403);
  });

  test('un admin sí puede acceder a /api/usuarios', async () => {
    const { token } = await crearUsuario({ email: 'admin@example.com', rol: 'admin' });

    const res = await request(app)
      .get('/api/usuarios')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
  });
});
