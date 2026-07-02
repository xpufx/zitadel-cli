import { Command } from "commander";
import { create } from "@bufbuild/protobuf";
import { ListUsersRequestSchema, GetUserByIDRequestSchema, CreateUserRequestSchema, CreateUserRequest_MachineSchema, DeleteUserRequestSchema, DeactivateUserRequestSchema, ReactivateUserRequestSchema, LockUserRequestSchema, UnlockUserRequestSchema, SetEmailRequestSchema, SetPhoneRequestSchema, RemovePhoneRequestSchema, SetPasswordRequestSchema, PasswordResetRequestSchema, ResendEmailCodeRequestSchema, SendEmailCodeRequestSchema, VerifyEmailRequestSchema, ResendPhoneCodeRequestSchema, VerifyPhoneRequestSchema, ListUserMetadataRequestSchema, SetUserMetadataRequestSchema, DeleteUserMetadataRequestSchema, ListAuthenticationMethodTypesRequestSchema, ListAuthenticationFactorsRequestSchema, ListPasskeysRequestSchema, RemovePasskeyRequestSchema, ListKeysRequestSchema, RemoveKeyRequestSchema, ListPersonalAccessTokensRequestSchema, RemovePersonalAccessTokenRequestSchema, RemoveIDPLinkRequestSchema, ListIDPLinksRequestSchema, AddHumanUserRequestSchema, UpdateUserRequestSchema, UpdateHumanUserRequestSchema } from "@zitadel/proto/zitadel/user/v2/user_service_pb.js";
import { SetHumanProfileSchema } from "@zitadel/proto/zitadel/user/v2/user_pb.js";
import { SetHumanEmailSchema } from "@zitadel/proto/zitadel/user/v2/email_pb.js";
import { printResult, handleError } from "../../core";
import { getClients } from "../../state";

