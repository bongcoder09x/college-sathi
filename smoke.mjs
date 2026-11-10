import { spawn } from "node:child_process";

const port = 3111;
const server = spawn("npx", ["next", "start", "-p", String(port)], { stdio: "pipe" });
let up = false;
await new Promise((resolve) => {
  server.stdout.on("data", (d) => {
    if (String(d).includes("Ready") || String(d).includes("started server")) {
      up = true;
      resolve();
    }
  });
  setTimeout(resolve, 12000);
});

const paths = [
  "/", "/programs", "/programs/btech-cse", "/programs/msc-physics", "/campuses", "/campuses/main",
  "/campuses/polytechnic", "/notices", "/events", "/results/lookup", "/verify",
  "/verify/CS-CERT-2024-001", "/verify/CS-CERT-2023-119", "/verify/CS-CERT-9999", "/contact", "/apply",
  "/apply/CS-APP-1042", "/apply/CS-APP-1042/status", "/apply/CS-APP-1042/receipt",
  "/apply/CS-APP-1042/hall-ticket", "/apply/CS-APP-1103/offer", "/student", "/admin",
  "/api/programs?level=PG", "/api/notices", "/api/tenant", "/api/applications"
];

for (const p of paths) {
  try {
    const r = await fetch(`http://127.0.0.1:${port}${p}`);
    const body = await r.text();
    console.log(`${r.status}  ${p}  ${body.length}b`);
  } catch (e) {
    console.log(`ERR ${p} ${e.message}`);
  }
}

// functional checks
const post = async (p, body) => {
  const r = await fetch(`http://127.0.0.1:${port}${p}`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
  });
  return [r.status, await r.json()];
};
console.log("result-ok", (await post("/api/results", { rollNo: "CS2201", dob: "2003-05-14" }))[1].found);
console.log("result-bad", (await post("/api/results", { rollNo: "CS2201", dob: "2000-01-01" }))[1].found);
console.log("contact", (await post("/api/contact", { name: "Test", phone: "9800000000", message: "hello" }))[1].ok);
console.log("otp", (await post("/api/auth/otp", { contact: "9800011111" }))[1].ok);
const v = await post("/api/auth/verify", { contact: "9800011111", otp: "482913" });
console.log("verify+create", v[1].ok, v[1].application?.id);
const newId = v[1].application.id;
console.log("patch", (await fetch(`http://127.0.0.1:${port}/api/applications/${newId}`, {
  method: "PATCH", headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ step: 2, personal: { fullName: "Smoke Test" } }),
})).status);
const pay = await post(`/api/applications/${newId}/payment`, { kind: "application" });
console.log("payment", pay[1].ok, pay[1].payment?.amount, pay[1].application?.status);
const adv = await post(`/api/applications/${newId}/status`, { action: "advance" });
console.log("advance", adv[1].ok, adv[1].application?.status);
const adv2 = await post(`/api/applications/${newId}/status`, { action: "advance" });
const adv3 = await post(`/api/applications/${newId}/status`, { action: "advance" });
const adv4 = await post(`/api/applications/${newId}/status`, { action: "advance" });
console.log("chain", adv2[1].application?.status, adv3[1].application?.status, adv4[1].application?.status, adv4[1].application?.offer?.status);
const acc = await post(`/api/applications/${newId}/status`, { action: "accept-offer" });
console.log("accept", acc[1].application?.offer?.status);
const adm = await post(`/api/applications/${newId}/payment`, { kind: "admission" });
console.log("admission", adm[1].application?.status, adm[1].payment?.amount);

server.kill("SIGTERM");
process.exit(0);
