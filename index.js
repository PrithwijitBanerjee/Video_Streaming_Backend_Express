import app from './app.js';
import appConfig from './config/config.js';
import { connnectDB } from './config/db_config.js';

const PORT = appConfig.app.port || process.env.PORT;

app.listen(PORT, async () => {
    console.log(`Server is running at: http://localhost:${PORT}`);
    await connnectDB();
});