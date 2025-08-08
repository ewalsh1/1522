# Auto Inventory Backend

Simple Node/Express API with JSON-file storage.

## Setup
```bash
cd backend
cp .env.example .env   # edit as needed
npm install
npm run start
```

### API
- `GET /api/health`
- `GET /api/models`
- `GET /api/inventory?type=new|used`
- `POST /api/models` (admin) body: `{ "model": { ... } }` header: `x-api-key`
- `POST /api/inventory` (admin) body: `{ "item": { ... } }` header: `x-api-key`
- `PATCH /api/inventory/:id` (admin)
- `DELETE /api/inventory/:id` (admin)
- `POST /api/upload` (admin, `multipart/form-data` field `image`) returns `{ path }`
