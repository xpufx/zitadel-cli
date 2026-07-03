import { Command } from "commander";
import { create } from "@bufbuild/protobuf";
import { ListUsersRequestSchema, GetUserByIDRequestSchema, CreateUserRequestSchema, CreateUserRequest_MachineSchema, DeleteUserRequestSchema, DeactivateUserRequestSchema, ReactivateUserRequestSchema, LockUserRequestSchema, UnlockUserRequestSchema, SetEmailRequestSchema, SetPhoneRequestSchema, RemovePhoneRequestSchema, SetPasswordRequestSchema, PasswordResetRequestSchema, ResendEmailCodeRequestSchema, SendEmailCodeRequestSchema, VerifyEmailRequestSchema, ResendPhoneCodeRequestSchema, VerifyPhoneRequestSchema, ListUserMetadataRequestSchema, SetUserMetadataRequestSchema, DeleteUserMetadataRequestSchema, ListAuthenticationMethodTypesRequestSchema, ListAuthenticationFactorsRequestSchema, ListPasskeysRequestSchema, RemovePasskeyRequestSchema, ListKeysRequestSchema, RemoveKeyRequestSchema, ListPersonalAccessTokensRequestSchema, RemovePersonalAccessTokenRequestSchema, RemoveIDPLinkRequestSchema, ListIDPLinksRequestSchema, AddHumanUserRequestSchema, UpdateUserRequestSchema, UpdateHumanUserRequestSchema, AddPersonalAccessTokenRequestSchema, AddSecretRequestSchema, RemoveSecretRequestSchema, AddIDPLinkRequestSchema, RegisterPasskeyRequestSchema, VerifyPasskeyRegistrationRequestSchema, CreatePasskeyRegistrationLinkRequestSchema, RegisterU2FRequestSchema, VerifyU2FRegistrationRequestSchema, RemoveU2FRequestSchema, RegisterTOTPRequestSchema, VerifyTOTPRegistrationRequestSchema, RemoveTOTPRequestSchema, AddOTPSMSRequestSchema, RemoveOTPSMSRequestSchema, AddOTPEmailRequestSchema, RemoveOTPEmailRequestSchema, HumanMFAInitSkippedRequestSchema, CreateInviteCodeRequestSchema, ResendInviteCodeRequestSchema, VerifyInviteCodeRequestSchema } from "@zitadel/proto/zitadel/user/v2/user_service_pb.js";
import { SetHumanProfileSchema } from "@zitadel/proto/zitadel/user/v2/user_pb.js";
import { SetHumanEmailSchema } from "@zitadel/proto/zitadel/user/v2/email_pb.js";
import { ReturnPasskeyRegistrationCodeSchema, SendPasskeyRegistrationLinkSchema } from "@zitadel/proto/zitadel/user/v2/auth_pb.js";
import { printResult, handleError, DESC } from "../../core";
import { getClients } from "../../state";

