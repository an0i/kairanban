## 接口

### POST `/api/instance/create`

- Request:

```json
{
  "password": "PASS",
  "text": "TEXT"
}
```

- Response:

Code: `200`

```json
{ "id": "123456" }
```

Code: `500`

```json
{ "error": "请重试" }
```

Code: `503`

```json
{ "error": "可用实例较少" }
```

### POST `/api/instance/save`

- Request:

```json
{
  "id": "123456",
  "password": "PASS",
  "text": "TEXT"
}
```

- Response:

Code: `200`

```json
{ "id": "123456" }
```

Code: `404`

```json
{ "error": "没有该实例或密码错误" }
```

### POST `/api/instance/pull`

- Request:

```json
{
  "id": "123456",
  "password": "PASS"
}
```

- Response:

Code: `200`

```json
{ "text": "TEXT" }
```

Code: `404`

```json
{ "error": "没有该实例或密码错误" }
```

### POST `/api/instance/destroy`

- Request:

```json
{
  "id": "123456",
  "password": "PASS"
}
```

- Response:

Code: `200`

```json
{ "id": "123456" }
```

Code: `404`

```json
{ "error": "没有该实例或密码错误" }
```

### 请求Json缺少参数

- Response:

Code: `422`

```json
{ "error": "请求json参数(id)缺失或类型不正确" }
```
```json
{ "error": "请求json参数(id,text)缺失或类型不正确" }
```
```json
{ "error": "请求json参数(id,text,password)缺失或类型不正确" }
```
```
......
```
