/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call -- supertest bodies are untyped by design */
// New tables land on free spots of the floor, end to end against a REAL,
// migrated + seeded Postgres. Opt-in:
//   LIFECYCLE_E2E=1 DATABASE_URL=... JWT_SECRET=x npx jest --config ./test/jest-e2e.json table-placement
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ThrottlerStorage } from '@nestjs/throttler';
import { randomUUID } from 'crypto';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

const run = process.env.LIFECYCLE_E2E ? describe : describe.skip;
const BRANCH = 'demo-branch';
const q = `?branchId=${BRANCH}`;
const tag = randomUUID().slice(0, 6);

run('Table placement on the floor (e2e)', () => {
  let app: INestApplication<App>;
  let owner: ReturnType<typeof request.agent>;
  let floorId: string;

  const o = () => ({
    get: (p: string) => owner.get(`/api/v1${p}`),
    post: (p: string, b?: object) => owner.post(`/api/v1${p}`).send(b),
  });

  beforeAll(async () => {
    const mod = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(ThrottlerStorage)
      .useValue({
        increment: () =>
          Promise.resolve({
            totalHits: 1,
            timeToExpire: 60,
            isBlocked: false,
            timeToBlockExpire: 0,
          }),
      })
      .compile();
    app = mod.createNestApplication();
    app.use(cookieParser());
    app.setGlobalPrefix('api', { exclude: [] });
    await app.init();

    owner = request.agent(app.getHttpServer());
    await owner
      .post('/api/v1/auth/login')
      .send({ email: 'owner@demo.local', password: 'Password123!' })
      .expect(201);
    const floor = await o()
      .post(`/tables/floors${q}`, { name: `QA floor ${tag}` })
      .expect(201);
    floorId = floor.body.id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('places single and bulk-added tables on free spots (BUG-012)', async () => {
    for (const n of ['S1', 'S2']) {
      await o()
        .post(`/tables${q}`, { floorId, number: `${n}-${tag}`, capacity: 4 })
        .expect(201);
    }
    await o()
      .post(`/tables/bulk${q}`, {
        floorId,
        numbers: [`B1-${tag}`, `B2-${tag}`],
        capacity: 2,
      })
      .expect(201);
    const floors = (await o().get(`/tables/floors${q}`).expect(200)).body;
    const tables = floors.find((f: { id: string }) => f.id === floorId)
      .tables as { posX: number; posY: number }[];
    const spots = tables.map((t) => `${t.posX},${t.posY}`);
    expect(spots).toHaveLength(4);
    expect(new Set(spots).size).toBe(4);
  });
});