export function userCommand(cmd: Command): void {
  cmd.command("create")
    .description(DESC.user_create_machine)
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
    .description(DESC.user_create_human)
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
    .description(DESC.user_update)
    .option("--username <username>")
    .action(async (id, opts) => {
      try {
        const req = create(UpdateUserRequestSchema, { userId: id, username: opts.username });
        printResult(await getClients().user.updateUser(req));
      } catch (e) { handleError(e); }
    });

  cmd.command("update-human <id>")
    .description(DESC.user_update_human)
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
    .description(DESC.user_list)
    .option("--limit <n>", "", "50")
    .action(async (opts) => {
      try {
        const req = create(ListUsersRequestSchema, { query: { limit: Number(opts.limit) } });
        const res = await getClients().user.listUsers(req);
        printResult(res.result ?? []);
      } catch (e) { handleError(e); }
    });

  cmd.command("get <id>")
    .description(DESC.user_get)
    .action(async (id) => {
      try {
        const req = create(GetUserByIDRequestSchema, { userId: id });
        const res = await getClients().user.getUserByID(req);
        printResult(res.user);
      } catch (e) { handleError(e); }
    });

  cmd.command("delete <id>")
    .description(DESC.user_delete)
    .action(async (id) => {
      try {
        const req = create(DeleteUserRequestSchema, { userId: id });
        const res = await getClients().user.deleteUser(req);
        printResult(res);
      } catch (e) { handleError(e); }
    });

  cmd.command("deactivate <id>").description(DESC.user_deactivate).action(async (id) => {
    try {
      const req = create(DeactivateUserRequestSchema, { userId: id });
      printResult(await getClients().user.deactivateUser(req));
    } catch (e) { handleError(e); }
  });

  cmd.command("reactivate <id>").description(DESC.user_reactivate).action(async (id) => {
    try {
      const req = create(ReactivateUserRequestSchema, { userId: id });
      printResult(await getClients().user.reactivateUser(req));
    } catch (e) { handleError(e); }
  });

  cmd.command("lock <id>").description(DESC.user_lock).action(async (id) => {
    try {
      const req = create(LockUserRequestSchema, { userId: id });
      printResult(await getClients().user.lockUser(req));
    } catch (e) { handleError(e); }
  });

  cmd.command("unlock <id>").description(DESC.user_unlock).action(async (id) => {
    try {
      const req = create(UnlockUserRequestSchema, { userId: id });
      printResult(await getClients().user.unlockUser(req));
    } catch (e) { handleError(e); }
  });

  const emailCmd = cmd.command("email").description("Manage user email");
  emailCmd.command("set <id>").description(DESC.user_email_set).requiredOption("--email <email>").action(async (id, opts) => {
    try {
      const req = create(SetEmailRequestSchema, { userId: id, email: opts.email });
      printResult(await getClients().user.setEmail(req));
    } catch (e) { handleError(e); }
  });
  emailCmd.command("verify <id>").description(DESC.user_email_verify).requiredOption("--code <code>").action(async (id, opts) => {
    try {
      const req = create(VerifyEmailRequestSchema, { userId: id, verificationCode: opts.code });
      printResult(await getClients().user.verifyEmail(req));
    } catch (e) { handleError(e); }
  });
  emailCmd.command("resend-code <id>").description(DESC.user_email_resend_code).action(async (id) => {
    try {
      const req = create(ResendEmailCodeRequestSchema, { userId: id });
      printResult(await getClients().user.resendEmailCode(req));
    } catch (e) { handleError(e); }
  });
  emailCmd.command("send-code <id>").description(DESC.user_email_send_code).action(async (id) => {
    try {
      const req = create(SendEmailCodeRequestSchema, { userId: id });
      printResult(await getClients().user.sendEmailCode(req));
    } catch (e) { handleError(e); }
  });

  const phoneCmd = cmd.command("phone").description("Manage user phone");
  phoneCmd.command("set <id>").description(DESC.user_phone_set).requiredOption("--phone <phone>").action(async (id, opts) => {
    try {
      const req = create(SetPhoneRequestSchema, { userId: id, phone: opts.phone });
      printResult(await getClients().user.setPhone(req));
    } catch (e) { handleError(e); }
  });
  phoneCmd.command("remove <id>").description(DESC.user_phone_remove).action(async (id) => {
    try {
      const req = create(RemovePhoneRequestSchema, { userId: id });
      printResult(await getClients().user.removePhone(req));
    } catch (e) { handleError(e); }
  });
  phoneCmd.command("verify <id>").description(DESC.user_phone_verify).requiredOption("--code <code>").action(async (id, opts) => {
    try {
      const req = create(VerifyPhoneRequestSchema, { userId: id, verificationCode: opts.code });
      printResult(await getClients().user.verifyPhone(req));
    } catch (e) { handleError(e); }
  });
  phoneCmd.command("resend-code <id>").description(DESC.user_phone_resend_code).action(async (id) => {
    try {
      const req = create(ResendPhoneCodeRequestSchema, { userId: id });
      printResult(await getClients().user.resendPhoneCode(req));
    } catch (e) { handleError(e); }
  });

  const pwdCmd = cmd.command("password").description("Manage user password");
  pwdCmd.command("set <id>").description(DESC.user_password_set).requiredOption("--password <password>").action(async (id, opts) => {
    try {
      const req = create(SetPasswordRequestSchema, { userId: id, newPassword: { password: opts.password } });
      printResult(await getClients().user.setPassword(req));
    } catch (e) { handleError(e); }
  });
  pwdCmd.command("reset <id>").description(DESC.user_password_reset).action(async (id) => {
    try {
      const req = create(PasswordResetRequestSchema, { userId: id, medium: { case: "sendLink", value: { urlTemplate: "" } } });
      printResult(await getClients().user.passwordReset(req));
    } catch (e) { handleError(e); }
  });

  const metaCmd = cmd.command("metadata").description("Manage user metadata");
  metaCmd.command("list <id>").description(DESC.user_metadata_list).action(async (id) => {
    try {
      const req = create(ListUserMetadataRequestSchema, { userId: id });
      printResult(await getClients().user.listUserMetadata(req));
    } catch (e) { handleError(e); }
  });
  metaCmd.command("set <id>").description(DESC.user_metadata_set).requiredOption("--key <key>").requiredOption("--value <value>").action(async (id, opts) => {
    try {
      const req = create(SetUserMetadataRequestSchema, { userId: id, metadata: [{ key: opts.key, value: opts.value }] });
      printResult(await getClients().user.setUserMetadata(req));
    } catch (e) { handleError(e); }
  });
  metaCmd.command("delete <id>").description(DESC.user_metadata_delete).requiredOption("--key <key>").action(async (id, opts) => {
    try {
      const req = create(DeleteUserMetadataRequestSchema, { userId: id, keys: [opts.key] });
      printResult(await getClients().user.deleteUserMetadata(req));
    } catch (e) { handleError(e); }
  });

  cmd.command("auth-methods <id>").description(DESC.user_auth_methods).action(async (id) => {
    try {
      const req = create(ListAuthenticationMethodTypesRequestSchema, { userId: id });
      printResult(await getClients().user.listAuthenticationMethodTypes(req));
    } catch (e) { handleError(e); }
  });

  cmd.command("auth-factors <id>").description(DESC.user_auth_factors).action(async (id) => {
    try {
      const req = create(ListAuthenticationFactorsRequestSchema, { userId: id });
      printResult(await getClients().user.listAuthenticationFactors(req));
    } catch (e) { handleError(e); }
  });

  cmd.command("passkeys <id>").description(DESC.user_passkeys).action(async (id) => {
    try {
      const req = create(ListPasskeysRequestSchema, { userId: id });
      printResult(await getClients().user.listPasskeys(req));
    } catch (e) { handleError(e); }
  });
  cmd.command("remove-passkey <id> <passkey-id>").description(DESC.user_passkey_remove).action(async (id, passkeyId) => {
    try {
      const req = create(RemovePasskeyRequestSchema, { userId: id, passkeyId });
      printResult(await getClients().user.removePasskey(req));
    } catch (e) { handleError(e); }
  });

  cmd.command("keys <id>").description(DESC.user_keys).action(async (id) => {
    try {
      const req = create(ListKeysRequestSchema, {});
      printResult(await getClients().user.listKeys(req));
    } catch (e) { handleError(e); }
  });
  cmd.command("remove-key <id> <key-id>").description(DESC.user_key_remove).action(async (id, keyId) => {
    try {
      const req = create(RemoveKeyRequestSchema, { userId: id, keyId });
      printResult(await getClients().user.removeKey(req));
    } catch (e) { handleError(e); }
  });

  cmd.command("pats <id>").description(DESC.user_pats).action(async (id) => {
    try {
      const req = create(ListPersonalAccessTokensRequestSchema, {});
      printResult(await getClients().user.listPersonalAccessTokens(req));
    } catch (e) { handleError(e); }
  });
  cmd.command("remove-pat <id> <token-id>").description(DESC.user_pat_remove).action(async (id, tokenId) => {
    try {
      const req = create(RemovePersonalAccessTokenRequestSchema, { userId: id, tokenId });
      printResult(await getClients().user.removePersonalAccessToken(req));
    } catch (e) { handleError(e); }
  });

  cmd.command("idp-links <id>").description(DESC.user_idp_links).action(async (id) => {
    try {
      const req = create(ListIDPLinksRequestSchema, { userId: id });
      printResult(await getClients().user.listIDPLinks(req));
    } catch (e) { handleError(e); }
  });
  cmd.command("remove-idp-link <id> <idp-id>").description(DESC.user_idp_link_remove).action(async (id, idpId) => {
    try {
      const req = create(RemoveIDPLinkRequestSchema, { userId: id, idpId });
      printResult(await getClients().user.removeIDPLink(req));
    } catch (e) { handleError(e); }
  });

  // PAT add
  cmd.command("pat add <id>")
    .description(DESC.user_pat_create)
    .option("--expiration <date>", "Expiration date (RFC 3339)")
    .action(async (id, opts) => {
      try {
        const req: any = { userId: id };
        if (opts.expiration) req.expirationDate = new Date(opts.expiration).toISOString();
        printResult(await getClients().user.addPersonalAccessToken(create(AddPersonalAccessTokenRequestSchema, req)));
      } catch (e) { handleError(e); }
    });

  // Secret add/remove
  const secretCmd = cmd.command("secret").description("Manage user secrets");
  secretCmd.command("add <id>")
    .description(DESC.user_secret_add)
    .action(async (id) => {
      try { printResult(await getClients().user.addSecret(create(AddSecretRequestSchema, { userId: id }))); } catch (e) { handleError(e); }
    });
  secretCmd.command("remove <id>")
    .description(DESC.user_secret_remove)
    .action(async (id) => {
      try { printResult(await getClients().user.removeSecret(create(RemoveSecretRequestSchema, { userId: id }))); } catch (e) { handleError(e); }
    });

  // IDP link add
  cmd.command("idp-link add <id>")
    .description(DESC.user_idp_link_add)
    .requiredOption("--idp-id <idpId>", "IDP identifier")
    .requiredOption("--idp-user-id <userId>", "User ID on the IDP")
    .requiredOption("--idp-username <userName>", "Username on the IDP")
    .action(async (id, opts) => {
      try {
        const req = create(AddIDPLinkRequestSchema, {
          userId: id,
          idpLink: { idpId: opts.idpId, userId: opts.idpUserId, userName: opts.idpUsername },
        });
        printResult(await getClients().user.addIDPLink(req));
      } catch (e) { handleError(e); }
    });

  // Passkey registration
  const passkey = cmd.command("passkey").description("Manage passkeys");
  passkey.command("register <id>")
    .description(DESC.user_passkey_register)
    .requiredOption("--domain <domain>", "Relying party domain")
    .requiredOption("--authenticator <type>", "platform for device or cross-platform for roaming")
    .option("--code-id <id>", "Registration code ID")
    .action(async (id, opts) => {
      try {
        const req: any = {
          userId: id,
          authenticator: opts.authenticator === "cross-platform" ? 2 : 1,
          domain: opts.domain,
        };
        if (opts.codeId) req.code = { id: opts.codeId };
        printResult(await getClients().user.registerPasskey(create(RegisterPasskeyRequestSchema, req)));
      } catch (e) { handleError(e); }
    });
  passkey.command("verify <id>")
    .description(DESC.user_passkey_verify)
    .requiredOption("--passkey-id <passkeyId>", "Passkey ID from register response")
    .requiredOption("--name <name>", "Passkey name")
    .requiredOption("--credential <credential>", "WebAuthn credential JSON")
    .action(async (id, opts) => {
      try {
        printResult(await getClients().user.verifyPasskeyRegistration(create(VerifyPasskeyRegistrationRequestSchema, {
          userId: id,
          passkeyId: opts.passkeyId,
          passkeyName: opts.name,
          publicKeyCredential: JSON.parse(opts.credential),
        })));
      } catch (e) { handleError(e); }
    });
  passkey.command("link <id>")
    .description(DESC.user_passkey_link)
    .option("--url-template <template>", "URL template for email (placeholders: UserID, OrgID, CodeID, Code)")
    .action(async (id, opts) => {
      try {
        const medium = opts.urlTemplate
          ? { case: "sendLink" as const, value: create(SendPasskeyRegistrationLinkSchema, { urlTemplate: opts.urlTemplate }) }
          : { case: "returnCode" as const, value: create(ReturnPasskeyRegistrationCodeSchema, {}) };
        printResult(await getClients().user.createPasskeyRegistrationLink(create(CreatePasskeyRegistrationLinkRequestSchema, {
          userId: id,
          medium,
        })));
      } catch (e) { handleError(e); }
    });

  // U2F
  const u2f = cmd.command("u2f").description("Manage U2F security keys");
  u2f.command("register <id>")
    .description(DESC.user_u2f_register)
    .requiredOption("--domain <domain>", "Relying party domain")
    .action(async (id, opts) => {
      try {
        printResult(await getClients().user.registerU2F(create(RegisterU2FRequestSchema, {
          userId: id,
          domain: opts.domain,
        })));
      } catch (e) { handleError(e); }
    });
  u2f.command("verify <id>")
    .description(DESC.user_u2f_verify)
    .requiredOption("--u2f-id <u2fId>", "U2F ID from register response")
    .requiredOption("--name <name>", "Token name")
    .requiredOption("--credential <credential>", "WebAuthn credential JSON")
    .action(async (id, opts) => {
      try {
        printResult(await getClients().user.verifyU2FRegistration(create(VerifyU2FRegistrationRequestSchema, {
          userId: id,
          u2fId: opts.u2fId,
          tokenName: opts.name,
          publicKeyCredential: JSON.parse(opts.credential),
        })));
      } catch (e) { handleError(e); }
    });
  u2f.command("remove <id> <u2f-id>")
    .description(DESC.user_u2f_remove)
    .action(async (id, u2fId) => {
      try {
        printResult(await getClients().user.removeU2F(create(RemoveU2FRequestSchema, { userId: id, u2fId })));
      } catch (e) { handleError(e); }
    });

  // TOTP
  const totp = cmd.command("totp").description("Manage TOTP authenticators");
  totp.command("register <id>")
    .description(DESC.user_totp_register)
    .action(async (id) => {
      try {
        printResult(await getClients().user.registerTOTP(create(RegisterTOTPRequestSchema, {
          userId: id,
        })));
      } catch (e) { handleError(e); }
    });
  totp.command("verify <id>")
    .description(DESC.user_totp_verify)
    .requiredOption("--code <code>", "TOTP code from authenticator app")
    .action(async (id, opts) => {
      try {
        printResult(await getClients().user.verifyTOTPRegistration(create(VerifyTOTPRegistrationRequestSchema, {
          userId: id,
          code: opts.code,
        })));
      } catch (e) { handleError(e); }
    });
  totp.command("remove <id>")
    .description(DESC.user_totp_remove)
    .action(async (id) => {
      try {
        printResult(await getClients().user.removeTOTP(create(RemoveTOTPRequestSchema, { userId: id })));
      } catch (e) { handleError(e); }
    });

  // OTP SMS
  const otpSms = cmd.command("otp-sms").description("Manage OTP via SMS");
  otpSms.command("add <id>")
    .description(DESC.user_otp_sms_add)
    .action(async (id) => {
      try {
        printResult(await getClients().user.addOTPSMS(create(AddOTPSMSRequestSchema, { userId: id })));
      } catch (e) { handleError(e); }
    });
  otpSms.command("remove <id>")
    .description(DESC.user_otp_sms_remove)
    .action(async (id) => {
      try {
        printResult(await getClients().user.removeOTPSMS(create(RemoveOTPSMSRequestSchema, { userId: id })));
      } catch (e) { handleError(e); }
    });

  // OTP Email
  const otpEmail = cmd.command("otp-email").description("Manage OTP via email");
  otpEmail.command("add <id>")
    .description(DESC.user_otp_email_add)
    .action(async (id) => {
      try {
        printResult(await getClients().user.addOTPEmail(create(AddOTPEmailRequestSchema, { userId: id })));
      } catch (e) { handleError(e); }
    });
  otpEmail.command("remove <id>")
    .description(DESC.user_otp_email_remove)
    .action(async (id) => {
      try {
        printResult(await getClients().user.removeOTPEmail(create(RemoveOTPEmailRequestSchema, { userId: id })));
      } catch (e) { handleError(e); }
    });

  // MFA skip
  cmd.command("mfa-skip <id>")
    .description(DESC.user_mfa_skip)
    .action(async (id) => {
      try {
        printResult(await getClients().user.humanMFAInitSkipped(create(HumanMFAInitSkippedRequestSchema, { userId: id })));
      } catch (e) { handleError(e); }
    });

  // Invite codes
  const invite = cmd.command("invite").description("Manage invite codes");
  invite.command("create <id>")
    .description(DESC.user_invite_create)
    .option("--notify-email <email>", "Send invite to this email address")
    .option("--return-code", "Return the code instead of sending email")
    .action(async (id, opts) => {
      try {
        const req: any = { userId: id };
        if (opts.notifyEmail) {
          req.notifyEmail = { email: opts.notifyEmail };
        } else if (opts.returnCode) {
          req.returnCode = true;
        }
        printResult(await getClients().user.createInviteCode(create(CreateInviteCodeRequestSchema, req)));
      } catch (e) { handleError(e); }
    });
  invite.command("resend <id>")
    .description(DESC.user_invite_resend)
    .option("--notify-email <email>", "Send invite to this email address")
    .option("--return-code", "Return the code instead of sending email")
    .action(async (id, opts) => {
      try {
        const req: any = { userId: id };
        if (opts.notifyEmail) {
          req.notifyEmail = { email: opts.notifyEmail };
        } else if (opts.returnCode) {
          req.returnCode = true;
        }
        printResult(await getClients().user.resendInviteCode(create(ResendInviteCodeRequestSchema, req)));
      } catch (e) { handleError(e); }
    });
  invite.command("verify <id>")
    .description(DESC.user_invite_verify)
    .requiredOption("--code <code>", "Invite code")
    .action(async (id, opts) => {
      try {
        printResult(await getClients().user.verifyInviteCode(create(VerifyInviteCodeRequestSchema, { userId: id, verificationCode: opts.code })));
      } catch (e) { handleError(e); }
    });
}
