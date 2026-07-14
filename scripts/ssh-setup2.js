const { Client } = require("ssh2");
const fs = require("fs");
const path = require("path");

const HOST = "178.128.83.247";
const USER = "root";

const conn = new Client();

conn.on("ready", () => {
  console.log("✅ CONNECTED!");
  
  // Add the key permanently to authorized_keys
  const pubKey = fs.readFileSync(
    path.join(process.env.USERPROFILE, ".ssh", "id_ed25519.pub"),
    "utf-8"
  ).trim();

  conn.exec(`echo '${pubKey.replace(/'/g, "'\\''")}' >> ~/.ssh/authorized_keys && echo "KEY ADDED"`, (err, stream) => {
    if (err) { console.error("Error:", err.message); conn.end(); return; }
    let out = "";
    stream.on("data", (d) => { out += d.toString(); });
    stream.on("close", () => {
      console.log("Output:", out.trim());
      
      // Get server info
      conn.exec("hostname && nproc && free -h | grep Mem && df -h / | tail -1 && cat /etc/os-release | grep PRETTY_NAME && node --version 2>/dev/null || echo 'no node' && nginx -t 2>&1", (e2, s2) => {
        let o2 = "";
        s2.on("data", (d) => { o2 += d.toString(); });
        s2.on("close", () => {
          console.log("\n=== SERVER INFO ===");
          console.log(o2);
          conn.end();
          process.exit(0);
        });
      });
    });
  });
});

conn.on("error", (err) => {
  console.error("❌", err.message);
  process.exit(1);
});

// Try keyboard-interactive auth (password) since publickey failed
conn.connect({
  host: HOST,
  port: 22,
  username: USER,
  tryKeyboard: true,
  readyTimeout: 15000,
  // Also try agent-based auth
});
