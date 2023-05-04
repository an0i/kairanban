import express from 'express';
import cors from 'cors';
import { Redis } from '@upstash/redis';

function genRandomIdNum(min = 100000, max = 1000000) {
  // 不包括最大值，包括最小值
  return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min)) + Math.ceil(min));
}

const redis = Redis.fromEnv({ automaticDeserialization: false }); // Env
// const redis = new Redis({ url: 'https://xxxxxxxx.upstash.io', token: 'xxxxxxxx', automaticDeserialization: false, }); // Manual

const keyPrefix = 'kairanban-';

class Instance {
  constructor(id, text, passoword) {
    this.id = id;
    this.text = text;
    this.password = passoword;
  }

  get key() {
    return keyPrefix + this.id;
  }

  create() {
    return redis.eval("if(redis.call('EXISTS', KEYS[1])==0)then redis.call('HSET', KEYS[1], 'password', ARGV[1], 'text', ARGV[2]) return redis.call('EXPIRE', KEYS[1], '600') end", [this.key], [this.password, this.text]);
  }

  save() {
    return redis.eval("if(redis.call('HGET', KEYS[1], 'password')==ARGV[1])then redis.call('HSET', KEYS[1], 'text', ARGV[2]) return redis.call('EXPIRE', KEYS[1], '600') end", [this.key], [this.password, this.text]);
  }

  async pull() {
    this.text = await redis.eval("if(redis.call('HGET', KEYS[1], 'password')==ARGV[1])then redis.call('EXPIRE', KEYS[1], '600') return redis.call('HGET', KEYS[1], 'text') end", [this.key], [this.password]);
    return this.text;
  }

  destroy() {
    return redis.eval("if(redis.call('HGET', KEYS[1], 'password')==ARGV[1])then return redis.call('DEL', KEYS[1]) end", [this.key], [this.password]);
  }
}

const app = express();
app.use(cors({ origin: [/^https?:\/\/kai-web\.vercel\.app$/] }));
app.use(express.json());

function checkBody(needs) {
  return (req, res, next) => {
    const miss = [];
    needs.forEach((need) => {
      if (typeof req.body[need] !== 'string') {
        miss.push(need);
      }
    });
    if (miss.length === 0) {
      next();
    } else {
      res.status(422).send({ error: `请求json参数(${miss.join(',')})缺失或类型不正确` });
    }
  };
}

app.post('/api/instance/create', checkBody(['text', 'password']), async (req, res) => {
  const randomId = genRandomIdNum().toString();
  const instance = new Instance(randomId, req.body.text, req.body.password);
  if ((await redis.dbsize()) <= 123756) {
    if (await instance.create() === 1) {
      res.send({ id: instance.id });
    } else {
      res.status(500).send({ error: '请重试' });
    }
  } else {
    res.status(503).send({ error: '可用实例较少' });
  }
});

app.post('/api/instance/save', checkBody(['id', 'text', 'password']), async (req, res) => {
  const instance = new Instance(req.body.id, req.body.text, req.body.password);
  if (await instance.save() === 1) {
    res.send({ id: instance.id });
  } else {
    res.status(404).send({ error: '没有该实例或密码错误' });
  }
});

app.post('/api/instance/pull', checkBody(['id', 'password']), async (req, res) => {
  const instance = new Instance(req.body.id, null, req.body.password);
  if (await instance.pull() !== null) {
    res.send({ text: instance.text });
  } else {
    res.status(404).send({ error: '没有该实例或密码错误' });
  }
});

app.post('/api/instance/destroy', checkBody(['id', 'password']), async (req, res) => {
  const instance = new Instance(req.body.id, null, req.body.password);
  if (await instance.destroy() === 1) {
    res.send({ id: instance.id });
  } else {
    res.status(404).send({ error: '没有该实例或密码错误' });
  }
});

// app.listen(3000, () => {
//   console.log('Example app listening on port 3000');
// });
export default app;
