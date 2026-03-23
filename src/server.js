import 'dotenv/config';
import app from './app.js';
import connectDB from './config/connection.js';
import { startWeeklyJob } from './jobs/weeklyPostJob.js';

const PORT = process.env.PORT || 3000;

connectDB();
startWeeklyJob();

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
