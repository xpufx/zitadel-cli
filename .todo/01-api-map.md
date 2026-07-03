# API Implementation Status

## Legend
- [x] implemented and wired in CLI
- [ ] not implemented

---

## UserService — 59/63 ✅

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
[x] AddPersonalAccessToken    user pat add <id> [--expiration]
[x] AddSecret                 user secret add <id>
[x] RemoveSecret              user secret remove <id>
[x] AddIDPLink                user idp-link add <id> --idp-id --idp-user-id --idp-username
[x] RegisterPasskey           user passkey register <id> --domain --authenticator
[x] VerifyPasskeyRegistration user passkey verify <id> --passkey-id --name --credential
[x] CreatePasskeyRegistrationLink  user passkey link <id> [--url-template]
[x] RegisterU2F               user u2f register <id> --domain
[x] VerifyU2FRegistration     user u2f verify <id> --u2f-id --name --credential
[x] RemoveU2F                 user u2f remove <id> <u2f-id>
[x] RegisterTOTP              user totp register <id>
[x] VerifyTOTPRegistration    user totp verify <id> --code
[x] RemoveTOTP                user totp remove <id>
[x] AddOTPSMS                 user otp-sms add <id>
[x] RemoveOTPSMS              user otp-sms remove <id>
[x] AddOTPEmail               user otp-email add <id>
[x] RemoveOTPEmail            user otp-email remove <id>
[x] HumanMFAInitSkipped       user mfa-skip <id>
[x] CreateInviteCode          user invite create <id> [--notify-email | --return-code]
[x] ResendInviteCode          user invite resend <id> [--notify-email | --return-code]
[x] VerifyInviteCode          user invite verify <id> --code

[ ] GenerateRecoveryCodes     user recovery-codes generate <id>  (not in proto package)
[ ] RemoveRecoveryCodes       user recovery-codes remove <id>    (not in proto package)
[ ] AddKey                    user key add <id>                  (requires raw public key bytes)
[ ] StartIdentityProviderIntent    (internal/login UI)
[ ] RetrieveIdentityProviderIntent (internal/login UI)

---

## OrganizationService (v2) — 14/14 ✅

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

## ProjectService (v2beta) — 17/17 ✅

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

## ApplicationService (v2beta) — 12/12 ✅

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

## SessionService — 5/5 ✅

[x] GetSession                session get <id>
[x] ListSessions              session list
[x] CreateSession             session create
[x] SetSession                session set <id> --token
[x] DeleteSession             session delete <id>

---

## SettingsService — 12/13 ✅

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
[x] SetSecuritySettings       settings set-security [--enable-impersonation] [--embedded-css-url] [--embedded-js-url]

[ ] GetLegalAndSupportSettings  (deprecated, use link)

---

## FeatureService — 9/12 ✅

[x] GetSystemFeatures         feature system get
[x] SetSystemFeatures         feature system set --json
[x] ResetSystemFeatures       feature system reset
[x] GetInstanceFeatures       feature instance get
[x] ResetInstanceFeatures     feature instance reset
[x] GetOrganizationFeatures   feature org get <id>
[x] ResetOrganizationFeatures feature org reset <id>
[x] GetUserFeatures           feature user get <id>
[x] ResetUserFeatures         feature user reset <id>

[ ] SetInstanceFeatures       (proto has no feature flags in request)
[ ] SetOrganizationFeatures   (proto has no feature flags in request)
[ ] SetUserFeature            (proto has no feature flags in request)

---

## AuthorizationService (v2beta) — 6/6 ✅

[x] ListAuthorizations        authorization list
[x] DeleteAuthorization       authorization delete <id>
[x] ActivateAuthorization     authorization activate <id>
[x] DeactivateAuthorization   authorization deactivate <id>
[x] CreateAuthorization       authorization create --user-id --project-id --role-keys
[x] UpdateAuthorization       authorization update <id> --role-keys

---

## WebKeyService — 4/4 ✅

[x] ListWebKeys               webkey list
[x] CreateWebKey              webkey create [--type]
[x] ActivateWebKey            webkey activate <id>
[x] DeleteWebKey              webkey delete <id>

---

## IdentityProviderService — 1/1 ✅

[x] GetIDPByID                idp get <id>

---

## InstanceService (v2beta) — 10/10 ✅

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

## SystemService (v1) — 4/24 (REST fallback)

### Instance lifecycle
[x] Healthz                    system healthz
[x] ListInstances              system instance list
[x] GetInstance                system instance get <id>
[x] CreateInstance             system instance create --name

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
