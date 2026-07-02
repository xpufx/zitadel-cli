# API Implementation Checklist

## Legend
- `[ ]` not started
- `[~]` in progress
- `[x]` done
- `v2 ✅` = exported by `@zitadel/client`
- `v2 🔧` = proto exists, wrap ourselves
- `v1 ⚠️` = fallback (no v2 equivalent yet)

---

## UserService (`v2 ✅`)

### Core
- [ ] `CreateUser` — user create --machine
- [ ] `AddHumanUser` — user create --human
- [ ] `GetUserByID` — user get <id>
- [ ] `ListUsers` — user list
- [ ] `UpdateUser` — user update <id>
- [ ] `UpdateHumanUser` — user update <id>
- [ ] `DeleteUser` — user delete <id>
- [ ] `DeactivateUser` — user deactivate <id>
- [ ] `ReactivateUser` — user reactivate <id>
- [ ] `LockUser` — user lock <id>
- [ ] `UnlockUser` — user unlock <id>

### Email
- [ ] `SetEmail` — user email set <id> --email
- [ ] `ResendEmailCode` — user email resend-code <id>
- [ ] `SendEmailCode` — user email send-code <id>
- [ ] `VerifyEmail` — user email verify <id> --code

### Phone
- [ ] `SetPhone` — user phone set <id> --phone
- [ ] `RemovePhone` — user phone remove <id>
- [ ] `ResendPhoneCode` — user phone resend-code <id>
- [ ] `VerifyPhone` — user phone verify <id> --code

### Password
- [ ] `SetPassword` — user password set <id>
- [ ] `PasswordReset` — user password reset <id>

### Auth Factors
- [ ] `RegisterPasskey` — user passkey register <id>
- [ ] `VerifyPasskeyRegistration` — user passkey verify <id>
- [ ] `CreatePasskeyRegistrationLink` — user passkey link <id>
- [ ] `ListPasskeys` — user passkey list <id>
- [ ] `RemovePasskey` — user passkey remove <id> --passkey-id
- [ ] `RegisterU2F` — user u2f register <id>
- [ ] `VerifyU2FRegistration` — user u2f verify <id>
- [ ] `RemoveU2F` — user u2f remove <id> --u2f-id
- [ ] `RegisterTOTP` — user totp register <id>
- [ ] `VerifyTOTPRegistration` — user totp verify <id> --code
- [ ] `RemoveTOTP` — user totp remove <id>
- [ ] `AddOTPSMS` — user otp-sms add <id>
- [ ] `RemoveOTPSMS` — user otp-sms remove <id>
- [ ] `AddOTPEmail` — user otp-email add <id>
- [ ] `RemoveOTPEmail` — user otp-email remove <id>
- [ ] `GenerateRecoveryCodes` — user recovery-codes generate <id>
- [ ] `RemoveRecoveryCodes` — user recovery-codes remove <id>
- [ ] `HumanMFAInitSkipped` — user mfa-skip <id>
- [ ] `ListAuthenticationMethodTypes` — user auth-methods list <id>
- [ ] `ListAuthenticationFactors` — user auth-factors list <id>

### Identity Provider Links
- [ ] `StartIdentityProviderIntent` — (internal/login UI)
- [ ] `RetrieveIdentityProviderIntent` — (internal/login UI)
- [ ] `AddIDPLink` — user idp-link add <id> --idp-id
- [ ] `ListIDPLinks` — user idp-link list <id>
- [ ] `RemoveIDPLink` — user idp-link remove <id> --link-id

### Keys & Secrets
- [ ] `AddSecret` — user secret add <id>
- [ ] `RemoveSecret` — user secret remove <id>
- [ ] `AddKey` — user key add <id>
- [ ] `RemoveKey` — user key remove <id> --key-id
- [ ] `ListKeys` — user key list <id>
- [ ] `AddPersonalAccessToken` — user pat add <id>
- [ ] `RemovePersonalAccessToken` — user pat remove <id> --token-id
- [ ] `ListPersonalAccessTokens` — user pat list <id>

### Metadata
- [ ] `SetUserMetadata` — user metadata set <id> --key --value
- [ ] `ListUserMetadata` — user metadata list <id>
- [ ] `DeleteUserMetadata` — user metadata delete <id> --key

### Invite
- [ ] `CreateInviteCode` — user invite create <id>
- [ ] `ResendInviteCode` — user invite resend <id>
- [ ] `VerifyInviteCode` — user invite verify <id> --code

---

