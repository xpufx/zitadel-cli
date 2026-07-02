# API Implementation Status

## Legend
- [x] implemented and wired in CLI
- [ ] not implemented

---

## UserService — 36/63 ✅

[x] CreateUser               user create --name --org-id
[x] AddHumanUser              user create-human --email --first-name --last-name --org-id
[x] GetUserByID               user get <id>
[x] ListUsers                 user list [--limit]
[x] UpdateUser                user update <id> [--username]
[x] UpdateHumanUser           user update-human <id> [--username] [--first-name] [--last-name]
[x] DeleteUser                user delete <id>
[x] DeactivateUser            user deactivate <id>
[x] ReactivateUser            user reactivate <id>
[x] LockUser                  user lock <id>
[x] UnlockUser                user unlock <id>
[x] SetEmail                  user email set <id> --email
[x] VerifyEmail               user email verify <id> --code
[x] ResendEmailCode           user email resend-code <id>
[x] SendEmailCode             user email send-code <id>
[x] SetPhone                  user phone set <id> --phone
[x] RemovePhone               user phone remove <id>
[x] VerifyPhone               user phone verify <id> --code
[x] ResendPhoneCode           user phone resend-code <id>
[x] SetPassword               user password set <id> --password
[x] PasswordReset             user password reset <id>
[x] ListPasskeys              user passkeys <id>
[x] RemovePasskey             user remove-passkey <id> <passkey-id>
[x] ListKeys                  user keys <id>
[x] RemoveKey                 user remove-key <id> <key-id>
[x] ListPersonalAccessTokens  user pats <id>
[x] RemovePersonalAccessToken user remove-pat <id> <token-id>
[x] ListIDPLinks              user idp-links <id>
[x] RemoveIDPLink             user remove-idp-link <id> <idp-id>
[x] SetUserMetadata           user metadata set <id> --key --value
[x] ListUserMetadata          user metadata list <id>
[x] DeleteUserMetadata        user metadata delete <id> --key
[x] ListAuthenticationMethodTypes  user auth-methods <id>
[x] ListAuthenticationFactors      user auth-factors <id>

[ ] RegisterPasskey           user passkey register <id>
[ ] VerifyPasskeyRegistration user passkey verify <id>
[ ] CreatePasskeyRegistrationLink  user passkey link <id>
[ ] RegisterU2F               user u2f register <id>
[ ] VerifyU2FRegistration     user u2f verify <id>
[ ] RemoveU2F                 user u2f remove <id> --u2f-id
[ ] RegisterTOTP              user totp register <id>
[ ] VerifyTOTPRegistration    user totp verify <id> --code
[ ] RemoveTOTP                user totp remove <id>
[ ] AddOTPSMS                 user otp-sms add <id>
[ ] RemoveOTPSMS              user otp-sms remove <id>
[ ] AddOTPEmail               user otp-email add <id>
[ ] RemoveOTPEmail            user otp-email remove <id>
[ ] GenerateRecoveryCodes     user recovery-codes generate <id>
[ ] RemoveRecoveryCodes       user recovery-codes remove <id>
[ ] HumanMFAInitSkipped       user mfa-skip <id>
[ ] AddSecret                 user secret add <id>
[ ] RemoveSecret              user secret remove <id>
[ ] AddKey                    user key add <id>
[ ] AddPersonalAccessToken    user pat add <id> [--expiration]
[ ] AddIDPLink                user idp-link add <id> --idp-id
[ ] CreateInviteCode          user invite create <id>
[ ] ResendInviteCode          user invite resend <id>
[ ] VerifyInviteCode          user invite verify <id> --code
[ ] StartIdentityProviderIntent    (internal/login UI)
[ ] RetrieveIdentityProviderIntent (internal/login UI)

---

## OrganizationService (v2) — 2/14 available in npm package

[x] CreateOrganization        org create --name
[x] ListOrganizations         org list
[x] UpdateOrganization        org update <id> --name
[x] DeleteOrganization        org delete <id> [--confirm]
[x] ActivateOrganization      org activate <id>
[x] DeactivateOrganization    org deactivate <id>

### Domains
[x] AddOrganizationDomain            org domain add <id> --domain
[x] ListOrganizationDomains          org domain list <id>
[x] DeleteOrganizationDomain         org domain delete <id> --domain
[x] GenerateOrganizationDomainValidation  org domain generate-validation <id> --domain --type
[x] VerifyOrganizationDomain         org domain verify <id> --domain

### Metadata
[x] SetOrganizationMetadata          org metadata set <id> --key --value
[x] ListOrganizationMetadata        org metadata list <id>
[x] DeleteOrganizationMetadata      org metadata delete <id> --key

---

## ProjectService (v2beta) — 6/19 ✅

[x] GetProject                project get <id>
[x] ListProjects              project list
[x] CreateProject             project create --org-id --name
[x] UpdateProject             project update <id> [--name]
[x] DeleteProject             project delete <id> [--confirm]
[x] DeactivateProject         project deactivate <id>
[x] ActivateProject           project activate <id>
[x] AddProjectRole            project role add <id> --key --display-name
[x] UpdateProjectRole         project role update <id> <key> [--display-name]
[x] RemoveProjectRole         project role remove <id> <key>
[x] ListProjectRoles          project role list <id>
[x] CreateProjectGrant        project grant create <id> --org-id --role-keys
[x] UpdateProjectGrant        project grant update <id> <grant-org-id> --role-keys
[x] DeleteProjectGrant        project grant delete <id> <grant-org-id> [--confirm]
[x] ActivateProjectGrant      project grant activate <id> <grant-org-id>
[x] DeactivateProjectGrant    project grant deactivate <id> <grant-org-id>
[x] ListProjectGrants         project grant list

---

