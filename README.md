# FiscalMind: AI-Powered Indian Budget & Economic Intelligence Dashboard

FiscalMind is a production-ready web platform designed to simplify and visualize India's financial and economic data. It transforms complex government budget documents into interactive dashboards and provides AI-powered insights for citizens.

## 🚀 Key Features

- **Centralized Budget Data**: Aggregated Union Budget data including revenue, expenditure, and fiscal deficit.
- **Sector-Wise Analytics**: Interactive dashboards for key sectors like Agriculture, Defence, and Education.
- **AI-Powered Insights**: "Chat with Budget" feature using OpenAI to explain policies in plain English.
- **Modern UI**: Built with Next.js, Tailwind CSS, and ShadCN-like components.
- **API-First Design**: Robust Express.js backend with MongoDB storage.

## 🛠 Tech Stack

- **Frontend**: Next.js 14, Tailwind CSS, Recharts, Lucide React.
- **Backend**: Node.js, Express.js, Mongoose (MongoDB).
- **AI Integration**: OpenAI API (GPT-3.5/4).
- **Data Pipeline**: Python scripts for scraping and seeding.

## 📂 Project Structure

```bash
FiscalMind/
├── frontend/          # Next.js Application
├── backend/           # Express.js Server & API
└── data-pipeline/     # Python scripts for data processing
```

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (running locally or cloud URI)
- Python (v3.8+) [Optional for data pipeline]

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure Environment:
   Create a `.env` file in `backend/` and add:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/fiscalmind
   OPENAI_API_KEY=your_openai_api_key_here
   ```
4. Seed Database (Populate sample data):
   ```bash
   node seed.js
   ```
5. Start the Server:
   ```bash
   npm start
   ```
   Server will run on `http://localhost:5000`.

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Development Server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:3000` in your browser.

## 📊 Data Pipeline (Optional)

You can run Python scripts to scrape or verify data.
1. Navigate to `data-pipeline/`.
2. Install requirements (if any, e.g., `requests`, `pymongo`).
3. Run scripts:
   ```bash
   python scrape_budget.py
   ```

## 🚀 Deployment

- **Frontend**: deploy to **Vercel** (Connect GitHub repo, auto-detect Next.js).
- **Backend**: Update `server.js` `cors` settings for production domain. Deploy to **Render** or **Railway**.
- **Database**: Use **MongoDB Atlas**.

## License

MIT