## OrganizationService (`v2 ✅`)

- [ ] `AddOrganization` — org create --name
- [ ] `UpdateOrganization` — org update <id> --name
- [ ] `ListOrganizations` — org list
- [ ] `DeleteOrganization` — org delete <id>
- [ ] `DeactivateOrganization` — org deactivate <id>
- [ ] `ActivateOrganization` — org activate <id>

### Domains
- [ ] `AddOrganizationDomain` — org domain add <id> --domain
- [ ] `ListOrganizationDomains` — org domain list <id>
- [ ] `DeleteOrganizationDomain` — org domain delete <id> --domain
- [ ] `GenerateOrganizationDomainValidation` — org domain generate-validation <id> --domain
- [ ] `VerifyOrganizationDomain` — org domain verify <id> --domain

### Metadata
- [ ] `SetOrganizationMetadata` — org metadata set <id> --key --value
- [ ] `ListOrganizationMetadata` — org metadata list <id>
- [ ] `DeleteOrganizationMetadata` — org metadata delete <id> --key

---

## SessionService (`v2 ✅`)

- [ ] `CreateSession` — session create
- [ ] `GetSession` — session get <id>
- [ ] `ListSessions` — session list
- [ ] `SetSession` — session set <id>
- [ ] `DeleteSession` — session delete <id>

---

## InstanceService (`v2 🔧` — proto exists, not in client)

- [ ] `GetInstance` — instance get <id>
- [ ] `ListInstances` — instance list
- [ ] `UpdateInstance` — instance update <id>
- [ ] `DeleteInstance` — instance delete <id>

### Custom Domains
- [ ] `AddCustomDomain` — instance domain add <id> --domain
- [ ] `RemoveCustomDomain` — instance domain remove <id> --domain
- [ ] `ListCustomDomains` — instance domain list <id>

### Trusted Domains
- [ ] `AddTrustedDomain` — instance trusted-domain add <id> --domain
- [ ] `RemoveTrustedDomain` — instance trusted-domain remove <id> --domain
- [ ] `ListTrustedDomains` — instance trusted-domain list <id>

---

## ProjectService (`v2 🔧`)

- [ ] `CreateProject` — project create --name
- [ ] `GetProject` — project get <id>
- [ ] `ListProjects` — project list
- [ ] `UpdateProject` — project update <id>
- [ ] `DeleteProject` — project delete <id>
- [ ] `ActivateProject` — project activate <id>
- [ ] `DeactivateProject` — project deactivate <id>

### Roles
- [ ] `AddProjectRole` — project role add <id> --key --display-name
- [ ] `UpdateProjectRole` — project role update <id> --key --display-name
- [ ] `RemoveProjectRole` — project role remove <id> --key
- [ ] `ListProjectRoles` — project role list <id>

### Grants
- [ ] `CreateProjectGrant` — project grant create <id> --org-id
- [ ] `UpdateProjectGrant` — project grant update <id> --grant-id
- [ ] `DeleteProjectGrant` — project grant delete <id> --grant-id
- [ ] `ActivateProjectGrant` — project grant activate <id> --grant-id
- [ ] `DeactivateProjectGrant` — project grant deactivate <id> --grant-id
- [ ] `ListProjectGrants` — project grant list <id>

---

## ApplicationService (`v2 🔧`)

- [ ] `CreateApplication` — app create --project-id --name
- [ ] `GetApplication` — app get <id> --project-id
- [ ] `ListApplications` — app list --project-id
- [ ] `UpdateApplication` — app update <id> --project-id
- [ ] `DeleteApplication` — app delete <id> --project-id
- [ ] `DeactivateApplication` — app deactivate <id> --project-id
- [ ] `ReactivateApplication` — app reactivate <id> --project-id
- [ ] `GenerateClientSecret` — app secret generate --project-id --app-id

### Application Keys
- [ ] `CreateApplicationKey` — app key create --project-id --app-id
- [ ] `GetApplicationKey` — app key get --project-id --app-id --key-id
- [ ] `ListApplicationKeys` — app key list --project-id --app-id
- [ ] `DeleteApplicationKey` — app key delete --project-id --app-id --key-id

---

## SettingsService (`v2 ✅` — reads only, writes are v1)