## ApplicationService (v2beta) — 3/12 ✅

[x] GetApplication            app get <id>
[x] ListApplications          app list --project-id
[x] CreateApplication         app create --project-id --name [--type]
[x] UpdateApplication         app update <id> --project-id [--name]
[x] DeleteApplication         app delete <id> --project-id [--confirm]
[x] DeactivateApplication     app deactivate <id> --project-id
[x] ReactivateApplication     app reactivate <id> --project-id
[x] RegenerateClientSecret    app secret generate <id> --project-id
[x] CreateApplicationKey      app key create <id> --project-id
[x] GetApplicationKey         app key get <key-id> --project-id --app-id
[x] ListApplicationKeys       app key list --project-id
[x] DeleteApplicationKey      app key delete <key-id> --project-id --app-id

---

## SessionService — 3/5 ✅

[x] GetSession                session get <id>
[x] ListSessions              session list
[x] CreateSession             session create
[x] SetSession                session set <id> --token
[x] DeleteSession             session delete <id>

---

## SettingsService — 11/14 ✅

[x] GetGeneralSettings        settings general
[x] GetLoginSettings          settings login [--org-id]
[x] GetActiveIdentityProviders settings active-idps [--org-id]
[x] GetPasswordComplexitySettings settings password-complexity [--org-id]
[x] GetPasswordExpirySettings settings password-expiry [--org-id]
[x] GetBrandingSettings       settings branding [--org-id]
[x] GetDomainSettings         settings domain [--org-id]
[x] GetLockoutSettings        settings lockout [--org-id]
[x] GetSecuritySettings       settings security
[x] GetHostedLoginTranslation settings hosted-login get --locale
[x] SetHostedLoginTranslation settings hosted-login set --locale --json

[ ] GetLegalAndSupportSettings  (deprecated, use link)
[ ] SetSecuritySettings         settings security-set [--enable-impersonation]

---

## FeatureService — 12/12 ✅ (all wired)

[x] GetSystemFeatures         feature system get
[x] SetSystemFeatures         feature system set --json
[x] ResetSystemFeatures       feature system reset
[x] GetInstanceFeatures       feature instance get
[x] SetInstanceFeatures       feature instance set --json
[x] ResetInstanceFeatures     feature instance reset
[x] GetOrganizationFeatures   feature org get <id>
[x] SetOrganizationFeatures   feature org set <id> --json
[x] ResetOrganizationFeatures feature org reset <id>
[x] GetUserFeatures           feature user get <id>
[x] SetUserFeatures           feature user set <id> --json
[x] ResetUserFeatures         feature user reset <id>

---

## AuthorizationService (v2beta) — 4/6 ✅

[x] ListAuthorizations        authorization list
[x] DeleteAuthorization       authorization delete <id>
[x] ActivateAuthorization     authorization activate <id>
[x] DeactivateAuthorization   authorization deactivate <id>
[x] CreateAuthorization       authorization create --user-id --project-id --role-keys
[x] UpdateAuthorization       authorization update <id> --role-keys

---

## WebKeyService — 2/4 ✅

[x] ListWebKeys               webkey list
[x] CreateWebKey              webkey create [--type]
[x] ActivateWebKey            webkey activate <id>
[x] DeleteWebKey              webkey delete <id>

---

## IdentityProviderService — 1/1 ✅

[x] GetIDPByID                idp get <id>

---

## InstanceService (v2beta) — 3/10 ✅

[x] GetInstance               instance get <id>
[x] ListInstances              instance list
[x] DeleteInstance             instance delete <id> [--confirm]
[x] UpdateInstance             instance update <id> --name
[x] AddCustomDomain            instance domain add <id> --domain
[x] RemoveCustomDomain         instance domain remove <id> --domain
[x] ListCustomDomains          instance domain list <id>
[x] AddTrustedDomain           instance trusted-domain add <id> --domain
[x] RemoveTrustedDomain        instance trusted-domain remove <id> --domain
[x] ListTrustedDomains         instance trusted-domain list <id>

---

## SystemService (v1) — REST fallback, all 24 RPCs in npm package

### Instance lifecycle
[ ] Healthz                    system healthz
[ ] ListInstances              system instance list
[ ] GetInstance                system instance get <id>
[ ] CreateInstance             system instance create --name
[ ] UpdateInstance             system instance update <id> --name
[ ] RemoveInstance             system instance delete <id> [--confirm]

### IAM Members
[ ] ListIAMMembers             system iam-members list <id>

### Domains
[ ] ExistsDomain               system domain exists <domain>
[ ] ListDomains                system domain list <instance-id>
[ ] AddDomain                  system domain add <instance-id> --domain
[ ] RemoveDomain               system domain remove <instance-id> --domain
[ ] SetPrimaryDomain           system domain set-primary <instance-id> --domain

### Views (debug)
[ ] ListViews                  system views list
[ ] ClearView                  system view clear <database> <view-name>

### Failed Events (debug)
[ ] ListFailedEvents           system failed-events list
[ ] RemoveFailedEvent          system failed-event remove <database> <view-name> <sequence>

### Quotas
[ ] AddQuota                   system quota add <instance-id> --unit --amount
[ ] SetQuota                   system quota set <instance-id> --unit --amount
[ ] RemoveQuota                system quota remove <instance-id> <unit>

### Features
[ ] SetInstanceFeature         system feature set <instance-id> --key --value

### Limits
[ ] SetLimits                  system limits set <instance-id>
[ ] BulkSetLimits              system limits bulk-set
[ ] ResetLimits                system limits reset <instance-id>

---

## Services not yet in npm package
- GroupService — not available yet
- OIDCService — skip (login UI only)
- SAMLService — skip (login UI only)
- V1 AdminService writes — planned for later
- V1 ManagementService writes — planned for later
