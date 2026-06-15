# FlairTech Solutions — Website

Full-stack website for [FlairTech Solutions](https://www.flairtechsolutions.com), rebuilt from scratch with:

- **Frontend**: React 18 + React Router
- **Backend**: Node.js + Express
- **Database**: Azure SQL Database
- **File Storage**: Azure Blob Storage (resume uploads)
- **Hosting**: Azure App Service (Linux, Node 18)
- **CI/CD**: GitHub Actions

---

## Pages

| Page | Route | Features |
|------|-------|----------|
| Home | `/` | Hero carousel, services grid, testimonials, stats |
| About | `/about` | Company info, core values, office locations |
| Services | `/services` | 6 service cards with skills |
| Careers | `/careers` | Live job listings from Azure SQL + Apply modal |
| Contact | `/contact` | Contact form → persists to Azure SQL |

---

## Azure Infrastructure Setup

### 1. Resource Group

```bash
az group create --name flairtechsolutions-rg --location westus2
```

### 2. Azure SQL Database

```bash
# Create SQL Server
az sql server create \
  --name flairtechsolutions-sql \
  --resource-group flairtechsolutions-rg \
  --location westus2 \
  --admin-user sqladmin \
  --admin-password "YourStrongPassword123!"

# Allow Azure services to connect
az sql server firewall-rule create \
  --resource-group flairtechsolutions-rg \
  --server flairtechsolutions-sql \
  --name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0

# Create the database (Basic tier ~$5/month)
az sql db create \
  --resource-group flairtechsolutions-rg \
  --server flairtechsolutions-sql \
  --name flairtechdb \
  --service-objective Basic
```

> **Connection string values** (update `.env`):
> - `AZURE_SQL_SERVER`: `flairtechsolutions-sql.database.windows.net`
> - `AZURE_SQL_DATABASE`: `flairtechdb`

### 3. Azure Blob Storage

```bash
# Create storage account
az storage account create \
  --name flairtechstorage \
  --resource-group flairtechsolutions-rg \
  --location westus2 \
  --sku Standard_LRS \
  --kind StorageV2

# Get connection string
az storage account show-connection-string \
  --name flairtechstorage \
  --resource-group flairtechsolutions-rg \
  --query connectionString -o tsv
```

Copy the output and set it as `AZURE_BLOB_CONNECTION_STRING` in your `.env`.

> The app will auto-create the `resumes` container on first start.

### 4. Azure App Service

```bash
# Create App Service plan (B1 = ~$13/month)
az appservice plan create \
  --name flairtechsolutions-plan \
  --resource-group flairtechsolutions-rg \
  --sku B1 \
  --is-linux

# Create Web App
az webapp create \
  --resource-group flairtechsolutions-rg \
  --plan flairtechsolutions-plan \
  --name flairtechsolutions-web \
  --runtime "NODE:18-lts"

# Set startup command
az webapp config set \
  --resource-group flairtechsolutions-rg \
  --name flairtechsolutions-web \
  --startup-file "node backend/server.js"
```

### 5. Set App Service Environment Variables

```bash
az webapp config appsettings set \
  --resource-group flairtechsolutions-rg \
  --name flairtechsolutions-web \
  --settings \
    AZURE_SQL_SERVER="flairtechsolutions-sql.database.windows.net" \
    AZURE_SQL_DATABASE="flairtechdb" \
    AZURE_SQL_USER="sqladmin" \
    AZURE_SQL_PASSWORD="YourStrongPassword123!" \
    AZURE_SQL_PORT="1433" \
    AZURE_BLOB_CONNECTION_STRING="DefaultEndpointsProtocol=https;..." \
    AZURE_BLOB_CONTAINER_NAME="resumes" \
    NODE_ENV="production" \
    WEBSITE_NODE_DEFAULT_VERSION="~18"
```

---

## GitHub Actions Setup

1. In Azure Portal → App Service → **Get Publish Profile** → download the `.PublishSettings` file
2. In your GitHub repo → Settings → Secrets → Actions → **New repository secret**:
   - Name: `AZURE_WEBAPP_PUBLISH_PROFILE`
   - Value: paste the full contents of the `.PublishSettings` file
3. Push to `main` → the workflow will build and deploy automatically

---

## Local Development

```bash
# 1. Clone and install
git clone <your-repo>
npm run install:all

# 2. Create backend/.env (copy from backend/.env.example)
cp backend/.env.example backend/.env
# Fill in your Azure credentials

# 3. Start backend (port 8080)
npm run dev:backend

# 4. In a new terminal, start frontend (port 3000, proxies API to 8080)
npm run dev:frontend
```

---

## Project Structure

```
flairtechsolutions/
├── backend/
│   ├── config/
│   │   ├── database.js        # Azure SQL connection + table init
│   │   └── blobStorage.js     # Azure Blob Storage upload/delete
│   ├── routes/
│   │   ├── jobs.js            # GET/POST/DELETE job listings
│   │   ├── applications.js    # POST application + resume upload
│   │   └── contact.js         # POST contact message
│   ├── server.js              # Express app entry point
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx/css
│   │   │   └── Footer.jsx/css
│   │   ├── pages/
│   │   │   ├── Home.jsx/css
│   │   │   ├── About.jsx/css
│   │   │   ├── Services.jsx/css
│   │   │   ├── Careers.jsx/css
│   │   │   └── Contact.jsx/css
│   │   ├── api.js             # Axios API client
│   │   ├── App.jsx            # Router
│   │   ├── index.js
│   │   └── index.css          # Global styles + CSS variables
│   └── package.json
├── .github/
│   └── workflows/
│       └── deploy.yml         # CI/CD to Azure App Service
├── web.config                 # IIS/Azure routing
├── package.json               # Root scripts
└── README.md
```

---

## Database Tables

| Table | Purpose |
|-------|---------|
| `JobListings` | Job postings (seeded with 3 initial listings) |
| `Applications` | Career applications (linked to job, stores Blob URL) |
| `ContactMessages` | Contact form submissions |

Tables are auto-created on first server start via `initializeDatabase()`.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/jobs` | List all active job listings |
| GET | `/api/jobs/:id` | Get single job |
| POST | `/api/jobs` | Create job listing |
| DELETE | `/api/jobs/:id` | Soft-delete job |
| POST | `/api/applications` | Submit application (multipart — resume → Blob) |
| POST | `/api/contact` | Submit contact message |