### Reads
- [ ] `GetGeneralSettings` — settings general get
- [ ] `GetLoginSettings` — settings login get [--org-id]
- [ ] `GetActiveIdentityProviders` — settings active-idps get [--org-id]
- [ ] `GetPasswordComplexitySettings` — settings password-complexity get [--org-id]
- [ ] `GetPasswordExpirySettings` — settings password-expiry get [--org-id]
- [ ] `GetBrandingSettings` — settings branding get [--org-id]
- [ ] `GetDomainSettings` — settings domain get [--org-id]
- [ ] `GetLegalAndSupportSettings` — settings legal get [--org-id] (deprecated, use link)
- [ ] `GetLockoutSettings` — settings lockout get [--org-id]
- [ ] `GetSecuritySettings` — settings security get
- [ ] `GetHostedLoginTranslation` — settings hosted-login get --locale
- [ ] `GetLinkSettings` — settings link get
- [ ] `GetEffectiveSettings` — settings effective get

### Organization Settings
- [ ] `SetOrganizationSettings` — settings org set --org-id
- [ ] `DeleteOrganizationSettings` — settings org delete --org-id
- [ ] `ListOrganizationSettings` — settings org list

### Writes (v2)
- [ ] `SetSecuritySettings` — settings security set
- [ ] `SetHostedLoginTranslation` — settings hosted-login set --locale
- [ ] `SetLinkSettings` — settings link set
- [ ] `ResetLinkSettings` — settings link reset

---

## FeatureService (`v2 ✅`)

- [ ] `GetSystemFeatures` — feature system get
- [ ] `SetSystemFeatures` — feature system set --key --value
- [ ] `ResetSystemFeatures` — feature system reset --key
- [ ] `GetInstanceFeatures` — feature instance get <id>
- [ ] `SetInstanceFeatures` — feature instance set <id> --key --value
- [ ] `ResetInstanceFeatures` — feature instance reset <id> --key
- [ ] `GetOrganizationFeatures` — feature org get <id>
- [ ] `SetOrganizationFeatures` — feature org set <id> --key --value
- [ ] `ResetOrganizationFeatures` — feature org reset <id> --key
- [ ] `GetUserFeatures` — feature user get <id>
- [ ] `SetUserFeatures` — feature user set <id> --key --value
- [ ] `ResetUserFeatures` — feature user reset <id> --key

---

## GroupService (`v2 🔧`)

- [ ] `CreateGroup` — group create --name
- [ ] `GetGroup` — group get <id>
- [ ] `ListGroups` — group list
- [ ] `UpdateGroup` — group update <id>
- [ ] `DeleteGroup` — group delete <id>
- [ ] `AddUsersToGroup` — group users add <id> --user-ids
- [ ] `RemoveUsersFromGroup` — group users remove <id> --user-ids
- [ ] `ListGroupUsers` — group users list <id>

---

## IdentityProviderService (`v2 ✅`)

- [ ] `GetIDPByID` — idp get <id>

---

## AuthorizationService (`v2 🔧`)

- [ ] `CreateAuthorization` — authorization create --user-id --project-id --role-keys
- [ ] `ListAuthorizations` — authorization list
- [ ] `GetAuthorization` — authorization get <id> (note: proto has `Update` not `Get`)
- [ ] `UpdateAuthorization` — authorization update <id>
- [ ] `DeleteAuthorization` — authorization delete <id>
- [ ] `ActivateAuthorization` — authorization activate <id>
- [ ] `DeactivateAuthorization` — authorization deactivate <id>

---

## WebKeyService (`v2 🔧`)

- [ ] `CreateWebKey` — webkey create
- [ ] `ListWebKeys` — webkey list
- [ ] `ActivateWebKey` — webkey activate <id>
- [ ] `DeleteWebKey` — webkey delete <id>

---

## OIDCService (`v2 ✅`) — SKIP (custom login UI only)

- [ ] `GetAuthRequest`
- [ ] `CreateCallback`
- [ ] `GetDeviceAuthorizationRequest`
- [ ] `AuthorizeOrDenyDeviceAuthorization`

## SAMLService (`v2 ✅`) — SKIP (custom login UI only)

- [ ] `GetSAMLRequest`
- [ ] `CreateResponse`

---

## V1 Fallbacks (needed because v2 is incomplete)

