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

[x] AddOrganization           org create --name
[x] ListOrganizations         org list
[ ] (remaining methods not in npm v2 package)

---

## ProjectService (v2beta) — 6/19 ✅

[x] GetProject                project get <id>
[x] ListProjects              project list
[x] DeleteProject             project delete <id> [--confirm]
[x] DeactivateProject         project deactivate <id>
[x] ActivateProject           project activate <id>

[ ] CreateProject             project create --name
[ ] UpdateProject             project update <id>
[ ] AddProjectRole            project role add <id> --key --display-name
[ ] UpdateProjectRole         project role update <id> --key
[ ] RemoveProjectRole         project role remove <id> --key
[ ] ListProjectRoles          project role list <id>
[ ] CreateProjectGrant        project grant create <id> --org-id
[ ] UpdateProjectGrant        project grant update <id> --grant-id
[ ] DeleteProjectGrant        project grant delete <id> --grant-id
[ ] ActivateProjectGrant      project grant activate <id> --grant-id
[ ] DeactivateProjectGrant    project grant deactivate <id> --grant-id
[ ] ListProjectGrants         project grant list <id>

---

## ApplicationService (v2beta) — 3/12 ✅

[x] GetApplication            app get <id>
[x] ListApplications          app list --project-id
[x] DeleteApplication         app delete <id> --project-id [--confirm]

[ ] CreateApplication         app create --project-id --name
[ ] UpdateApplication         app update <id> --project-id
[ ] DeactivateApplication     app deactivate <id> --project-id
[ ] ReactivateApplication     app reactivate <id> --project-id
[ ] RegenerateClientSecret    app secret generate --project-id --app-id
[ ] CreateApplicationKey      app key create --project-id --app-id
[ ] GetApplicationKey         app key get <id> --project-id --app-id --key-id
[ ] ListApplicationKeys       app key list --project-id --app-id
[ ] DeleteApplicationKey      app key delete --project-id --app-id --key-id

---

## SessionService — 3/5 ✅

[x] GetSession                session get <id>
[x] ListSessions              session list
[x] DeleteSession             session delete <id>
[ ] CreateSession             session create
[ ] SetSession                session set <id>

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
[ ] CreateAuthorization       authorization create
[ ] UpdateAuthorization       authorization update <id>

---

## WebKeyService — 2/4 ✅

[x] ListWebKeys               webkey list
[x] ActivateWebKey            webkey activate <id>
[ ] CreateWebKey              webkey create
[ ] DeleteWebKey              webkey delete <id>

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

## SystemService (v1) — REST fallback

[x] Instance list              system instance list
[x] Instance get               system instance get <id>
[x] Instance create            system instance create --name

---

## Services not yet in npm package
- GroupService — not available yet
- OIDCService — skip (login UI only)
- SAMLService — skip (login UI only)
- V1 AdminService writes — planned for later
- V1 ManagementService writes — planned for later
