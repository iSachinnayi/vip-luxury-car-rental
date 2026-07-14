// SSH helper — connect with password, add SSH key, check server
const { Client } = require("ssh2");
const fs = require("fs");
const path = require("path");

const HOST = "178.128.83.247";
const PORT = 22;
const USER = "root";
const PASSWORD = "V0i451{_zsp;";

const conn = new Client();

conn.on("ready", () => {
  console.log("✅ Connected to server!");
  
  // 1. Check server specs
  conn.exec("hostname && nproc && free -h | grep Mem && df -h / | tail -1 && cat /etc/os-release | grep -E '^NAME=|^VERSION=' ", (err, stream) => {
    if (err) { console.error("exec error:", err); conn.end(); return; }
    let output = "";
    stream.on("data", (d) => { output += d.toString(); });
    stream.on("close", () => {
      console.log("\n📋 SERVER INFO:\n" + output);
      
      // 2. Add SSH public key
      const pubKeyPath = path.join(process.env.USERPROFILE, ".ssh", "id_ed25519.pub");
      if (fs.existsSync(pubKeyPath)) {
        const pubKey = fs.readFileSync(pubKeyPath, "utf-8").trim();
        console.log("📋 Public key found, adding to authorized_keys...");
        
        conn.exec(`mkdir -p ~/.ssh && echo '${pubKey}' >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys && chmod 700 ~/.ssh`, (err2, stream2) => {
          if (err2) { console.error("key add error:", err2); }
          let out2 = "";
          stream2.on("data", (d) => { out2 += d.toString(); });
          stream2.on("close", () => {
            console.log("✅ SSH key added! You can now login without password.");
            console.log("Test: ssh root@178.128.83.247");
            
            // 3. Check current WordOps / WordPress setup
            conn.exec("ls /var/www/ && nginx -t 2>&1 && echo '---' && wp option get siteurl 2>/dev/null || echo 'no wp-cli'", (err3, stream3) => {
              let out3 = "";
              stream3.on("data", (d) => { out3 += d.toString(); });
              stream3.on("close", () => {
                console.log("\n📋 WEB SETUP:\n" + out3);
                conn.end();
                process.exit(0);
              });
            });
          });
        });
      } else {
        console.log("❌ No public key found at:", pubKeyPath);
        conn.end();
        process.exit(1);
      }
    });
  });
});

conn.on("error", (err) => {
  console.error("❌ Connection error:", err.message);
  process.exit(1);
});

conn.connect({
  host: HOST,
  port: PORT,
  username: USER,
  password: PASSWORD,
  readyTimeout: 10000,
});
