#!/usr/bin/env node
import { Command } from "commander";
import pc from "picocolors";
import { userCommand } from "./commands/user";
import { orgCommand } from "./commands/org";
import { projectCommand } from "./commands/project";
import { settingsCommand } from "./commands/settings";

const program = new Command();

program
  .name("zitadel")
  .description("CLI for ZITADEL identity platform")
  .version("0.0.1");

const resources = [
  { name: "user", description: "Manage users", setup: userCommand },
  { name: "org", description: "Manage organizations", setup: orgCommand },
  { name: "project", description: "Manage projects", setup: projectCommand },
  { name: "settings", description: "Get settings", setup: settingsCommand },
];

for (const r of resources) {
  r.setup(program.command(r.name).description(r.description));
}

process.on("unhandledRejection", (err) => {
  console.error(pc.red("Unhandled error:"), err);
  process.exit(1);
});

program.parse();
