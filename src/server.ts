import app from "./app";
import { Logger } from "./utilities/logger";

const PORT = 5050;

app.listen(PORT, () => {
  Logger.info(`Server running at http://localhost:${PORT}`);
});
