import { spawn } from "node:child_process";

const server = spawn("node", ["dist/main.js"], { env: { ...process.env, PORT: "4111" }, stdio: "pipe" });
let ready = false;
server.stdout.on("data", (d) => {
  const s = String(d);
  if (s.includes("College Sathi API")) ready = true;
});
server.stderr.on("data", (d) => {
  const s = String(d);
  if (/Error|Nest can't resolve/.test(s)) console.log("SERVER:", s.slice(0, 400));
});
await new Promise((r) => setTimeout(r, 6000));
if (!ready) console.log("server did not report ready");

const base = "http://127.0.0.1:4111/api";
const get = async (p) => {
  const r = await fetch(base + p);
  return `${r.status} ${p}`;
};
const post = async (p, body) => {
  const r = await fetch(base + p, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  return `${r.status} ${p} ${JSON.stringify(await r.json()).slice(0, 90)}`;
};

console.log(await get("/campus"));
console.log(await get("/structure?kind=subjects"));
console.log(await get("/students"));
console.log(await get("/admissions/applications"));
console.log(await get("/attendance/shortage"));
console.log(await get("/reports/dashboard"));
console.log(await post("/auth/otp", { identifier: "9830012345" }));
console.log(await post("/auth/login", { identifier: "ananya.dasgupta@example.com", password: "demo1234" }));
console.log(await post("/attendance/sessions", { section: "CSE-5A", subject: "Machine Learning", mode: "rotating-qr" }));
console.log(await post("/timetable/generate", { constraints: { maxHours: 4 } }));
console.log(await post("/payments/webhook", { event: "payment.captured" }));
console.log(await post("/certificates/issue", { studentId: "usr_stu_1", type: "Bonafide" }));
console.log(await get("/audit?limit=3"));

server.kill("SIGTERM");
process.exit(0);
