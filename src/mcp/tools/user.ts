import { create } from "@bufbuild/protobuf";
import {
  ListUsersRequestSchema,
  GetUserByIDRequestSchema,
  CreateUserRequestSchema,
  CreateUserRequest_MachineSchema,
  DeleteUserRequestSchema,
  DeactivateUserRequestSchema,
  ReactivateUserRequestSchema,
  LockUserRequestSchema,
  UnlockUserRequestSchema,
  SetEmailRequestSchema,
  SetPhoneRequestSchema,
  RemovePhoneRequestSchema,
  SetPasswordRequestSchema,
  PasswordResetRequestSchema,
  ResendEmailCodeRequestSchema,
  SendEmailCodeRequestSchema,
  VerifyEmailRequestSchema,
  ResendPhoneCodeRequestSchema,
  VerifyPhoneRequestSchema,
  ListUserMetadataRequestSchema,
  SetUserMetadataRequestSchema,
  DeleteUserMetadataRequestSchema,
  ListAuthenticationMethodTypesRequestSchema,
  ListAuthenticationFactorsRequestSchema,
  ListPasskeysRequestSchema,
  RemovePasskeyRequestSchema,
  ListKeysRequestSchema,
  RemoveKeyRequestSchema,
  ListPersonalAccessTokensRequestSchema,
  RemovePersonalAccessTokenRequestSchema,
  RemoveIDPLinkRequestSchema,
  ListIDPLinksRequestSchema,
  AddHumanUserRequestSchema,
  UpdateUserRequestSchema,
  UpdateHumanUserRequestSchema,
  AddPersonalAccessTokenRequestSchema,
  AddSecretRequestSchema,
  RemoveSecretRequestSchema,
  AddIDPLinkRequestSchema,
  RegisterPasskeyRequestSchema,
  VerifyPasskeyRegistrationRequestSchema,
  CreatePasskeyRegistrationLinkRequestSchema,
  RegisterU2FRequestSchema,
  VerifyU2FRegistrationRequestSchema,
  RemoveU2FRequestSchema,
  RegisterTOTPRequestSchema,
  VerifyTOTPRegistrationRequestSchema,
  RemoveTOTPRequestSchema,
  AddOTPSMSRequestSchema,
  RemoveOTPSMSRequestSchema,
  AddOTPEmailRequestSchema,
  RemoveOTPEmailRequestSchema,
  HumanMFAInitSkippedRequestSchema,
  CreateInviteCodeRequestSchema,
  ResendInviteCodeRequestSchema,
  VerifyInviteCodeRequestSchema,
} from "@zitadel/proto/zitadel/user/v2/user_service_pb.js";
import { SetHumanProfileSchema } from "@zitadel/proto/zitadel/user/v2/user_pb.js";
import { SetHumanEmailSchema } from "@zitadel/proto/zitadel/user/v2/email_pb.js";
import { ReturnPasskeyRegistrationCodeSchema, SendPasskeyRegistrationLinkSchema } from "@zitadel/proto/zitadel/user/v2/auth_pb.js";
import type { ServiceClients } from "../../core";
import { DESC } from "../../core";
import type { ToolFactory } from "../tools";

