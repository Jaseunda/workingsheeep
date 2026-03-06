import { writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";

const OWNER = "Jaseunda";
const STARS_REPO = "workingsheeep";
const PUBLISHER = "jaseunda";
const EXTENSION = "sheeep";
const STAR_GOAL = 5000;
const INSTALL_GOAL = 10000;

function badgeColor(current, goal) {
  const ratio = goal > 0 ? current / goal : 0;
  if (ratio >= 1) return "brightgreen";
  if (ratio >= 0.75) return "green";
  if (ratio >= 0.4) return "yellow";
  if (ratio >= 0.15) return "orange";
  return "red";
}

async function fetchGithubStars() {
  const raw = execFileSync("curl", [
    "-fsSL",
    "-H",
    "Accept: application/vnd.github+json",
    "-H",
    "User-Agent: sheeep-badge-updater",
    `https://api.github.com/repos/${OWNER}/${STARS_REPO}`
  ], { encoding: "utf8" });
  const data = JSON.parse(raw);
  return Number(data.stargazers_count ?? 0);
}

async function fetchVsCodeInstalls() {
  const html = execFileSync("curl", [
    "-fsSL",
    `https://marketplace.visualstudio.com/items?itemName=${PUBLISHER}.${EXTENSION}`
  ], { encoding: "utf8", maxBuffer: 10 * 1024 * 1024 });

  const match = html.match(/<span class="installs-text"[^>]*>\s*([0-9,]+)\s+install/);
  if (!match) {
    throw new Error("Could not find install count on marketplace page");
  }
  return Number(match[1].replace(/,/g, ""));
}

async function writeBadge(file, label, current, goal) {
  const payload = {
    schemaVersion: 1,
    label,
    message: `${current}/${goal}`,
    color: badgeColor(current, goal)
  };
  await writeFile(new URL(`../badges/${file}`, import.meta.url), `${JSON.stringify(payload, null, 2)}\n`);
}

async function main() {
  const [stars, installs] = await Promise.all([
    fetchGithubStars(),
    fetchVsCodeInstalls()
  ]);

  await writeBadge("github-stars.json", "GitHub stars", stars, STAR_GOAL);
  await writeBadge("vscode-installs.json", "VS Code installs", installs, INSTALL_GOAL);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
