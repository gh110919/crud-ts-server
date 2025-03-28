import { exec } from "child_process";

export const killProcessOnPort = async (port: number) => {
  try {
    if (process.platform === "win32") {
      const netstatFindstr = exec(`netstat -ano | findstr :${port}`);
      const matches = netstatFindstr.toString().match(/\\d+$/)!;

      if (matches) {
        exec(`taskkill /PID ${matches[0]} /F`);
      }
    } else {
      const lsofTcpGrep = exec(`lsof -i tcp:${port} | grep LISTEN`);
      const matches = lsofTcpGrep.toString().split(/\\s+/);

      if (matches) {
        exec(`kill -9 ${matches[1]}`);
      }
    }
  } catch (error) {
    console.log("No process found or error killing process:", error.message);
  }
};
