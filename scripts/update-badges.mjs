import { writeFile } from "node:fs/promises";

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
  const response = await fetch(`https://api.github.com/repos/${OWNER}/${STARS_REPO}`, {
    headers: {
      "Accept": "application/vnd.github+json",
      "User-Agent": "sheeep-badge-updater"
    }
  });
  if (!response.ok) {
    throw new Error(`GitHub API failed: ${response.status}`);
  }
  const data = await response.json();
  return Number(data.stargazers_count ?? 0);
}

async function fetchVsCodeInstalls() {
  const response = await fetch("https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery", {
    method: "POST",
    headers: {
      "Accept": "application/json;api-version=7.2-preview.1",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      filters: [
        {
          criteria: [
            { filterType: 7, value: `${PUBLISHER}.${EXTENSION}` },
            { filterType: 8, value: "Microsoft.VisualStudio.Code" }
          ],
          pageNumber: 1,
          pageSize: 1,
          sortBy: 0,
          sortOrder: 0
        }
      ],
      assetTypes: [],
      flags: 256
    })
  });

  if (!response.ok) {
    throw new Error(`Marketplace API failed: ${response.status}`);
  }

  const data = await response.json();
  const extension = data?.results?.[0]?.extensions?.[0];
  const stats = extension?.statistics ?? [];
  const installs = stats.find((entry) => entry.statisticName === "install")?.value;
  return Number(installs ?? 0);
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
