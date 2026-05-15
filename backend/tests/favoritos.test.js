const request = require('supertest');
const { buildTestApp } = require('./testApp');
const { crearUsuario } = require('./helpers');

const app = buildTestApp();

const articuloBase = {
  articuloId: '2301.07218',
  fuente: 'arxiv',
  titulo: 'A Survey on Machine Learning for Scientific Discovery',
  autores: ['Smith, J.', 'Doe, A.'],
  anio: 2023,
  abstract: 'Resumen de prueba.',
  area: 'cs',
  palabrasClave: ['cs.LG'],
  urlOriginal: 'https://arxiv.org/abs/2301.07218',
  urlPdf: 'https://arxiv.org/pdf/2301.07218',
  revista: 'arXiv',
};

describe('POST /api/favoritos', () => {
  test('crea un favorito y devuelve 201 con el documento guardado', async () => {
    const { token } = await crearUsuario({ email: 'fav1@example.com' });

    const res = await request(app)
      .post('/api/favoritos')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...articuloBase, notas: 'Interesante', etiquetas: ['ml'], coleccion: 'TFG' });

    expect(res.status).toBe(201);
    expect(res.body.ok).toBe(true);
    expect(res.body.favorito.articuloId).toBe(articuloBase.articuloId);
    expect(res.body.favorito.notas).toBe('Interesante');
    expect(res.body.favorito.etiquetas).toEqual(['ml']);
    expect(res.body.favorito.coleccion).toBe('TFG');
  });

  test('rechaza duplicado del mismo (usuario, articuloId, fuente) con 400', async () => {
    const { token } = await crearUsuario({ email: 'fav2@example.com' });

    await request(app)
      .post('/api/favoritos')
      .set('Authorization', `Bearer ${token}`)
      .send(articuloBase);

    const dup = await request(app)
      .post('/api/favoritos')
      .set('Authorization', `Bearer ${token}`)
      .send(articuloBase);

    expect(dup.status).toBe(400);
    expect(dup.body.mensaje).toMatch(/ya está/i);
  });

  test('responde 401 sin token', async () => {
    const res = await request(app).post('/api/favoritos').send(articuloBase);
    expect(res.status).toBe(401);
  });
});

describe('GET /api/favoritos', () => {
  test('lista solo los favoritos del usuario autenticado', async () => {
    const { token: tokenA } = await crearUsuario({ email: 'a@example.com' });
    const { token: tokenB } = await crearUsuario({ email: 'b@example.com' });

    await request(app)
      .post('/api/favoritos')
      .set('Authorization', `Bearer ${tokenA}`)
      .send(articuloBase);

    await request(app)
      .post('/api/favoritos')
      .set('Authorization', `Bearer ${tokenB}`)
      .send({ ...articuloBase, articuloId: '9999.99999', titulo: 'Otro de B' });

    const resA = await request(app)
      .get('/api/favoritos')
      .set('Authorization', `Bearer ${tokenA}`);

    expect(resA.status).toBe(200);
    expect(resA.body.total).toBe(1);
    expect(resA.body.favoritos[0].articuloId).toBe(articuloBase.articuloId);
  });

  test('filtra por fuente correctamente', async () => {
    const { token } = await crearUsuario({ email: 'filtro@example.com' });

    await request(app)
      .post('/api/favoritos')
      .set('Authorization', `Bearer ${token}`)
      .send(articuloBase);

    await request(app)
      .post('/api/favoritos')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...articuloBase, articuloId: '10.1234/x', fuente: 'crossref' });

    const res = await request(app)
      .get('/api/favoritos?fuente=crossref')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.total).toBe(1);
    expect(res.body.favoritos[0].fuente).toBe('crossref');
  });
});

describe('PUT /api/favoritos/:id', () => {
  test('actualiza notas y etiquetas y devuelve 200', async () => {
    const { token } = await crearUsuario({ email: 'put@example.com' });

    const creado = await request(app)
      .post('/api/favoritos')
      .set('Authorization', `Bearer ${token}`)
      .send(articuloBase);
    const id = creado.body.favorito._id;

    const res = await request(app)
      .put(`/api/favoritos/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ notas: 'Nota actualizada', etiquetas: ['nuevo-tag'], leidoMasTarde: true });

    expect(res.status).toBe(200);
    expect(res.body.favorito.notas).toBe('Nota actualizada');
    expect(res.body.favorito.etiquetas).toEqual(['nuevo-tag']);
    expect(res.body.favorito.leidoMasTarde).toBe(true);
  });

  test('un usuario no puede actualizar el favorito de otro (responde 404)', async () => {
    const { token: tokenA } = await crearUsuario({ email: 'a2@example.com' });
    const { token: tokenB } = await crearUsuario({ email: 'b2@example.com' });

    const creado = await request(app)
      .post('/api/favoritos')
      .set('Authorization', `Bearer ${tokenA}`)
      .send(articuloBase);
    const id = creado.body.favorito._id;

    const res = await request(app)
      .put(`/api/favoritos/${id}`)
      .set('Authorization', `Bearer ${tokenB}`)
      .send({ notas: 'Intento de modificación' });

    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/favoritos/:id', () => {
  test('elimina el favorito propio con 200', async () => {
    const { token } = await crearUsuario({ email: 'del@example.com' });

    const creado = await request(app)
      .post('/api/favoritos')
      .set('Authorization', `Bearer ${token}`)
      .send(articuloBase);
    const id = creado.body.favorito._id;

    const res = await request(app)
      .delete(`/api/favoritos/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);

    const list = await request(app)
      .get('/api/favoritos')
      .set('Authorization', `Bearer ${token}`);
    expect(list.body.total).toBe(0);
  });

  test('un usuario no puede borrar el favorito de otro (responde 404)', async () => {
    const { token: tokenA } = await crearUsuario({ email: 'a3@example.com' });
    const { token: tokenB } = await crearUsuario({ email: 'b3@example.com' });

    const creado = await request(app)
      .post('/api/favoritos')
      .set('Authorization', `Bearer ${tokenA}`)
      .send(articuloBase);
    const id = creado.body.favorito._id;

    const res = await request(app)
      .delete(`/api/favoritos/${id}`)
      .set('Authorization', `Bearer ${tokenB}`);

    expect(res.status).toBe(404);
  });
});
