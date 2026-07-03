import { readFileSync } from "node:fs";
import { env } from "node:process";

const token = env.CI_TOKEN;
const tag = env.TAG || env.GITHUB_SHA;
const repo = env.GITHUB_REPOSITORY;
const api = `https://forge.mrs.aager.de/api/v1/repos/${repo}/releases`;
const headers = { Authorization: `token ${token}`, "Content-Type": "application/json" };

// Delete existing tag release if present
await fetch(`${api}/tags/${tag}`, { method: "DELETE", headers }).catch(() => {});

// Create release
const res = await fetch(api, {
  method: "POST",
  headers,
  body: JSON.stringify({ tag_name: tag, name: tag, body: `Release ${tag}` }),
});
const release = await res.json();
const releaseId = release.id;

// Upload binaries
for (const name of ["zitadel", "zitadel-mcp"]) {
  const body = readFileSync(`dist/${name}`);
  await fetch(`${api}/${releaseId}/assets`, {
    method: "POST",
    headers: { Authorization: `token ${token}`, "Content-Type": "application/octet-stream" },
    body,
  });
}
console.log(`Release ${tag} created with binaries`);
