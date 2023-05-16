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

|Code|Body|
|---|---|
|200|`{ "id": "123456" }`|
|500|`{ "error": "请重试" }`|
|503|`{ "error": "可用实例较少" }`|

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

|Code|Body|
|---|---|
|200|`{ "id": "123456" }`|
|404|`{ "error": "没有该实例或密码错误" }`|

### POST `/api/instance/pull`

- Request:

```json
{
  "id": "123456",
  "password": "PASS"
}
```

- Response:

|Code|Body|
|---|---|
|200|`{ "text": "TEXT" }`|
|404|`{ "error": "没有该实例或密码错误" }`|

### POST `/api/instance/destroy`

- Request:

```json
{
  "id": "123456",
  "password": "PASS"
}
```

- Response:

|Code|Body|
|---|---|
|200|`{ "id": "123456" }`|
|404|`{ "error": "没有该实例或密码错误" }`|

### 请求Json缺少参数

- Response:

|Code|Body|
|---|---|
|422|`{ "error": "请求json参数(id)缺失或类型不正确" }`|
||`{ "error": "请求json参数(id,text)缺失或类型不正确" }`|
||`{ "error": "请求json参数(id,text,password)缺失或类型不正确" }`|
||`......`|
