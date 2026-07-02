#!/usr/bin/env node
import { Command } from "commander";
import pc from "picocolors";
import { userCommand } from "./commands/user";
import { orgCommand } from "./commands/org";
import { projectCommand } from "./commands/project";
import { settingsCommand } from "./commands/settings";
import { appCommand } from "./commands/app";
import { featureCommand } from "./commands/feature";
import { sessionCommand } from "./commands/session";
import { authorizationCommand } from "./commands/authorization";
import { webkeyCommand } from "./commands/webkey";
import { idpCommand } from "./commands/idp";
import { systemCommand } from "./commands/system";
import { instanceCommand } from "./commands/instance";

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
  { name: "app", description: "Manage applications", setup: appCommand },
  { name: "feature", description: "Manage features", setup: featureCommand },
  { name: "session", description: "Manage sessions", setup: sessionCommand },
  { name: "authorization", description: "Manage authorizations", setup: authorizationCommand },
  { name: "webkey", description: "Manage web keys", setup: webkeyCommand },
  { name: "idp", description: "Identity providers", setup: idpCommand },
  { name: "system", description: "System API (self-hosted)", setup: systemCommand },
  { name: "instance", description: "Manage instances", setup: instanceCommand },
];

for (const r of resources) {
  r.setup(program.command(r.name).description(r.description));
}

process.on("unhandledRejection", (err) => {
  console.error(pc.red("Unhandled error:"), err);
  process.exit(1);
});

program.parse();