### AdminService (`v1`) — settings writes
- [ ] UpdateLoginPolicy
- [ ] AddIDPToLoginPolicy / RemoveIDPFromLoginPolicy
- [ ] AddSecondFactorToLoginPolicy / RemoveSecondFactorFromLoginPolicy
- [ ] AddMultiFactorToLoginPolicy / RemoveMultiFactorFromLoginPolicy
- [ ] UpdatePasswordComplexityPolicy
- [ ] UpdatePasswordAgePolicy
- [ ] UpdateLockoutPolicy
- [ ] UpdatePrivacyPolicy
- [ ] UpdateLabelPolicy (branding)
- [ ] RemoveLabelPolicyLogo / LogoDark / Icon / IconDark / Font
- [ ] UpdateDomainPolicy
- [ ] AddCustomDomainPolicy / UpdateCustomDomainPolicy / ResetCustomDomainPolicyToDefault
- [ ] UpdateOrgIAMPolicy
- [ ] AddCustomOrgIAMPolicy / UpdateCustomOrgIAMPolicy / ResetCustomOrgIAMPolicyToDefault
- [ ] AddOIDCSettings / UpdateOIDCSettings
- [ ] UpdateSMTPConfigPassword / UpdateEmailProviderSMTPPassword
- [ ] AddNotificationPolicy / UpdateNotificationPolicy
- [ ] AddInstanceTrustedDomain / RemoveInstanceTrustedDomain
- [ ] SetSecurityPolicy

### ManagementService (`v1`) — org-level settings writes
- [ ] AddCustomLoginPolicy / UpdateCustomLoginPolicy / ResetLoginPolicyToDefault
- [ ] AddIDPToLoginPolicy / RemoveIDPFromLoginPolicy
- [ ] AddSecondFactorToLoginPolicy / RemoveSecondFactorFromLoginPolicy
- [ ] AddMultiFactorToLoginPolicy / RemoveMultiFactorFromLoginPolicy
- [ ] AddCustomPasswordComplexityPolicy / UpdateCustomPasswordComplexityPolicy / ResetPasswordComplexityPolicyToDefault
- [ ] AddCustomPasswordAgePolicy / UpdateCustomPasswordAgePolicy / ResetPasswordAgePolicyToDefault
- [ ] AddCustomLockoutPolicy / UpdateCustomLockoutPolicy / ResetLockoutPolicyToDefault
- [ ] AddCustomPrivacyPolicy / UpdateCustomPrivacyPolicy / ResetPrivacyPolicyToDefault
- [ ] AddCustomDomainPolicy / UpdateCustomDomainPolicy / ResetCustomDomainPolicyToDefault
- [ ] AddCustomOrgIAMPolicy / UpdateCustomOrgIAMPolicy / ResetCustomOrgIAMPolicyToDefault
- [ ] AddNotificationPolicy / UpdateNotificationPolicy / ResetNotificationPolicyToDefault
- [ ] AddCustomLabelPolicy / UpdateCustomLabelPolicy / ResetLabelPolicyToDefault / RemoveLabelPolicy*
- [ ] SetCustomLoginText / ResetCustomLoginTextToDefault
- [ ] SetDefaultPasswordResetMessageText / ResetCustomPasswordResetMessageTextToDefault
- [ ] SetDefaultDomainClaimedMessageText / ResetCustomDomainClaimedMessageTextToDefault
- [ ] SetDefaultPasswordlessRegistrationMessageText / ResetCustomPasswordlessRegistrationMessageTextToDefault
- [ ] SetDefaultPasswordChangeMessageText / ResetCustomPasswordChangeMessageTextToDefault
- [ ] AddOrgDomain / RemoveOrgDomain / SetPrimaryOrgDomain
- [ ] SetHumanInitialPassword / SetHumanPassword
- [ ] AddPasswordlessRegistration / RemoveHumanPasswordless
- [ ] AddHumanUser (user create --human fallback)
- [ ] AddMachineUser (user create --machine fallback)
- [ ] AddProjectRole / RemoveProjectRole
- [ ] AddProjectGrant / RemoveProjectGrant

### SystemService (`v1`) — instance lifecycle
- [ ] Healthz
- [ ] ListInstances (v2 has it now)
- [ ] GetInstance (v2 has it now)
- [ ] CreateInstance — instance create (MISSING in v2!)
- [ ] UpdateInstance (v2 has it now)
- [ ] DeleteInstance (v2 has it now)
- [ ] ListIAMMembers
- [ ] ExistsDomain
- [ ] ListDomains / AddDomain / RemoveDomain / SetPrimaryDomain (v2 has custom domains)
- [ ] ListViews / ClearView
- [ ] ListFailedEvents / RemoveFailedEvent
- [ ] AddQuota / SetQuota / RemoveQuota
- [ ] SetInstanceFeature
- [ ] SetLimits / BulkSetLimits / ResetLimits