export function userCommand(cmd: Command): void {
  cmd.command("create")
    .description("Create a machine user")
    .requiredOption("--name <name>")
    .option("--description <desc>")
    .requiredOption("--org-id <id>")
    .action(async (opts) => {
      try {
        const req = create(CreateUserRequestSchema, {
          organizationId: opts.orgId,
          userType: { case: "machine", value: create(CreateUserRequest_MachineSchema, { name: opts.name }) },
        });
        printResult(await getClients().user.createUser(req));
      } catch (e) { handleError(e); }
    });

  cmd.command("create-human")
    .description("Create a human user")
    .requiredOption("--email <email>")
    .option("--username <username>")
    .requiredOption("--first-name <firstName>")
    .requiredOption("--last-name <lastName>")
    .requiredOption("--org-id <id>")
    .action(async (opts) => {
      try {
        const req = create(AddHumanUserRequestSchema, {
          username: opts.username,
          organization: opts.orgId ? { org: { case: "orgId", value: opts.orgId } } : undefined,
          profile: create(SetHumanProfileSchema, { givenName: opts.firstName, familyName: opts.lastName }),
          email: create(SetHumanEmailSchema, { email: opts.email }),
        });
        printResult(await getClients().user.addHumanUser(req));
      } catch (e) { handleError(e); }
    });

  cmd.command("update <id>")
    .description("Update a user (username)")
    .option("--username <username>")
    .action(async (id, opts) => {
      try {
        const req = create(UpdateUserRequestSchema, { userId: id, username: opts.username });
        printResult(await getClients().user.updateUser(req));
      } catch (e) { handleError(e); }
    });

  cmd.command("update-human <id>")
    .description("Update a human user (profile)")
    .option("--username <username>")
    .option("--first-name <firstName>")
    .option("--last-name <lastName>")
    .action(async (id, opts) => {
      try {
        const req = create(UpdateHumanUserRequestSchema, {
          userId: id,
          username: opts.username,
          profile: opts.firstName || opts.lastName ? { givenName: opts.firstName, familyName: opts.lastName } : undefined,
        });
        printResult(await getClients().user.updateHumanUser(req));
      } catch (e) { handleError(e); }
    });

  cmd.command("list")
    .option("--limit <n>", "", "50")
    .action(async (opts) => {
      try {
        const req = create(ListUsersRequestSchema, { query: { limit: Number(opts.limit) } });
        const res = await getClients().user.listUsers(req);
        printResult(res.result ?? []);
      } catch (e) { handleError(e); }
    });

  cmd.command("get <id>")
    .action(async (id) => {
      try {
        const req = create(GetUserByIDRequestSchema, { userId: id });
        const res = await getClients().user.getUserByID(req);
        printResult(res.user);
      } catch (e) { handleError(e); }
    });

  cmd.command("delete <id>")
    .action(async (id) => {
      try {
        const req = create(DeleteUserRequestSchema, { userId: id });
        const res = await getClients().user.deleteUser(req);
        printResult(res);
      } catch (e) { handleError(e); }
    });

  cmd.command("deactivate <id>").action(async (id) => {
    try {
      const req = create(DeactivateUserRequestSchema, { userId: id });
      printResult(await getClients().user.deactivateUser(req));
    } catch (e) { handleError(e); }
  });

  cmd.command("reactivate <id>").action(async (id) => {
    try {
      const req = create(ReactivateUserRequestSchema, { userId: id });
      printResult(await getClients().user.reactivateUser(req));
    } catch (e) { handleError(e); }
  });

  cmd.command("lock <id>").action(async (id) => {
    try {
      const req = create(LockUserRequestSchema, { userId: id });
      printResult(await getClients().user.lockUser(req));
    } catch (e) { handleError(e); }
  });

  cmd.command("unlock <id>").action(async (id) => {
    try {
      const req = create(UnlockUserRequestSchema, { userId: id });
      printResult(await getClients().user.unlockUser(req));
    } catch (e) { handleError(e); }
  });

  const emailCmd = cmd.command("email").description("Manage user email");
  emailCmd.command("set <id>").requiredOption("--email <email>").action(async (id, opts) => {
    try {
      const req = create(SetEmailRequestSchema, { userId: id, email: opts.email });
      printResult(await getClients().user.setEmail(req));
    } catch (e) { handleError(e); }
  });
  emailCmd.command("verify <id>").requiredOption("--code <code>").action(async (id, opts) => {
    try {
      const req = create(VerifyEmailRequestSchema, { userId: id, verificationCode: opts.code });
      printResult(await getClients().user.verifyEmail(req));
    } catch (e) { handleError(e); }
  });
  emailCmd.command("resend-code <id>").action(async (id) => {
    try {
      const req = create(ResendEmailCodeRequestSchema, { userId: id });
      printResult(await getClients().user.resendEmailCode(req));
    } catch (e) { handleError(e); }
  });
  emailCmd.command("send-code <id>").action(async (id) => {
    try {
      const req = create(SendEmailCodeRequestSchema, { userId: id });
      printResult(await getClients().user.sendEmailCode(req));
    } catch (e) { handleError(e); }
  });

  const phoneCmd = cmd.command("phone").description("Manage user phone");
  phoneCmd.command("set <id>").requiredOption("--phone <phone>").action(async (id, opts) => {
    try {
      const req = create(SetPhoneRequestSchema, { userId: id, phone: opts.phone });
      printResult(await getClients().user.setPhone(req));
    } catch (e) { handleError(e); }
  });
  phoneCmd.command("remove <id>").action(async (id) => {
    try {
      const req = create(RemovePhoneRequestSchema, { userId: id });
      printResult(await getClients().user.removePhone(req));
    } catch (e) { handleError(e); }
  });
  phoneCmd.command("verify <id>").requiredOption("--code <code>").action(async (id, opts) => {
    try {
      const req = create(VerifyPhoneRequestSchema, { userId: id, verificationCode: opts.code });
      printResult(await getClients().user.verifyPhone(req));
    } catch (e) { handleError(e); }
  });
  phoneCmd.command("resend-code <id>").action(async (id) => {
    try {
      const req = create(ResendPhoneCodeRequestSchema, { userId: id });
      printResult(await getClients().user.resendPhoneCode(req));
    } catch (e) { handleError(e); }
  });

  const pwdCmd = cmd.command("password").description("Manage user password");
  pwdCmd.command("set <id>").requiredOption("--password <password>").action(async (id, opts) => {
    try {
      const req = create(SetPasswordRequestSchema, { userId: id, newPassword: { password: opts.password } });
      printResult(await getClients().user.setPassword(req));
    } catch (e) { handleError(e); }
  });
  pwdCmd.command("reset <id>").action(async (id) => {
    try {
      const req = create(PasswordResetRequestSchema, { userId: id, medium: { case: "sendLink", value: { urlTemplate: "" } } });
      printResult(await getClients().user.passwordReset(req));
    } catch (e) { handleError(e); }
  });

  const metaCmd = cmd.command("metadata").description("Manage user metadata");
  metaCmd.command("list <id>").action(async (id) => {
    try {
      const req = create(ListUserMetadataRequestSchema, { userId: id });
      printResult(await getClients().user.listUserMetadata(req));
    } catch (e) { handleError(e); }
  });
  metaCmd.command("set <id>").requiredOption("--key <key>").requiredOption("--value <value>").action(async (id, opts) => {
    try {
      const req = create(SetUserMetadataRequestSchema, { userId: id, metadata: [{ key: opts.key, value: opts.value }] });
      printResult(await getClients().user.setUserMetadata(req));
    } catch (e) { handleError(e); }
  });
  metaCmd.command("delete <id>").requiredOption("--key <key>").action(async (id, opts) => {
    try {
      const req = create(DeleteUserMetadataRequestSchema, { userId: id, keys: [opts.key] });
      printResult(await getClients().user.deleteUserMetadata(req));
    } catch (e) { handleError(e); }
  });

  cmd.command("auth-methods <id>").action(async (id) => {
    try {
      const req = create(ListAuthenticationMethodTypesRequestSchema, { userId: id });
      printResult(await getClients().user.listAuthenticationMethodTypes(req));
    } catch (e) { handleError(e); }
  });

  cmd.command("auth-factors <id>").action(async (id) => {
    try {
      const req = create(ListAuthenticationFactorsRequestSchema, { userId: id });
      printResult(await getClients().user.listAuthenticationFactors(req));
    } catch (e) { handleError(e); }
  });

  cmd.command("passkeys <id>").action(async (id) => {
    try {
      const req = create(ListPasskeysRequestSchema, { userId: id });
      printResult(await getClients().user.listPasskeys(req));
    } catch (e) { handleError(e); }
  });
  cmd.command("remove-passkey <id> <passkey-id>").action(async (id, passkeyId) => {
    try {
      const req = create(RemovePasskeyRequestSchema, { userId: id, passkeyId });
      printResult(await getClients().user.removePasskey(req));
    } catch (e) { handleError(e); }
  });

  cmd.command("keys <id>").action(async (id) => {
    try {
      const req = create(ListKeysRequestSchema, {});
      printResult(await getClients().user.listKeys(req));
    } catch (e) { handleError(e); }
  });
  cmd.command("remove-key <id> <key-id>").action(async (id, keyId) => {
    try {
      const req = create(RemoveKeyRequestSchema, { userId: id, keyId });
      printResult(await getClients().user.removeKey(req));
    } catch (e) { handleError(e); }
  });

  cmd.command("pats <id>").action(async (id) => {
    try {
      const req = create(ListPersonalAccessTokensRequestSchema, {});
      printResult(await getClients().user.listPersonalAccessTokens(req));
    } catch (e) { handleError(e); }
  });
  cmd.command("remove-pat <id> <token-id>").action(async (id, tokenId) => {
    try {
      const req = create(RemovePersonalAccessTokenRequestSchema, { userId: id, tokenId });
      printResult(await getClients().user.removePersonalAccessToken(req));
    } catch (e) { handleError(e); }
  });

  cmd.command("idp-links <id>").action(async (id) => {
    try {
      const req = create(ListIDPLinksRequestSchema, { userId: id });
      printResult(await getClients().user.listIDPLinks(req));
    } catch (e) { handleError(e); }
  });
  cmd.command("remove-idp-link <id> <idp-id>").action(async (id, idpId) => {
    try {
      const req = create(RemoveIDPLinkRequestSchema, { userId: id, idpId });
      printResult(await getClients().user.removeIDPLink(req));
    } catch (e) { handleError(e); }
  });
}