export const getUserTools: ToolFactory = (clients) => [
  {
    name: "user_create_machine",
    description: DESC.user_create_machine,
    inputSchema: {
      type: "object" as const,
      properties: {
        userName: { type: "string", description: "Login name" },
        name: { type: "string", description: "Display name" },
        description: { type: "string", description: "Optional description" },
        organizationId: { type: "string", description: "Organization ID" },
      },
      required: ["userName", "name", "organizationId"],
    },
    handler: async (args) => {
      return await clients.user.createUser(create(CreateUserRequestSchema, {
        organizationId: String(args.organizationId),
        userType: {
          case: "machine",
          value: create(CreateUserRequest_MachineSchema, { name: String(args.name) }),
        },
      }));
    },
  },
  {
    name: "user_create_human",
    description: DESC.user_create_human,
    inputSchema: {
      type: "object" as const,
      properties: {
        username: { type: "string", description: "Login name (optional)" },
        organization: { type: "string", description: "Organization ID" },
        firstName: { type: "string", description: "Given name" },
        lastName: { type: "string", description: "Family name" },
        email: { type: "string", description: "Email address" },
      },
      required: ["firstName", "lastName", "email"],
    },
    handler: async (args) => {
      return await clients.user.addHumanUser(create(AddHumanUserRequestSchema, {
        username: args.username ? String(args.username) : undefined,
        organization: args.organization
          ? { org: { case: "orgId" as const, value: String(args.organization) } }
          : undefined,
        profile: create(SetHumanProfileSchema, {
          givenName: String(args.firstName),
          familyName: String(args.lastName),
        }),
        email: create(SetHumanEmailSchema, { email: String(args.email) }),
      }));
    },
  },
  {
    name: "user_update",
    description: DESC.user_update,
    inputSchema: {
      type: "object" as const,
      properties: {
        userId: { type: "string", description: "User ID" },
        username: { type: "string", description: "New username" },
      },
      required: ["userId"],
    },
    handler: async (args) => {
      return await clients.user.updateUser(create(UpdateUserRequestSchema, {
        userId: String(args.userId),
        username: args.username ? String(args.username) : undefined,
      }));
    },
  },
  {
    name: "user_update_human",
    description: DESC.user_update_human,
    inputSchema: {
      type: "object" as const,
      properties: {
        userId: { type: "string", description: "User ID" },
        username: { type: "string", description: "New username" },
        firstName: { type: "string", description: "New given name" },
        lastName: { type: "string", description: "New family name" },
      },
      required: ["userId"],
    },
    handler: async (args) => {
      return await clients.user.updateHumanUser(create(UpdateHumanUserRequestSchema, {
        userId: String(args.userId),
        username: args.username ? String(args.username) : undefined,
        profile: args.firstName || args.lastName
          ? { givenName: args.firstName ? String(args.firstName) : undefined, familyName: args.lastName ? String(args.lastName) : undefined }
          : undefined,
      }));
    },
  },
  {
    name: "user_list",
    description: DESC.user_list,
    inputSchema: {
      type: "object" as const,
      properties: { limit: { type: "number", description: "Max results (default 50)" } },
    },
    handler: async (args) => {
      const res = await clients.user.listUsers(create(ListUsersRequestSchema, { query: { limit: Number(args.limit ?? 50) } }));
      return res.result ?? [];
    },
  },
  {
    name: "user_get",
    description: DESC.user_get,
    inputSchema: {
      type: "object" as const,
      properties: { userId: { type: "string", description: "User ID" } },
      required: ["userId"],
    },
    handler: async (args) => {
      const res = await clients.user.getUserByID(create(GetUserByIDRequestSchema, { userId: String(args.userId) }));
      return res.user;
    },
  },
  {
    name: "user_delete",
    description: DESC.user_delete,
    inputSchema: {
      type: "object" as const,
      properties: { userId: { type: "string", description: "User ID" } },
      required: ["userId"],
    },
    handler: async (args) => {
      return await clients.user.deleteUser(create(DeleteUserRequestSchema, { userId: String(args.userId) }));
    },
  },
  {
    name: "user_deactivate",
    description: DESC.user_deactivate,
    inputSchema: {
      type: "object" as const,
      properties: { userId: { type: "string", description: "User ID" } },
      required: ["userId"],
    },
    handler: async (args) => {
      return await clients.user.deactivateUser(create(DeactivateUserRequestSchema, { userId: String(args.userId) }));
    },
  },
  {
    name: "user_reactivate",
    description: DESC.user_reactivate,
    inputSchema: {
      type: "object" as const,
      properties: { userId: { type: "string", description: "User ID" } },
      required: ["userId"],
    },
    handler: async (args) => {
      return await clients.user.reactivateUser(create(ReactivateUserRequestSchema, { userId: String(args.userId) }));
    },
  },
  {
    name: "user_lock",
    description: DESC.user_lock,
    inputSchema: {
      type: "object" as const,
      properties: { userId: { type: "string", description: "User ID" } },
      required: ["userId"],
    },
    handler: async (args) => {
      return await clients.user.lockUser(create(LockUserRequestSchema, { userId: String(args.userId) }));
    },
  },
  {
    name: "user_unlock",
    description: DESC.user_unlock,
    inputSchema: {
      type: "object" as const,
      properties: { userId: { type: "string", description: "User ID" } },
      required: ["userId"],
    },
    handler: async (args) => {
      return await clients.user.unlockUser(create(UnlockUserRequestSchema, { userId: String(args.userId) }));
    },
  },
  {
    name: "user_email_set",
    description: DESC.user_email_set,
    inputSchema: {
      type: "object" as const,
      properties: {
        userId: { type: "string", description: "User ID" },
        email: { type: "string", description: "New email address" },
      },
      required: ["userId", "email"],
    },
    handler: async (args) => {
      return await clients.user.setEmail(create(SetEmailRequestSchema, { userId: String(args.userId), email: String(args.email) }));
    },
  },
  {
    name: "user_email_verify",
    description: DESC.user_email_verify,
    inputSchema: {
      type: "object" as const,
      properties: {
        userId: { type: "string", description: "User ID" },
        code: { type: "string", description: "Verification code" },
      },
      required: ["userId", "code"],
    },
    handler: async (args) => {
      return await clients.user.verifyEmail(create(VerifyEmailRequestSchema, { userId: String(args.userId), verificationCode: String(args.code) }));
    },
  },
  {
    name: "user_email_resend_code",
    description: DESC.user_email_resend_code,
    inputSchema: {
      type: "object" as const,
      properties: { userId: { type: "string", description: "User ID" } },
      required: ["userId"],
    },
    handler: async (args) => {
      return await clients.user.resendEmailCode(create(ResendEmailCodeRequestSchema, { userId: String(args.userId) }));
    },
  },
  {
    name: "user_email_send_code",
    description: DESC.user_email_send_code,
    inputSchema: {
      type: "object" as const,
      properties: { userId: { type: "string", description: "User ID" } },
      required: ["userId"],
    },
    handler: async (args) => {
      return await clients.user.sendEmailCode(create(SendEmailCodeRequestSchema, { userId: String(args.userId) }));
    },
  },
  {
    name: "user_phone_set",
    description: DESC.user_phone_set,
    inputSchema: {
      type: "object" as const,
      properties: {
        userId: { type: "string", description: "User ID" },
        phone: { type: "string", description: "Phone number (E.164)" },
      },
      required: ["userId", "phone"],
    },
    handler: async (args) => {
      return await clients.user.setPhone(create(SetPhoneRequestSchema, { userId: String(args.userId), phone: String(args.phone) }));
    },
  },
  {
    name: "user_phone_remove",
    description: DESC.user_phone_remove,
    inputSchema: {
      type: "object" as const,
      properties: { userId: { type: "string", description: "User ID" } },
      required: ["userId"],
    },
    handler: async (args) => {
      return await clients.user.removePhone(create(RemovePhoneRequestSchema, { userId: String(args.userId) }));
    },
  },
  {
    name: "user_phone_verify",
    description: DESC.user_phone_verify,
    inputSchema: {
      type: "object" as const,
      properties: {
        userId: { type: "string", description: "User ID" },
        code: { type: "string", description: "Verification code" },
      },
      required: ["userId", "code"],
    },
    handler: async (args) => {
      return await clients.user.verifyPhone(create(VerifyPhoneRequestSchema, { userId: String(args.userId), verificationCode: String(args.code) }));
    },
  },
  {
    name: "user_phone_resend_code",
    description: DESC.user_phone_resend_code,
    inputSchema: {
      type: "object" as const,
      properties: { userId: { type: "string", description: "User ID" } },
      required: ["userId"],
    },
    handler: async (args) => {
      return await clients.user.resendPhoneCode(create(ResendPhoneCodeRequestSchema, { userId: String(args.userId) }));
    },
  },
  {
    name: "user_password_set",
    description: DESC.user_password_set,
    inputSchema: {
      type: "object" as const,
      properties: {
        userId: { type: "string", description: "User ID" },
        password: { type: "string", description: "New password" },
      },
      required: ["userId", "password"],
    },
    handler: async (args) => {
      return await clients.user.setPassword(create(SetPasswordRequestSchema, {
        userId: String(args.userId),
        newPassword: { password: String(args.password) },
      }));
    },
  },
  {
    name: "user_password_reset",
    description: DESC.user_password_reset,
    inputSchema: {
      type: "object" as const,
      properties: { userId: { type: "string", description: "User ID" } },
      required: ["userId"],
    },
    handler: async (args) => {
      return await clients.user.passwordReset(create(PasswordResetRequestSchema, {
        userId: String(args.userId),
        medium: { case: "sendLink", value: { urlTemplate: "" } },
      }));
    },
  },
  {
    name: "user_metadata_list",
    description: DESC.user_metadata_list,
    inputSchema: {
      type: "object" as const,
      properties: { userId: { type: "string", description: "User ID" } },
      required: ["userId"],
    },
    handler: async (args) => {
      return await clients.user.listUserMetadata(create(ListUserMetadataRequestSchema, { userId: String(args.userId) }));
    },
  },
  {
    name: "user_metadata_set",
    description: DESC.user_metadata_set,
    inputSchema: {
      type: "object" as const,
      properties: {
        userId: { type: "string", description: "User ID" },
        key: { type: "string", description: "Metadata key" },
        value: { type: "string", description: "Metadata value" },
      },
      required: ["userId", "key", "value"],
    },
    handler: async (args) => {
      return await clients.user.setUserMetadata(create(SetUserMetadataRequestSchema, {
        userId: String(args.userId),
        metadata: [{ key: String(args.key), value: new TextEncoder().encode(String(args.value)) }],
      }));
    },
  },
  {
    name: "user_metadata_delete",
    description: DESC.user_metadata_delete,
    inputSchema: {
      type: "object" as const,
      properties: {
        userId: { type: "string", description: "User ID" },
        key: { type: "string", description: "Metadata key to delete" },
      },
      required: ["userId", "key"],
    },
    handler: async (args) => {
      return await clients.user.deleteUserMetadata(create(DeleteUserMetadataRequestSchema, { userId: String(args.userId), keys: [String(args.key)] }));
    },
  },
  {
    name: "user_auth_methods",
    description: DESC.user_auth_methods,
    inputSchema: {
      type: "object" as const,
      properties: { userId: { type: "string", description: "User ID" } },
      required: ["userId"],
    },
    handler: async (args) => {
      return await clients.user.listAuthenticationMethodTypes(create(ListAuthenticationMethodTypesRequestSchema, { userId: String(args.userId) }));
    },
  },
  {
    name: "user_auth_factors",
    description: DESC.user_auth_factors,
    inputSchema: {
      type: "object" as const,
      properties: { userId: { type: "string", description: "User ID" } },
      required: ["userId"],
    },
    handler: async (args) => {
      return await clients.user.listAuthenticationFactors(create(ListAuthenticationFactorsRequestSchema, { userId: String(args.userId) }));
    },
  },
  {
    name: "user_passkeys",
    description: DESC.user_passkeys,
    inputSchema: {
      type: "object" as const,
      properties: { userId: { type: "string", description: "User ID" } },
      required: ["userId"],
    },
    handler: async (args) => {
      return await clients.user.listPasskeys(create(ListPasskeysRequestSchema, { userId: String(args.userId) }));
    },
  },
  {
    name: "user_passkey_remove",
    description: DESC.user_passkey_remove,
    inputSchema: {
      type: "object" as const,
      properties: {
        userId: { type: "string", description: "User ID" },
        passkeyId: { type: "string", description: "Passkey ID" },
      },
      required: ["userId", "passkeyId"],
    },
    handler: async (args) => {
      return await clients.user.removePasskey(create(RemovePasskeyRequestSchema, { userId: String(args.userId), passkeyId: String(args.passkeyId) }));
    },
  },
  {
    name: "user_keys",
    description: DESC.user_keys,
    inputSchema: {
      type: "object" as const,
      properties: { userId: { type: "string", description: "User ID" } },
      required: ["userId"],
    },
    handler: async (args) => {
      return await clients.user.listKeys(create(ListKeysRequestSchema, {}));
    },
  },
  {
    name: "user_key_remove",
    description: DESC.user_key_remove,
    inputSchema: {
      type: "object" as const,
      properties: {
        userId: { type: "string", description: "User ID" },
        keyId: { type: "string", description: "Key ID" },
      },
      required: ["userId", "keyId"],
    },
    handler: async (args) => {
      return await clients.user.removeKey(create(RemoveKeyRequestSchema, { userId: String(args.userId), keyId: String(args.keyId) }));
    },
  },
  {
    name: "user_pats",
    description: DESC.user_pats,
    inputSchema: {
      type: "object" as const,
      properties: { userId: { type: "string", description: "User ID" } },
      required: ["userId"],
    },
    handler: async (args) => {
      return await clients.user.listPersonalAccessTokens(create(ListPersonalAccessTokensRequestSchema, {}));
    },
  },
  {
    name: "user_pat_remove",
    description: DESC.user_pat_remove,
    inputSchema: {
      type: "object" as const,
      properties: {
        userId: { type: "string", description: "User ID" },
        tokenId: { type: "string", description: "Token ID" },
      },
      required: ["userId", "tokenId"],
    },
    handler: async (args) => {
      return await clients.user.removePersonalAccessToken(create(RemovePersonalAccessTokenRequestSchema, { userId: String(args.userId), tokenId: String(args.tokenId) }));
    },
  },
  {
    name: "user_idp_links",
    description: DESC.user_idp_links,
    inputSchema: {
      type: "object" as const,
      properties: { userId: { type: "string", description: "User ID" } },
      required: ["userId"],
    },
    handler: async (args) => {
      return await clients.user.listIDPLinks(create(ListIDPLinksRequestSchema, { userId: String(args.userId) }));
    },
  },
  {
    name: "user_idp_link_remove",
    description: DESC.user_idp_link_remove,
    inputSchema: {
      type: "object" as const,
      properties: {
        userId: { type: "string", description: "User ID" },
        idpId: { type: "string", description: "IDP ID" },
      },
      required: ["userId", "idpId"],
    },
    handler: async (args) => {
      return await clients.user.removeIDPLink(create(RemoveIDPLinkRequestSchema, { userId: String(args.userId), idpId: String(args.idpId) }));
    },
  },
  {
    name: "user_pat_create",
    description: DESC.user_pat_create,
    inputSchema: {
      type: "object" as const,
      properties: {
        userId: { type: "string", description: "User ID" },
        expiration: { type: "string", description: "Optional expiration date (RFC 3339)" },
      },
      required: ["userId"],
    },
    handler: async (args) => {
      const req: Record<string, unknown> = { userId: String(args.userId) };
      if (args.expiration) req.expirationDate = new Date(String(args.expiration)).toISOString();
      return await clients.user.addPersonalAccessToken(create(AddPersonalAccessTokenRequestSchema, req));
    },
  },
  {
    name: "user_secret_add",
    description: DESC.user_secret_add,
    inputSchema: {
      type: "object" as const,
      properties: { userId: { type: "string", description: "User ID" } },
      required: ["userId"],
    },
    handler: async (args) => {
      return await clients.user.addSecret(create(AddSecretRequestSchema, { userId: String(args.userId) }));
    },
  },
  {
    name: "user_secret_remove",
    description: DESC.user_secret_remove,
    inputSchema: {
      type: "object" as const,
      properties: { userId: { type: "string", description: "User ID" } },
      required: ["userId"],
    },
    handler: async (args) => {
      return await clients.user.removeSecret(create(RemoveSecretRequestSchema, { userId: String(args.userId) }));
    },
  },
  {
    name: "user_idp_link_add",
    description: DESC.user_idp_link_add,
    inputSchema: {
      type: "object" as const,
      properties: {
        userId: { type: "string", description: "User ID" },
        idpId: { type: "string", description: "IDP identifier" },
        idpUserId: { type: "string", description: "User ID on the IDP" },
        idpUsername: { type: "string", description: "Username on the IDP" },
      },
      required: ["userId", "idpId", "idpUserId", "idpUsername"],
    },
    handler: async (args) => {
      return await clients.user.addIDPLink(create(AddIDPLinkRequestSchema, {
        userId: String(args.userId),
        idpLink: { idpId: String(args.idpId), userId: String(args.idpUserId), userName: String(args.idpUsername) },
      }));
    },
  },
  {
    name: "user_passkey_register",
    description: DESC.user_passkey_register,
    inputSchema: {
      type: "object" as const,
      properties: {
        userId: { type: "string", description: "User ID" },
        domain: { type: "string", description: "Relying party domain" },
        authenticator: {
          type: "string",
          enum: ["platform", "cross-platform"],
          description: "Authenticator type (default: platform)",
        },
        codeId: { type: "string", description: "Optional registration code ID" },
      },
      required: ["userId", "domain"],
    },
    handler: async (args) => {
      const req: Record<string, unknown> = {
        userId: String(args.userId),
        authenticator: String(args.authenticator ?? "platform") === "cross-platform" ? 2 : 1,
        domain: String(args.domain),
      };
      if (args.codeId) req.code = { id: String(args.codeId) };
      return await clients.user.registerPasskey(create(RegisterPasskeyRequestSchema, req));
    },
  },
  {
    name: "user_passkey_verify",
    description: DESC.user_passkey_verify,
    inputSchema: {
      type: "object" as const,
      properties: {
        userId: { type: "string", description: "User ID" },
        passkeyId: { type: "string", description: "Passkey ID from register response" },
        name: { type: "string", description: "Passkey name" },
        credential: {
          type: "object",
          description: "WebAuthn credential JSON from the browser",
        },
      },
      required: ["userId", "passkeyId", "name", "credential"],
    },
    handler: async (args) => {
      return await clients.user.verifyPasskeyRegistration(create(VerifyPasskeyRegistrationRequestSchema, {
        userId: String(args.userId),
        passkeyId: String(args.passkeyId),
        passkeyName: String(args.name),
        publicKeyCredential: args.credential as any,
      }));
    },
  },
  {
    name: "user_passkey_link",
    description: DESC.user_passkey_link,
    inputSchema: {
      type: "object" as const,
      properties: {
        userId: { type: "string", description: "User ID" },
        urlTemplate: {
          type: "string",
          description: "URL template for email (placeholders: UserID, OrgID, CodeID, Code). Omit to return the code.",
        },
      },
      required: ["userId"],
    },
    handler: async (args) => {
      const medium = args.urlTemplate
        ? { case: "sendLink" as const, value: create(SendPasskeyRegistrationLinkSchema, { urlTemplate: String(args.urlTemplate) }) }
        : { case: "returnCode" as const, value: create(ReturnPasskeyRegistrationCodeSchema, {}) };
      return await clients.user.createPasskeyRegistrationLink(create(CreatePasskeyRegistrationLinkRequestSchema, {
        userId: String(args.userId),
        medium,
      }));
    },
  },
  {
    name: "user_u2f_register",
    description: DESC.user_u2f_register,
    inputSchema: {
      type: "object" as const,
      properties: {
        userId: { type: "string", description: "User ID" },
        domain: { type: "string", description: "Relying party domain" },
      },
      required: ["userId", "domain"],
    },
    handler: async (args) => {
      return await clients.user.registerU2F(create(RegisterU2FRequestSchema, {
        userId: String(args.userId),
        domain: String(args.domain),
      }));
    },
  },
  {
    name: "user_u2f_verify",
    description: DESC.user_u2f_verify,
    inputSchema: {
      type: "object" as const,
      properties: {
        userId: { type: "string", description: "User ID" },
        u2fId: { type: "string", description: "U2F ID from register response" },
        name: { type: "string", description: "Token name" },
        credential: {
          type: "object",
          description: "WebAuthn credential JSON from the browser",
        },
      },
      required: ["userId", "u2fId", "name", "credential"],
    },
    handler: async (args) => {
      return await clients.user.verifyU2FRegistration(create(VerifyU2FRegistrationRequestSchema, {
        userId: String(args.userId),
        u2fId: String(args.u2fId),
        tokenName: String(args.name),
        publicKeyCredential: args.credential as any,
      }));
    },
  },
  {
    name: "user_u2f_remove",
    description: DESC.user_u2f_remove,
    inputSchema: {
      type: "object" as const,
      properties: {
        userId: { type: "string", description: "User ID" },
        u2fId: { type: "string", description: "U2F ID to remove" },
      },
      required: ["userId", "u2fId"],
    },
    handler: async (args) => {
      return await clients.user.removeU2F(create(RemoveU2FRequestSchema, { userId: String(args.userId), u2fId: String(args.u2fId) }));
    },
  },
  {
    name: "user_totp_register",
    description: DESC.user_totp_register,
    inputSchema: {
      type: "object" as const,
      properties: { userId: { type: "string", description: "User ID" } },
      required: ["userId"],
    },
    handler: async (args) => {
      return await clients.user.registerTOTP(create(RegisterTOTPRequestSchema, { userId: String(args.userId) }));
    },
  },
  {
    name: "user_totp_verify",
    description: DESC.user_totp_verify,
    inputSchema: {
      type: "object" as const,
      properties: {
        userId: { type: "string", description: "User ID" },
        code: { type: "string", description: "TOTP code from authenticator app" },
      },
      required: ["userId", "code"],
    },
    handler: async (args) => {
      return await clients.user.verifyTOTPRegistration(create(VerifyTOTPRegistrationRequestSchema, {
        userId: String(args.userId),
        code: String(args.code),
      }));
    },
  },
  {
    name: "user_totp_remove",
    description: DESC.user_totp_remove,
    inputSchema: {
      type: "object" as const,
      properties: { userId: { type: "string", description: "User ID" } },
      required: ["userId"],
    },
    handler: async (args) => {
      return await clients.user.removeTOTP(create(RemoveTOTPRequestSchema, { userId: String(args.userId) }));
    },
  },
  {
    name: "user_otp_sms_add",
    description: DESC.user_otp_sms_add,
    inputSchema: {
      type: "object" as const,
      properties: { userId: { type: "string", description: "User ID" } },
      required: ["userId"],
    },
    handler: async (args) => {
      return await clients.user.addOTPSMS(create(AddOTPSMSRequestSchema, { userId: String(args.userId) }));
    },
  },
  {
    name: "user_otp_sms_remove",
    description: DESC.user_otp_sms_remove,
    inputSchema: {
      type: "object" as const,
      properties: { userId: { type: "string", description: "User ID" } },
      required: ["userId"],
    },
    handler: async (args) => {
      return await clients.user.removeOTPSMS(create(RemoveOTPSMSRequestSchema, { userId: String(args.userId) }));
    },
  },
  {
    name: "user_otp_email_add",
    description: DESC.user_otp_email_add,
    inputSchema: {
      type: "object" as const,
      properties: { userId: { type: "string", description: "User ID" } },
      required: ["userId"],
    },
    handler: async (args) => {
      return await clients.user.addOTPEmail(create(AddOTPEmailRequestSchema, { userId: String(args.userId) }));
    },
  },
  {
    name: "user_otp_email_remove",
    description: DESC.user_otp_email_remove,
    inputSchema: {
      type: "object" as const,
      properties: { userId: { type: "string", description: "User ID" } },
      required: ["userId"],
    },
    handler: async (args) => {
      return await clients.user.removeOTPEmail(create(RemoveOTPEmailRequestSchema, { userId: String(args.userId) }));
    },
  },
  {
    name: "user_mfa_skip",
    description: DESC.user_mfa_skip,
    inputSchema: {
      type: "object" as const,
      properties: { userId: { type: "string", description: "User ID" } },
      required: ["userId"],
    },
    handler: async (args) => {
      return await clients.user.humanMFAInitSkipped(create(HumanMFAInitSkippedRequestSchema, { userId: String(args.userId) }));
    },
  },
  {
    name: "user_invite_create",
    description: DESC.user_invite_create,
    inputSchema: {
      type: "object" as const,
      properties: {
        userId: { type: "string", description: "User ID" },
        notifyEmail: { type: "string", description: "Send invite to this email address" },
        returnCode: { type: "boolean", description: "Return the code instead of sending email" },
      },
      required: ["userId"],
    },
    handler: async (args) => {
      const req: Record<string, unknown> = { userId: String(args.userId) };
      if (args.notifyEmail) {
        req.notifyEmail = { email: String(args.notifyEmail) };
      } else if (args.returnCode) {
        req.returnCode = true;
      }
      return await clients.user.createInviteCode(create(CreateInviteCodeRequestSchema, req));
    },
  },
  {
    name: "user_invite_resend",
    description: DESC.user_invite_resend,
    inputSchema: {
      type: "object" as const,
      properties: {
        userId: { type: "string", description: "User ID" },
        notifyEmail: { type: "string", description: "Send invite to this email address" },
        returnCode: { type: "boolean", description: "Return the code instead of sending email" },
      },
      required: ["userId"],
    },
    handler: async (args) => {
      const req: Record<string, unknown> = { userId: String(args.userId) };
      if (args.notifyEmail) {
        req.notifyEmail = { email: String(args.notifyEmail) };
      } else if (args.returnCode) {
        req.returnCode = true;
      }
      return await clients.user.resendInviteCode(create(ResendInviteCodeRequestSchema, req));
    },
  },
  {
    name: "user_invite_verify",
    description: DESC.user_invite_verify,
    inputSchema: {
      type: "object" as const,
      properties: {
        userId: { type: "string", description: "User ID" },
        code: { type: "string", description: "Invite code" },
      },
      required: ["userId", "code"],
    },
    handler: async (args) => {
      return await clients.user.verifyInviteCode(create(VerifyInviteCodeRequestSchema, {
        userId: String(args.userId),
        verificationCode: String(args.code),
      }));
    },
  },
];
