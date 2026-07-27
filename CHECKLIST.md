# ZITADEL CLI/MCP Coverage Checklist

Generated: 2026-07-07

Detection: gRPC client calls + raw HTTP patterns (healthz, system, instance).

The `api_query` tool provides unrestricted access to any gRPC endpoint not listed here.

Legend: **✅** covered | **❌** missing


## user (56/60)

| Method | Input | Type | Status |
|---|---|---|---|
| CreateUser | CreateUser | write | ✅ |
| AddHumanUser | AddHumanUser | write | ✅ |
| GetUserByID | GetUserByID | read | ✅ |
| ListUsers | ListUsers | read | ✅ |
| SetEmail | SetEmail | write | ✅ |
| ResendEmailCode | ResendEmailCode | read | ✅ |
| SendEmailCode | SendEmailCode | read | ✅ |
| VerifyEmail | VerifyEmail | read | ✅ |
| SetPhone | SetPhone | write | ✅ |
| RemovePhone | RemovePhone | write | ✅ |
| ResendPhoneCode | ResendPhoneCode | read | ✅ |
| VerifyPhone | VerifyPhone | read | ✅ |
| UpdateUser | UpdateUser | write | ✅ |
| UpdateHumanUser | UpdateHumanUser | write | ✅ |
| DeactivateUser | DeactivateUser | write | ✅ |
| ReactivateUser | ReactivateUser | read | ✅ |
| LockUser | LockUser | read | ✅ |
| UnlockUser | UnlockUser | read | ✅ |
| DeleteUser | DeleteUser | write | ✅ |
| RegisterPasskey | RegisterPasskey | read | ✅ |
| VerifyPasskeyRegistration | VerifyPasskeyRegistration | read | ✅ |
| CreatePasskeyRegistrationLink | CreatePasskeyRegistrationLink | write | ✅ |
| ListPasskeys | ListPasskeys | read | ✅ |
| RemovePasskey | RemovePasskey | write | ✅ |
| RegisterU2F | RegisterU2F | read | ✅ |
| VerifyU2FRegistration | VerifyU2FRegistration | read | ✅ |
| RemoveU2F | RemoveU2F | write | ✅ |
| RegisterTOTP | RegisterTOTP | read | ✅ |
| VerifyTOTPRegistration | VerifyTOTPRegistration | read | ✅ |
| RemoveTOTP | RemoveTOTP | write | ✅ |
| AddOTPSMS | AddOTPSMS | write | ✅ |
| RemoveOTPSMS | RemoveOTPSMS | write | ✅ |
| GenerateRecoveryCodes | GenerateRecoveryCodes | write | ❌ |
| RemoveRecoveryCodes | RemoveRecoveryCodes | write | ❌ |
| AddOTPEmail | AddOTPEmail | write | ✅ |
| RemoveOTPEmail | RemoveOTPEmail | write | ✅ |
| StartIdentityProviderIntent | StartIdentityProviderIntent | read | ❌ |
| RetrieveIdentityProviderIntent | RetrieveIdentityProviderIntent | read | ❌ |
| AddIDPLink | AddIDPLink | write | ✅ |
| ListIDPLinks | ListIDPLinks | read | ✅ |
| RemoveIDPLink | RemoveIDPLink | write | ✅ |
| PasswordReset | PasswordReset | read | ✅ |
| SetPassword | SetPassword | write | ✅ |
| AddSecret | AddSecret | write | ✅ |
| RemoveSecret | RemoveSecret | write | ✅ |
| AddKey | AddKey | write | ✅ |
| RemoveKey | RemoveKey | write | ✅ |
| ListKeys | ListKeys | read | ✅ |
| AddPersonalAccessToken | AddPersonalAccessToken | write | ✅ |
| RemovePersonalAccessToken | RemovePersonalAccessToken | write | ✅ |
| ListPersonalAccessTokens | ListPersonalAccessTokens | read | ✅ |
| ListAuthenticationMethodTypes | ListAuthenticationMethodTypes | read | ✅ |
| ListAuthenticationFactors | ListAuthenticationFactors | read | ✅ |
| CreateInviteCode | CreateInviteCode | write | ✅ |
| ResendInviteCode | ResendInviteCode | read | ✅ |
| VerifyInviteCode | VerifyInviteCode | read | ✅ |
| HumanMFAInitSkipped | HumanMFAInitSkipped | read | ✅ |
| SetUserMetadata | SetUserMetadata | write | ✅ |
| ListUserMetadata | ListUserMetadata | read | ✅ |
| DeleteUserMetadata | DeleteUserMetadata | write | ✅ |

## org (13/14)

| Method | Input | Type | Status |
|---|---|---|---|
| AddOrganization | AddOrganization | write | ❌ |
| UpdateOrganization | UpdateOrganization | write | ✅ |
| ListOrganizations | ListOrganizations | read | ✅ |
| DeleteOrganization | DeleteOrganization | write | ✅ |
| SetOrganizationMetadata | SetOrganizationMetadata | write | ✅ |
| ListOrganizationMetadata | ListOrganizationMetadata | read | ✅ |
| DeleteOrganizationMetadata | DeleteOrganizationMetadata | write | ✅ |
| AddOrganizationDomain | AddOrganizationDomain | write | ✅ |
| ListOrganizationDomains | ListOrganizationDomains | read | ✅ |
| DeleteOrganizationDomain | DeleteOrganizationDomain | write | ✅ |
| GenerateOrganizationDomainValidation | GenerateOrganizationDomainValidation | write | ✅ |
| VerifyOrganizationDomain | VerifyOrganizationDomain | read | ✅ |
| DeactivateOrganization | DeactivateOrganization | write | ✅ |
| ActivateOrganization | ActivateOrganization | write | ✅ |

## project (17/17)

| Method | Input | Type | Status |
|---|---|---|---|
| CreateProject | CreateProject | write | ✅ |
| UpdateProject | UpdateProject | write | ✅ |
| DeleteProject | DeleteProject | write | ✅ |
| GetProject | GetProject | read | ✅ |
| ListProjects | ListProjects | read | ✅ |
| DeactivateProject | DeactivateProject | write | ✅ |
| ActivateProject | ActivateProject | write | ✅ |
| AddProjectRole | AddProjectRole | write | ✅ |
| UpdateProjectRole | UpdateProjectRole | write | ✅ |
| RemoveProjectRole | RemoveProjectRole | write | ✅ |
| ListProjectRoles | ListProjectRoles | read | ✅ |
| CreateProjectGrant | CreateProjectGrant | write | ✅ |
| UpdateProjectGrant | UpdateProjectGrant | write | ✅ |
| DeleteProjectGrant | DeleteProjectGrant | write | ✅ |
| DeactivateProjectGrant | DeactivateProjectGrant | write | ✅ |
| ActivateProjectGrant | ActivateProjectGrant | write | ✅ |
| ListProjectGrants | ListProjectGrants | read | ✅ |

## application (11/12)

| Method | Input | Type | Status |
|---|---|---|---|
| CreateApplication | CreateApplication | write | ✅ |
| UpdateApplication | UpdateApplication | write | ✅ |
| GetApplication | GetApplication | read | ✅ |
| DeleteApplication | DeleteApplication | write | ✅ |
| DeactivateApplication | DeactivateApplication | write | ✅ |
| ReactivateApplication | ReactivateApplication | read | ✅ |
| GenerateClientSecret | GenerateClientSecret | write | ❌ |
| ListApplications | ListApplications | read | ✅ |
| CreateApplicationKey | CreateApplicationKey | write | ✅ |
| DeleteApplicationKey | DeleteApplicationKey | write | ✅ |
| GetApplicationKey | GetApplicationKey | read | ✅ |
| ListApplicationKeys | ListApplicationKeys | read | ✅ |

## settings (13/20)

| Method | Input | Type | Status |
|---|---|---|---|
| GetGeneralSettings | GetGeneralSettings | read | ✅ |
| GetLoginSettings | GetLoginSettings | read | ✅ |
| GetActiveIdentityProviders | GetActiveIdentityProviders | read | ✅ |
| GetPasswordComplexitySettings | GetPasswordComplexitySettings | read | ✅ |
| GetPasswordExpirySettings | GetPasswordExpirySettings | read | ✅ |
| GetBrandingSettings | GetBrandingSettings | read | ✅ |
| GetDomainSettings | GetDomainSettings | read | ✅ |
| GetLegalAndSupportSettings | GetLegalAndSupportSettings | read | ✅ |
| GetLockoutSettings | GetLockoutSettings | read | ✅ |
| GetSecuritySettings | GetSecuritySettings | read | ✅ |
| SetSecuritySettings | SetSecuritySettings | write | ✅ |
| SetOrganizationSettings | SetOrganizationSettings | write | ❌ |
| DeleteOrganizationSettings | DeleteOrganizationSettings | write | ❌ |
| ListOrganizationSettings | ListOrganizationSettings | read | ❌ |
| GetHostedLoginTranslation | GetHostedLoginTranslation | read | ✅ |
| SetHostedLoginTranslation | SetHostedLoginTranslation | write | ✅ |
| GetLinkSettings | GetLinkSettings | read | ❌ |
| SetLinkSettings | SetLinkSettings | write | ❌ |
| ResetLinkSettings | ResetLinkSettings | write | ❌ |
| GetEffectiveSettings | GetEffectiveSettings | read | ❌ |

## feature (12/12)

| Method | Input | Type | Status |
|---|---|---|---|
| SetSystemFeatures | SetSystemFeatures | write | ✅ |
| ResetSystemFeatures | ResetSystemFeatures | write | ✅ |
| GetSystemFeatures | GetSystemFeatures | read | ✅ |
| SetInstanceFeatures | SetInstanceFeatures | write | ✅ |
| ResetInstanceFeatures | ResetInstanceFeatures | write | ✅ |
| GetInstanceFeatures | GetInstanceFeatures | read | ✅ |
| SetOrganizationFeatures | SetOrganizationFeatures | write | ✅ |
| ResetOrganizationFeatures | ResetOrganizationFeatures | write | ✅ |
| GetOrganizationFeatures | GetOrganizationFeatures | read | ✅ |
| SetUserFeatures | SetUserFeature | write | ✅ |
| ResetUserFeatures | ResetUserFeatures | write | ✅ |
| GetUserFeatures | GetUserFeatures | read | ✅ |

## session (5/5)

| Method | Input | Type | Status |
|---|---|---|---|
| ListSessions | ListSessions | read | ✅ |
| GetSession | GetSession | read | ✅ |
| CreateSession | CreateSession | write | ✅ |
| SetSession | SetSession | write | ✅ |
| DeleteSession | DeleteSession | write | ✅ |

## authorization (6/6)

| Method | Input | Type | Status |
|---|---|---|---|
| ListAuthorizations | ListAuthorizations | read | ✅ |
| CreateAuthorization | CreateAuthorization | write | ✅ |
| UpdateAuthorization | UpdateAuthorization | write | ✅ |
| DeleteAuthorization | DeleteAuthorization | write | ✅ |
| ActivateAuthorization | ActivateAuthorization | write | ✅ |
| DeactivateAuthorization | DeactivateAuthorization | write | ✅ |

## idp (1/1)

| Method | Input | Type | Status |
|---|---|---|---|
| GetIDPByID | GetIDPByID | read | ✅ |

## oidc (0/4)

| Method | Input | Type | Status |
|---|---|---|---|
| GetAuthRequest | GetAuthRequest | read | ❌ |
| CreateCallback | CreateCallback | write | ❌ |
| GetDeviceAuthorizationRequest | GetDeviceAuthorizationRequest | read | ❌ |
| AuthorizeOrDenyDeviceAuthorization | AuthorizeOrDenyDeviceAuthorization | read | ❌ |

## saml (0/2)

| Method | Input | Type | Status |
|---|---|---|---|
| GetSAMLRequest | GetSAMLRequest | read | ❌ |
| CreateResponse | Create | write | ❌ |

## system.proto (7/24)

| Method | Input | Type | Status |
|---|---|---|---|
| Healthz | Healthz | read | ✅ |
| ListInstances | ListInstances | read | ✅ |
| GetInstance | GetInstance | read | ✅ |
| AddInstance | AddInstance | write | ✅ |
| UpdateInstance | UpdateInstance | write | ✅ |
| CreateInstance | CreateInstance | write | ✅ |
| RemoveInstance | RemoveInstance | write | ✅ |
| ListIAMMembers | ListIAMMembers | read | ❌ |
| ExistsDomain | ExistsDomain | read | ❌ |
| ListDomains | ListDomains | read | ❌ |
| AddDomain | AddDomain | write | ❌ |
| RemoveDomain | RemoveDomain | write | ❌ |
| SetPrimaryDomain | SetPrimaryDomain | write | ❌ |
| ListViews | ListViews | read | ❌ |
| ClearView | ClearView | read | ❌ |
| ListFailedEvents | ListFailedEvents | read | ❌ |
| RemoveFailedEvent | RemoveFailedEvent | write | ❌ |
| AddQuota | AddQuota | write | ❌ |
| SetQuota | SetQuota | write | ❌ |
| RemoveQuota | RemoveQuota | write | ❌ |
| SetInstanceFeature | SetInstanceFeature | write | ❌ |
| SetLimits | SetLimits | write | ❌ |
| BulkSetLimits | BulkSetLimits | write | ❌ |
| ResetLimits | ResetLimits | write | ❌ |

## instance (10/10)

| Method | Input | Type | Status |
|---|---|---|---|
| DeleteInstance | DeleteInstance | write | ✅ |
| GetInstance | GetInstance | read | ✅ |
| UpdateInstance | UpdateInstance | write | ✅ |
| ListInstances | ListInstances | read | ✅ |
| AddCustomDomain | AddCustomDomain | write | ✅ |
| RemoveCustomDomain | RemoveCustomDomain | write | ✅ |
| ListCustomDomains | ListCustomDomains | read | ✅ |
| AddTrustedDomain | AddTrustedDomain | write | ✅ |
| RemoveTrustedDomain | RemoveTrustedDomain | write | ✅ |
| ListTrustedDomains | ListTrustedDomains | read | ✅ |

## webkey (4/4)

| Method | Input | Type | Status |
|---|---|---|---|
| CreateWebKey | CreateWebKey | write | ✅ |
| ActivateWebKey | ActivateWebKey | write | ✅ |
| DeleteWebKey | DeleteWebKey | write | ✅ |
| ListWebKeys | ListWebKeys | read | ✅ |

## admin.proto (13/205)

| Method | Input | Type | Status |
|---|---|---|---|
| Healthz | Healthz | read | ✅ |
| GetSupportedLanguages | GetSupportedLanguages | read | ❌ |
| GetAllowedLanguages | GetAllowedLanguages | read | ❌ |
| SetDefaultLanguage | SetDefaultLanguage | write | ❌ |
| GetDefaultLanguage | GetDefaultLanguage | read | ❌ |
| GetMyInstance | GetMyInstance | read | ❌ |
| ListInstanceDomains | ListInstanceDomains | read | ❌ |
| ListInstanceTrustedDomains | ListInstanceTrustedDomains | read | ❌ |
| AddInstanceTrustedDomain | AddInstanceTrustedDomain | write | ❌ |
| RemoveInstanceTrustedDomain | RemoveInstanceTrustedDomain | write | ❌ |
| ListSecretGenerators | ListSecretGenerators | read | ❌ |
| GetSecretGenerator | GetSecretGenerator | read | ❌ |
| UpdateSecretGenerator | UpdateSecretGenerator | write | ❌ |
| GetSMTPConfig | GetSMTPConfig | read | ❌ |
| GetSMTPConfigById | GetSMTPConfigById | read | ❌ |
| AddSMTPConfig | AddSMTPConfig | write | ❌ |
| UpdateSMTPConfig | UpdateSMTPConfig | write | ❌ |
| UpdateSMTPConfigPassword | UpdateSMTPConfigPassword | write | ❌ |
| ActivateSMTPConfig | ActivateSMTPConfig | write | ❌ |
| DeactivateSMTPConfig | DeactivateSMTPConfig | write | ❌ |
| RemoveSMTPConfig | RemoveSMTPConfig | write | ❌ |
| TestSMTPConfigById | TestSMTPConfigById | read | ❌ |
| TestSMTPConfig | TestSMTPConfig | read | ❌ |
| ListSMTPConfigs | ListSMTPConfigs | read | ❌ |
| ListEmailProviders | ListEmailProviders | read | ❌ |
| GetEmailProvider | GetEmailProvider | read | ❌ |
| GetEmailProviderById | GetEmailProviderById | read | ❌ |
| AddEmailProviderSMTP | AddEmailProviderSMTP | write | ❌ |
| UpdateEmailProviderSMTP | UpdateEmailProviderSMTP | write | ❌ |
| AddEmailProviderHTTP | AddEmailProviderHTTP | write | ❌ |
| UpdateEmailProviderHTTP | UpdateEmailProviderHTTP | write | ❌ |
| UpdateEmailProviderSMTPPassword | UpdateEmailProviderSMTPPassword | write | ❌ |
| ActivateEmailProvider | ActivateEmailProvider | write | ❌ |
| DeactivateEmailProvider | DeactivateEmailProvider | write | ❌ |
| RemoveEmailProvider | RemoveEmailProvider | write | ❌ |
| TestEmailProviderSMTPById | TestEmailProviderSMTPById | read | ❌ |
| TestEmailProviderSMTP | TestEmailProviderSMTP | read | ❌ |
| ListSMSProviders | ListSMSProviders | read | ❌ |
| GetSMSProvider | GetSMSProvider | read | ❌ |
| AddSMSProviderTwilio | AddSMSProviderTwilio | write | ❌ |
| UpdateSMSProviderTwilio | UpdateSMSProviderTwilio | write | ❌ |
| UpdateSMSProviderTwilioToken | UpdateSMSProviderTwilioToken | write | ❌ |
| AddSMSProviderHTTP | AddSMSProviderHTTP | write | ❌ |
| UpdateSMSProviderHTTP | UpdateSMSProviderHTTP | write | ❌ |
| ActivateSMSProvider | ActivateSMSProvider | write | ❌ |
| DeactivateSMSProvider | DeactivateSMSProvider | write | ❌ |
| RemoveSMSProvider | RemoveSMSProvider | write | ❌ |
| GetOIDCSettings | GetOIDCSettings | read | ❌ |
| AddOIDCSettings | AddOIDCSettings | write | ❌ |
| UpdateOIDCSettings | UpdateOIDCSettings | write | ❌ |
| GetFileSystemNotificationProvider | GetFileSystemNotificationProvider | read | ❌ |
| GetLogNotificationProvider | GetLogNotificationProvider | read | ❌ |
| GetSecurityPolicy | GetSecurityPolicy | read | ❌ |
| SetSecurityPolicy | SetSecurityPolicy | write | ❌ |
| GetOrgByID | GetOrgByID | read | ❌ |
| IsOrgUnique | IsOrgUnique | read | ❌ |
| SetDefaultOrg | SetDefaultOrg | write | ❌ |
| GetDefaultOrg | GetDefaultOrg | read | ❌ |
| ListOrgs | ListOrgs | read | ❌ |
| SetUpOrg | SetUpOrg | write | ❌ |
| RemoveOrg | RemoveOrg | write | ❌ |
| GetIDPByID | GetIDPByID | read | ❌ |
| ListIDPs | ListIDPs | read | ❌ |
| AddOIDCIDP | AddOIDCIDP | write | ❌ |
| AddJWTIDP | AddJWTIDP | write | ❌ |
| UpdateIDP | UpdateIDP | write | ❌ |
| DeactivateIDP | DeactivateIDP | write | ❌ |
| ReactivateIDP | ReactivateIDP | read | ❌ |
| RemoveIDP | RemoveIDP | write | ❌ |
| UpdateIDPOIDCConfig | UpdateIDPOIDCConfig | write | ❌ |
| UpdateIDPJWTConfig | UpdateIDPJWTConfig | write | ❌ |
| ListProviders | ListProviders | read | ❌ |
| GetProviderByID | GetProviderByID | read | ❌ |
| AddGenericOAuthProvider | AddGenericOAuthProvider | write | ❌ |
| UpdateGenericOAuthProvider | UpdateGenericOAuthProvider | write | ❌ |
| AddGenericOIDCProvider | AddGenericOIDCProvider | write | ❌ |
| UpdateGenericOIDCProvider | UpdateGenericOIDCProvider | write | ❌ |
| MigrateGenericOIDCProvider | MigrateGenericOIDCProvider | read | ❌ |
| AddJWTProvider | AddJWTProvider | write | ❌ |
| UpdateJWTProvider | UpdateJWTProvider | write | ❌ |
| AddAzureADProvider | AddAzureADProvider | write | ❌ |
| UpdateAzureADProvider | UpdateAzureADProvider | write | ❌ |
| AddGitHubProvider | AddGitHubProvider | write | ❌ |
| UpdateGitHubProvider | UpdateGitHubProvider | write | ❌ |
| AddGitHubEnterpriseServerProvider | AddGitHubEnterpriseServerProvider | write | ❌ |
| UpdateGitHubEnterpriseServerProvider | UpdateGitHubEnterpriseServerProvider | write | ❌ |
| AddGitLabProvider | AddGitLabProvider | write | ❌ |
| UpdateGitLabProvider | UpdateGitLabProvider | write | ❌ |
| AddGitLabSelfHostedProvider | AddGitLabSelfHostedProvider | write | ❌ |
| UpdateGitLabSelfHostedProvider | UpdateGitLabSelfHostedProvider | write | ❌ |
| AddGoogleProvider | AddGoogleProvider | write | ❌ |
| UpdateGoogleProvider | UpdateGoogleProvider | write | ❌ |
| AddLDAPProvider | AddLDAPProvider | write | ❌ |
| UpdateLDAPProvider | UpdateLDAPProvider | write | ❌ |
| AddAppleProvider | AddAppleProvider | write | ❌ |
| UpdateAppleProvider | UpdateAppleProvider | write | ❌ |
| AddSAMLProvider | AddSAMLProvider | write | ❌ |
| UpdateSAMLProvider | UpdateSAMLProvider | write | ❌ |
| RegenerateSAMLProviderCertificate | RegenerateSAMLProviderCertificate | write | ❌ |
| AddZitadelProvider | AddZitadelProvider | write | ❌ |
| DeleteProvider | DeleteProvider | write | ❌ |
| GetOrgIAMPolicy | GetOrgIAMPolicy | read | ❌ |
| UpdateOrgIAMPolicy | UpdateOrgIAMPolicy | write | ❌ |
| GetCustomOrgIAMPolicy | GetCustomOrgIAMPolicy | read | ❌ |
| AddCustomOrgIAMPolicy | AddCustomOrgIAMPolicy | write | ❌ |
| UpdateCustomOrgIAMPolicy | UpdateCustomOrgIAMPolicy | write | ❌ |
| ResetCustomOrgIAMPolicyToDefault | ResetCustomOrgIAMPolicyToDefault | write | ❌ |
| GetDomainPolicy | GetDomainPolicy | read | ✅ |
| UpdateDomainPolicy | UpdateDomainPolicy | write | ✅ |
| GetCustomDomainPolicy | GetCustomDomainPolicy | read | ❌ |
| AddCustomDomainPolicy | AddCustomDomainPolicy | write | ❌ |
| UpdateCustomDomainPolicy | UpdateCustomDomainPolicy | write | ❌ |
| ResetCustomDomainPolicyToDefault | ResetCustomDomainPolicyToDefault | write | ❌ |
| GetLabelPolicy | GetLabelPolicy | read | ✅ |
| GetPreviewLabelPolicy | GetPreviewLabelPolicy | read | ❌ |
| UpdateLabelPolicy | UpdateLabelPolicy | write | ✅ |
| ActivateLabelPolicy | ActivateLabelPolicy | write | ❌ |
| RemoveLabelPolicyLogo | RemoveLabelPolicyLogo | write | ❌ |
| RemoveLabelPolicyLogoDark | RemoveLabelPolicyLogoDark | write | ❌ |
| RemoveLabelPolicyIcon | RemoveLabelPolicyIcon | write | ❌ |
| RemoveLabelPolicyIconDark | RemoveLabelPolicyIconDark | write | ❌ |
| RemoveLabelPolicyFont | RemoveLabelPolicyFont | write | ❌ |
| GetLoginPolicy | GetLoginPolicy | read | ✅ |
| UpdateLoginPolicy | UpdateLoginPolicy | write | ✅ |
| ListLoginPolicyIDPs | ListLoginPolicyIDPs | read | ❌ |
| AddIDPToLoginPolicy | AddIDPToLoginPolicy | write | ❌ |
| RemoveIDPFromLoginPolicy | RemoveIDPFromLoginPolicy | write | ❌ |
| ListLoginPolicySecondFactors | ListLoginPolicySecondFactors | read | ❌ |
| AddSecondFactorToLoginPolicy | AddSecondFactorToLoginPolicy | write | ❌ |
| RemoveSecondFactorFromLoginPolicy | RemoveSecondFactorFromLoginPolicy | write | ❌ |
| ListLoginPolicyMultiFactors | ListLoginPolicyMultiFactors | read | ❌ |
| AddMultiFactorToLoginPolicy | AddMultiFactorToLoginPolicy | write | ❌ |
| RemoveMultiFactorFromLoginPolicy | RemoveMultiFactorFromLoginPolicy | write | ❌ |
| GetPasswordComplexityPolicy | GetPasswordComplexityPolicy | read | ✅ |
| UpdatePasswordComplexityPolicy | UpdatePasswordComplexityPolicy | write | ✅ |
| GetPasswordAgePolicy | GetPasswordAgePolicy | read | ✅ |
| UpdatePasswordAgePolicy | UpdatePasswordAgePolicy | write | ✅ |
| GetLockoutPolicy | GetLockoutPolicy | read | ✅ |
| UpdateLockoutPolicy | UpdateLockoutPolicy | write | ✅ |
| GetPrivacyPolicy | GetPrivacyPolicy | read | ❌ |
| UpdatePrivacyPolicy | UpdatePrivacyPolicy | write | ❌ |
| AddNotificationPolicy | AddNotificationPolicy | write | ❌ |
| GetNotificationPolicy | GetNotificationPolicy | read | ❌ |
| UpdateNotificationPolicy | UpdateNotificationPolicy | write | ❌ |
| GetDefaultInitMessageText | GetDefaultInitMessageText | read | ❌ |
| GetCustomInitMessageText | GetCustomInitMessageText | read | ❌ |
| SetDefaultInitMessageText | SetDefaultInitMessageText | write | ❌ |
| ResetCustomInitMessageTextToDefault | ResetCustomInitMessageTextToDefault | write | ❌ |
| GetDefaultPasswordResetMessageText | GetDefaultPasswordResetMessageText | read | ❌ |
| GetCustomPasswordResetMessageText | GetCustomPasswordResetMessageText | read | ❌ |
| SetDefaultPasswordResetMessageText | SetDefaultPasswordResetMessageText | write | ❌ |
| ResetCustomPasswordResetMessageTextToDefault | ResetCustomPasswordResetMessageTextToDefault | write | ❌ |
| GetDefaultVerifyEmailMessageText | GetDefaultVerifyEmailMessageText | read | ❌ |
| GetCustomVerifyEmailMessageText | GetCustomVerifyEmailMessageText | read | ❌ |
| SetDefaultVerifyEmailMessageText | SetDefaultVerifyEmailMessageText | write | ❌ |
| ResetCustomVerifyEmailMessageTextToDefault | ResetCustomVerifyEmailMessageTextToDefault | write | ❌ |
| GetDefaultVerifyPhoneMessageText | GetDefaultVerifyPhoneMessageText | read | ❌ |
| GetCustomVerifyPhoneMessageText | GetCustomVerifyPhoneMessageText | read | ❌ |
| SetDefaultVerifyPhoneMessageText | SetDefaultVerifyPhoneMessageText | write | ❌ |
| ResetCustomVerifyPhoneMessageTextToDefault | ResetCustomVerifyPhoneMessageTextToDefault | write | ❌ |
| GetDefaultVerifySMSOTPMessageText | GetDefaultVerifySMSOTPMessageText | read | ❌ |
| GetCustomVerifySMSOTPMessageText | GetCustomVerifySMSOTPMessageText | read | ❌ |
| SetDefaultVerifySMSOTPMessageText | SetDefaultVerifySMSOTPMessageText | write | ❌ |
| ResetCustomVerifySMSOTPMessageTextToDefault | ResetCustomVerifySMSOTPMessageTextToDefault | write | ❌ |
| GetDefaultVerifyEmailOTPMessageText | GetDefaultVerifyEmailOTPMessageText | read | ❌ |
| GetCustomVerifyEmailOTPMessageText | GetCustomVerifyEmailOTPMessageText | read | ❌ |
| SetDefaultVerifyEmailOTPMessageText | SetDefaultVerifyEmailOTPMessageText | write | ❌ |
| ResetCustomVerifyEmailOTPMessageTextToDefault | ResetCustomVerifyEmailOTPMessageTextToDefault | write | ❌ |
| GetDefaultDomainClaimedMessageText | GetDefaultDomainClaimedMessageText | read | ❌ |
| GetCustomDomainClaimedMessageText | GetCustomDomainClaimedMessageText | read | ❌ |
| SetDefaultDomainClaimedMessageText | SetDefaultDomainClaimedMessageText | write | ❌ |
| ResetCustomDomainClaimedMessageTextToDefault | ResetCustomDomainClaimedMessageTextToDefault | write | ❌ |
| GetDefaultPasswordlessRegistrationMessageText | GetDefaultPasswordlessRegistrationMessageText | read | ❌ |
| GetCustomPasswordlessRegistrationMessageText | GetCustomPasswordlessRegistrationMessageText | read | ❌ |
| SetDefaultPasswordlessRegistrationMessageText | SetDefaultPasswordlessRegistrationMessageText | write | ❌ |
| ResetCustomPasswordlessRegistrationMessageTextToDefault | ResetCustomPasswordlessRegistrationMessageTextToDefault | write | ❌ |
| GetDefaultPasswordChangeMessageText | GetDefaultPasswordChangeMessageText | read | ❌ |
| GetCustomPasswordChangeMessageText | GetCustomPasswordChangeMessageText | read | ❌ |
| SetDefaultPasswordChangeMessageText | SetDefaultPasswordChangeMessageText | write | ❌ |
| ResetCustomPasswordChangeMessageTextToDefault | ResetCustomPasswordChangeMessageTextToDefault | write | ❌ |
| GetDefaultInviteUserMessageText | GetDefaultInviteUserMessageText | read | ❌ |
| GetCustomInviteUserMessageText | GetCustomInviteUserMessageText | read | ❌ |
| SetDefaultInviteUserMessageText | SetDefaultInviteUserMessageText | write | ❌ |
| ResetCustomInviteUserMessageTextToDefault | ResetCustomInviteUserMessageTextToDefault | write | ❌ |
| GetDefaultLoginTexts | GetDefaultLoginTexts | read | ❌ |
| GetCustomLoginTexts | GetCustomLoginTexts | read | ❌ |
| SetCustomLoginText | SetCustomLoginTexts | write | ❌ |
| ResetCustomLoginTextToDefault | ResetCustomLoginTextsToDefault | write | ❌ |
| ListIAMMemberRoles | ListIAMMemberRoles | read | ❌ |
| ListIAMMembers | ListIAMMembers | read | ❌ |
| AddIAMMember | AddIAMMember | write | ❌ |
| UpdateIAMMember | UpdateIAMMember | write | ❌ |
| RemoveIAMMember | RemoveIAMMember | write | ❌ |
| ListViews | ListViews | read | ❌ |
| ListFailedEvents | ListFailedEvents | read | ❌ |
| RemoveFailedEvent | RemoveFailedEvent | write | ❌ |
| ImportData | ImportData | write | ❌ |
| ExportData | ExportData | write | ❌ |
| ListEventTypes | ListEventTypes | read | ❌ |
| ListEvents | ListEvents | read | ❌ |
| ListAggregateTypes | ListAggregateTypes | read | ❌ |
| ActivateFeatureLoginDefaultOrg | ActivateFeatureLoginDefaultOrg | write | ❌ |
| ListMilestones | ListMilestones | read | ❌ |
| SetRestrictions | SetRestrictions | write | ❌ |
| GetRestrictions | GetRestrictions | read | ❌ |

## management.proto (1/297)

| Method | Input | Type | Status |
|---|---|---|---|
| Healthz | Healthz | read | ✅ |
| GetOIDCInformation | GetOIDCInformation | read | ❌ |
| GetIAM | GetIAM | read | ❌ |
| GetSupportedLanguages | GetSupportedLanguages | read | ❌ |
| GetUserByID | GetUserByID | read | ❌ |
| GetUserByLoginNameGlobal | GetUserByLoginNameGlobal | read | ❌ |
| ListUsers | ListUsers | read | ❌ |
| ListUserChanges | ListUserChanges | read | ❌ |
| IsUserUnique | IsUserUnique | read | ❌ |
| AddHumanUser | AddHumanUser | write | ❌ |
| ImportHumanUser | ImportHumanUser | write | ❌ |
| AddMachineUser | AddMachineUser | write | ❌ |
| DeactivateUser | DeactivateUser | write | ❌ |
| ReactivateUser | ReactivateUser | read | ❌ |
| LockUser | LockUser | read | ❌ |
| UnlockUser | UnlockUser | read | ❌ |
| RemoveUser | RemoveUser | write | ❌ |
| UpdateUserName | UpdateUserName | write | ❌ |
| SetUserMetadata | SetUserMetadata | write | ❌ |
| BulkSetUserMetadata | BulkSetUserMetadata | write | ❌ |
| ListUserMetadata | ListUserMetadata | read | ❌ |
| GetUserMetadata | GetUserMetadata | read | ❌ |
| RemoveUserMetadata | RemoveUserMetadata | write | ❌ |
| BulkRemoveUserMetadata | BulkRemoveUserMetadata | write | ❌ |
| GetHumanProfile | GetHumanProfile | read | ❌ |
| UpdateHumanProfile | UpdateHumanProfile | write | ❌ |
| GetHumanEmail | GetHumanEmail | read | ❌ |
| UpdateHumanEmail | UpdateHumanEmail | write | ❌ |
| ResendHumanInitialization | ResendHumanInitialization | read | ❌ |
| ResendHumanEmailVerification | ResendHumanEmailVerification | read | ❌ |
| GetHumanPhone | GetHumanPhone | read | ❌ |
| UpdateHumanPhone | UpdateHumanPhone | write | ❌ |
| RemoveHumanPhone | RemoveHumanPhone | write | ❌ |
| ResendHumanPhoneVerification | ResendHumanPhoneVerification | read | ❌ |
| RemoveHumanAvatar | RemoveHumanAvatar | write | ❌ |
| SetHumanInitialPassword | SetHumanInitialPassword | write | ❌ |
| SetHumanPassword | SetHumanPassword | write | ❌ |
| SendHumanResetPasswordNotification | SendHumanResetPasswordNotification | read | ❌ |
| ListHumanAuthFactors | ListHumanAuthFactors | read | ❌ |
| RemoveHumanAuthFactorOTP | RemoveHumanAuthFactorOTP | write | ❌ |
| RemoveHumanAuthFactorU2F | RemoveHumanAuthFactorU2F | write | ❌ |
| RemoveHumanAuthFactorOTPSMS | RemoveHumanAuthFactorOTPSMS | write | ❌ |
| RemoveHumanAuthFactorOTPEmail | RemoveHumanAuthFactorOTPEmail | write | ❌ |
| ListHumanPasswordless | ListHumanPasswordless | read | ❌ |
| AddPasswordlessRegistration | AddPasswordlessRegistration | write | ❌ |
| SendPasswordlessRegistration | SendPasswordlessRegistration | read | ❌ |
| RemoveHumanPasswordless | RemoveHumanPasswordless | write | ❌ |
| UpdateMachine | UpdateMachine | write | ❌ |
| GenerateMachineSecret | GenerateMachineSecret | write | ❌ |
| RemoveMachineSecret | RemoveMachineSecret | write | ❌ |
| GetMachineKeyByIDs | GetMachineKeyByIDs | read | ❌ |
| ListMachineKeys | ListMachineKeys | read | ❌ |
| AddMachineKey | AddMachineKey | write | ❌ |
| RemoveMachineKey | RemoveMachineKey | write | ❌ |
| GetPersonalAccessTokenByIDs | GetPersonalAccessTokenByIDs | read | ❌ |
| ListPersonalAccessTokens | ListPersonalAccessTokens | read | ❌ |
| AddPersonalAccessToken | AddPersonalAccessToken | write | ❌ |
| RemovePersonalAccessToken | RemovePersonalAccessToken | write | ❌ |
| ListHumanLinkedIDPs | ListHumanLinkedIDPs | read | ❌ |
| RemoveHumanLinkedIDP | RemoveHumanLinkedIDP | write | ❌ |
| ListUserMemberships | ListUserMemberships | read | ❌ |
| GetMyOrg | GetMyOrg | read | ❌ |
| GetOrgByDomainGlobal | GetOrgByDomainGlobal | read | ❌ |
| ListOrgChanges | ListOrgChanges | read | ❌ |
| AddOrg | AddOrg | write | ❌ |
| UpdateOrg | UpdateOrg | write | ❌ |
| DeactivateOrg | DeactivateOrg | write | ❌ |
| ReactivateOrg | ReactivateOrg | read | ❌ |
| RemoveOrg | RemoveOrg | write | ❌ |
| SetOrgMetadata | SetOrgMetadata | write | ❌ |
| BulkSetOrgMetadata | BulkSetOrgMetadata | write | ❌ |
| ListOrgMetadata | ListOrgMetadata | read | ❌ |
| GetOrgMetadata | GetOrgMetadata | read | ❌ |
| RemoveOrgMetadata | RemoveOrgMetadata | write | ❌ |
| BulkRemoveOrgMetadata | BulkRemoveOrgMetadata | write | ❌ |
| AddOrgDomain | AddOrgDomain | write | ❌ |
| ListOrgDomains | ListOrgDomains | read | ❌ |
| RemoveOrgDomain | RemoveOrgDomain | write | ❌ |
| GenerateOrgDomainValidation | GenerateOrgDomainValidation | write | ❌ |
| ValidateOrgDomain | ValidateOrgDomain | read | ❌ |
| SetPrimaryOrgDomain | SetPrimaryOrgDomain | write | ❌ |
| ListOrgMemberRoles | ListOrgMemberRoles | read | ❌ |
| ListOrgMembers | ListOrgMembers | read | ❌ |
| AddOrgMember | AddOrgMember | write | ❌ |
| UpdateOrgMember | UpdateOrgMember | write | ❌ |
| RemoveOrgMember | RemoveOrgMember | write | ❌ |
| GetProjectByID | GetProjectByID | read | ❌ |
| GetGrantedProjectByID | GetGrantedProjectByID | read | ❌ |
| ListProjects | ListProjects | read | ❌ |
| ListGrantedProjects | ListGrantedProjects | read | ❌ |
| ListGrantedProjectRoles | ListGrantedProjectRoles | read | ❌ |
| ListProjectChanges | ListProjectChanges | read | ❌ |
| AddProject | AddProject | write | ❌ |
| UpdateProject | UpdateProject | write | ❌ |
| DeactivateProject | DeactivateProject | write | ❌ |
| ReactivateProject | ReactivateProject | read | ❌ |
| RemoveProject | RemoveProject | write | ❌ |
| ListProjectRoles | ListProjectRoles | read | ❌ |
| AddProjectRole | AddProjectRole | write | ❌ |
| BulkAddProjectRoles | BulkAddProjectRoles | write | ❌ |
| UpdateProjectRole | UpdateProjectRole | write | ❌ |
| RemoveProjectRole | RemoveProjectRole | write | ❌ |
| ListProjectMemberRoles | ListProjectMemberRoles | read | ❌ |
| ListProjectMembers | ListProjectMembers | read | ❌ |
| AddProjectMember | AddProjectMember | write | ❌ |
| UpdateProjectMember | UpdateProjectMember | write | ❌ |
| RemoveProjectMember | RemoveProjectMember | write | ❌ |
| GetAppByID | GetAppByID | read | ❌ |
| ListApps | ListApps | read | ❌ |
| ListAppChanges | ListAppChanges | read | ❌ |
| AddOIDCApp | AddOIDCApp | write | ❌ |
| AddSAMLApp | AddSAMLApp | write | ❌ |
| AddAPIApp | AddAPIApp | write | ❌ |
| UpdateApp | UpdateApp | write | ❌ |
| UpdateOIDCAppConfig | UpdateOIDCAppConfig | write | ❌ |
| UpdateSAMLAppConfig | UpdateSAMLAppConfig | write | ❌ |
| UpdateAPIAppConfig | UpdateAPIAppConfig | write | ❌ |
| DeactivateApp | DeactivateApp | write | ❌ |
| ReactivateApp | ReactivateApp | read | ❌ |
| RemoveApp | RemoveApp | write | ❌ |
| RegenerateOIDCClientSecret | RegenerateOIDCClientSecret | write | ❌ |
| RegenerateAPIClientSecret | RegenerateAPIClientSecret | write | ❌ |
| GetAppKey | GetAppKey | read | ❌ |
| ListAppKeys | ListAppKeys | read | ❌ |
| AddAppKey | AddAppKey | write | ❌ |
| RemoveAppKey | RemoveAppKey | write | ❌ |
| ListProjectGrantChanges | ListProjectGrantChanges | read | ❌ |
| GetProjectGrantByID | GetProjectGrantByID | read | ❌ |
| ListProjectGrants | ListProjectGrants | read | ❌ |
| ListAllProjectGrants | ListAllProjectGrants | read | ❌ |
| AddProjectGrant | AddProjectGrant | write | ❌ |
| UpdateProjectGrant | UpdateProjectGrant | write | ❌ |
| DeactivateProjectGrant | DeactivateProjectGrant | write | ❌ |
| ReactivateProjectGrant | ReactivateProjectGrant | read | ❌ |
| RemoveProjectGrant | RemoveProjectGrant | write | ❌ |
| ListProjectGrantMemberRoles | ListProjectGrantMemberRoles | read | ❌ |
| ListProjectGrantMembers | ListProjectGrantMembers | read | ❌ |
| AddProjectGrantMember | AddProjectGrantMember | write | ❌ |
| UpdateProjectGrantMember | UpdateProjectGrantMember | write | ❌ |
| RemoveProjectGrantMember | RemoveProjectGrantMember | write | ❌ |
| GetUserGrantByID | GetUserGrantByID | read | ❌ |
| ListUserGrants | ListUserGrant | read | ❌ |
| AddUserGrant | AddUserGrant | write | ❌ |
| UpdateUserGrant | UpdateUserGrant | write | ❌ |
| DeactivateUserGrant | DeactivateUserGrant | write | ❌ |
| ReactivateUserGrant | ReactivateUserGrant | read | ❌ |
| RemoveUserGrant | RemoveUserGrant | write | ❌ |
| BulkRemoveUserGrant | BulkRemoveUserGrant | write | ❌ |
| GetOrgIAMPolicy | GetOrgIAMPolicy | read | ❌ |
| GetDomainPolicy | GetDomainPolicy | read | ❌ |
| GetLoginPolicy | GetLoginPolicy | read | ❌ |
| GetDefaultLoginPolicy | GetDefaultLoginPolicy | read | ❌ |
| AddCustomLoginPolicy | AddCustomLoginPolicy | write | ❌ |
| UpdateCustomLoginPolicy | UpdateCustomLoginPolicy | write | ❌ |
| ResetLoginPolicyToDefault | ResetLoginPolicyToDefault | write | ❌ |
| ListLoginPolicyIDPs | ListLoginPolicyIDPs | read | ❌ |
| AddIDPToLoginPolicy | AddIDPToLoginPolicy | write | ❌ |
| RemoveIDPFromLoginPolicy | RemoveIDPFromLoginPolicy | write | ❌ |
| ListLoginPolicySecondFactors | ListLoginPolicySecondFactors | read | ❌ |
| AddSecondFactorToLoginPolicy | AddSecondFactorToLoginPolicy | write | ❌ |
| RemoveSecondFactorFromLoginPolicy | RemoveSecondFactorFromLoginPolicy | write | ❌ |
| ListLoginPolicyMultiFactors | ListLoginPolicyMultiFactors | read | ❌ |
| AddMultiFactorToLoginPolicy | AddMultiFactorToLoginPolicy | write | ❌ |
| RemoveMultiFactorFromLoginPolicy | RemoveMultiFactorFromLoginPolicy | write | ❌ |
| GetPasswordComplexityPolicy | GetPasswordComplexityPolicy | read | ❌ |
| GetDefaultPasswordComplexityPolicy | GetDefaultPasswordComplexityPolicy | read | ❌ |
| AddCustomPasswordComplexityPolicy | AddCustomPasswordComplexityPolicy | write | ❌ |
| UpdateCustomPasswordComplexityPolicy | UpdateCustomPasswordComplexityPolicy | write | ❌ |
| ResetPasswordComplexityPolicyToDefault | ResetPasswordComplexityPolicyToDefault | write | ❌ |
| GetPasswordAgePolicy | GetPasswordAgePolicy | read | ❌ |
| GetDefaultPasswordAgePolicy | GetDefaultPasswordAgePolicy | read | ❌ |
| AddCustomPasswordAgePolicy | AddCustomPasswordAgePolicy | write | ❌ |
| UpdateCustomPasswordAgePolicy | UpdateCustomPasswordAgePolicy | write | ❌ |
| ResetPasswordAgePolicyToDefault | ResetPasswordAgePolicyToDefault | write | ❌ |
| GetLockoutPolicy | GetLockoutPolicy | read | ❌ |
| GetDefaultLockoutPolicy | GetDefaultLockoutPolicy | read | ❌ |
| AddCustomLockoutPolicy | AddCustomLockoutPolicy | write | ❌ |
| UpdateCustomLockoutPolicy | UpdateCustomLockoutPolicy | write | ❌ |
| ResetLockoutPolicyToDefault | ResetLockoutPolicyToDefault | write | ❌ |
| GetPrivacyPolicy | GetPrivacyPolicy | read | ❌ |
| GetDefaultPrivacyPolicy | GetDefaultPrivacyPolicy | read | ❌ |
| AddCustomPrivacyPolicy | AddCustomPrivacyPolicy | write | ❌ |
| UpdateCustomPrivacyPolicy | UpdateCustomPrivacyPolicy | write | ❌ |
| ResetPrivacyPolicyToDefault | ResetPrivacyPolicyToDefault | write | ❌ |
| GetNotificationPolicy | GetNotificationPolicy | read | ❌ |
| GetDefaultNotificationPolicy | GetDefaultNotificationPolicy | read | ❌ |
| AddCustomNotificationPolicy | AddCustomNotificationPolicy | write | ❌ |
| UpdateCustomNotificationPolicy | UpdateCustomNotificationPolicy | write | ❌ |
| ResetNotificationPolicyToDefault | ResetNotificationPolicyToDefault | write | ❌ |
| GetLabelPolicy | GetLabelPolicy | read | ❌ |
| GetPreviewLabelPolicy | GetPreviewLabelPolicy | read | ❌ |
| GetDefaultLabelPolicy | GetDefaultLabelPolicy | read | ❌ |
| AddCustomLabelPolicy | AddCustomLabelPolicy | write | ❌ |
| UpdateCustomLabelPolicy | UpdateCustomLabelPolicy | write | ❌ |
| ActivateCustomLabelPolicy | ActivateCustomLabelPolicy | write | ❌ |
| RemoveCustomLabelPolicyLogo | RemoveCustomLabelPolicyLogo | write | ❌ |
| RemoveCustomLabelPolicyLogoDark | RemoveCustomLabelPolicyLogoDark | write | ❌ |
| RemoveCustomLabelPolicyIcon | RemoveCustomLabelPolicyIcon | write | ❌ |
| RemoveCustomLabelPolicyIconDark | RemoveCustomLabelPolicyIconDark | write | ❌ |
| RemoveCustomLabelPolicyFont | RemoveCustomLabelPolicyFont | write | ❌ |
| ResetLabelPolicyToDefault | ResetLabelPolicyToDefault | write | ❌ |
| GetCustomInitMessageText | GetCustomInitMessageText | read | ❌ |
| GetDefaultInitMessageText | GetDefaultInitMessageText | read | ❌ |
| SetCustomInitMessageText | SetCustomInitMessageText | write | ❌ |
| ResetCustomInitMessageTextToDefault | ResetCustomInitMessageTextToDefault | write | ❌ |
| GetCustomPasswordResetMessageText | GetCustomPasswordResetMessageText | read | ❌ |
| GetDefaultPasswordResetMessageText | GetDefaultPasswordResetMessageText | read | ❌ |
| SetCustomPasswordResetMessageText | SetCustomPasswordResetMessageText | write | ❌ |
| ResetCustomPasswordResetMessageTextToDefault | ResetCustomPasswordResetMessageTextToDefault | write | ❌ |
| GetCustomVerifyEmailMessageText | GetCustomVerifyEmailMessageText | read | ❌ |
| GetDefaultVerifyEmailMessageText | GetDefaultVerifyEmailMessageText | read | ❌ |
| SetCustomVerifyEmailMessageText | SetCustomVerifyEmailMessageText | write | ❌ |
| ResetCustomVerifyEmailMessageTextToDefault | ResetCustomVerifyEmailMessageTextToDefault | write | ❌ |
| GetCustomVerifyPhoneMessageText | GetCustomVerifyPhoneMessageText | read | ❌ |
| GetDefaultVerifyPhoneMessageText | GetDefaultVerifyPhoneMessageText | read | ❌ |
| SetCustomVerifyPhoneMessageText | SetCustomVerifyPhoneMessageText | write | ❌ |
| ResetCustomVerifyPhoneMessageTextToDefault | ResetCustomVerifyPhoneMessageTextToDefault | write | ❌ |
| GetCustomVerifySMSOTPMessageText | GetCustomVerifySMSOTPMessageText | read | ❌ |
| GetDefaultVerifySMSOTPMessageText | GetDefaultVerifySMSOTPMessageText | read | ❌ |
| SetCustomVerifySMSOTPMessageText | SetCustomVerifySMSOTPMessageText | write | ❌ |
| ResetCustomVerifySMSOTPMessageTextToDefault | ResetCustomVerifySMSOTPMessageTextToDefault | write | ❌ |
| GetCustomVerifyEmailOTPMessageText | GetCustomVerifyEmailOTPMessageText | read | ❌ |
| GetDefaultVerifyEmailOTPMessageText | GetDefaultVerifyEmailOTPMessageText | read | ❌ |
| SetCustomVerifyEmailOTPMessageText | SetCustomVerifyEmailOTPMessageText | write | ❌ |
| ResetCustomVerifyEmailOTPMessageTextToDefault | ResetCustomVerifyEmailOTPMessageTextToDefault | write | ❌ |
| GetCustomDomainClaimedMessageText | GetCustomDomainClaimedMessageText | read | ❌ |
| GetDefaultDomainClaimedMessageText | GetDefaultDomainClaimedMessageText | read | ❌ |
| SetCustomDomainClaimedMessageCustomText | SetCustomDomainClaimedMessageText | write | ❌ |
| ResetCustomDomainClaimedMessageTextToDefault | ResetCustomDomainClaimedMessageTextToDefault | write | ❌ |
| GetCustomPasswordlessRegistrationMessageText | GetCustomPasswordlessRegistrationMessageText | read | ❌ |
| GetDefaultPasswordlessRegistrationMessageText | GetDefaultPasswordlessRegistrationMessageText | read | ❌ |
| SetCustomPasswordlessRegistrationMessageCustomText | SetCustomPasswordlessRegistrationMessageText | write | ❌ |
| ResetCustomPasswordlessRegistrationMessageTextToDefault | ResetCustomPasswordlessRegistrationMessageTextToDefault | write | ❌ |
| GetCustomPasswordChangeMessageText | GetCustomPasswordChangeMessageText | read | ❌ |
| GetDefaultPasswordChangeMessageText | GetDefaultPasswordChangeMessageText | read | ❌ |
| SetCustomPasswordChangeMessageCustomText | SetCustomPasswordChangeMessageText | write | ❌ |
| ResetCustomPasswordChangeMessageTextToDefault | ResetCustomPasswordChangeMessageTextToDefault | write | ❌ |
| GetCustomInviteUserMessageText | GetCustomInviteUserMessageText | read | ❌ |
| GetDefaultInviteUserMessageText | GetDefaultInviteUserMessageText | read | ❌ |
| SetCustomInviteUserMessageCustomText | SetCustomInviteUserMessageText | write | ❌ |
| ResetCustomInviteUserMessageTextToDefault | ResetCustomInviteUserMessageTextToDefault | write | ❌ |
| GetCustomLoginTexts | GetCustomLoginTexts | read | ❌ |
| GetDefaultLoginTexts | GetDefaultLoginTexts | read | ❌ |
| SetCustomLoginText | SetCustomLoginTexts | write | ❌ |
| ResetCustomLoginTextToDefault | ResetCustomLoginTextsToDefault | write | ❌ |
| GetOrgIDPByID | GetOrgIDPByID | read | ❌ |
| ListOrgIDPs | ListOrgIDPs | read | ❌ |
| AddOrgOIDCIDP | AddOrgOIDCIDP | write | ❌ |
| AddOrgJWTIDP | AddOrgJWTIDP | write | ❌ |
| DeactivateOrgIDP | DeactivateOrgIDP | write | ❌ |
| ReactivateOrgIDP | ReactivateOrgIDP | read | ❌ |
| RemoveOrgIDP | RemoveOrgIDP | write | ❌ |
| UpdateOrgIDP | UpdateOrgIDP | write | ❌ |
| UpdateOrgIDPOIDCConfig | UpdateOrgIDPOIDCConfig | write | ❌ |
| UpdateOrgIDPJWTConfig | UpdateOrgIDPJWTConfig | write | ❌ |
| ListProviders | ListProviders | read | ❌ |
| GetProviderByID | GetProviderByID | read | ❌ |
| AddGenericOAuthProvider | AddGenericOAuthProvider | write | ❌ |
| UpdateGenericOAuthProvider | UpdateGenericOAuthProvider | write | ❌ |
| AddGenericOIDCProvider | AddGenericOIDCProvider | write | ❌ |
| UpdateGenericOIDCProvider | UpdateGenericOIDCProvider | write | ❌ |
| MigrateGenericOIDCProvider | MigrateGenericOIDCProvider | read | ❌ |
| AddJWTProvider | AddJWTProvider | write | ❌ |
| UpdateJWTProvider | UpdateJWTProvider | write | ❌ |
| AddAzureADProvider | AddAzureADProvider | write | ❌ |
| UpdateAzureADProvider | UpdateAzureADProvider | write | ❌ |
| AddGitHubProvider | AddGitHubProvider | write | ❌ |
| UpdateGitHubProvider | UpdateGitHubProvider | write | ❌ |
| AddGitHubEnterpriseServerProvider | AddGitHubEnterpriseServerProvider | write | ❌ |
| UpdateGitHubEnterpriseServerProvider | UpdateGitHubEnterpriseServerProvider | write | ❌ |
| AddGitLabProvider | AddGitLabProvider | write | ❌ |
| UpdateGitLabProvider | UpdateGitLabProvider | write | ❌ |
| AddGitLabSelfHostedProvider | AddGitLabSelfHostedProvider | write | ❌ |
| UpdateGitLabSelfHostedProvider | UpdateGitLabSelfHostedProvider | write | ❌ |
| AddGoogleProvider | AddGoogleProvider | write | ❌ |
| UpdateGoogleProvider | UpdateGoogleProvider | write | ❌ |
| AddLDAPProvider | AddLDAPProvider | write | ❌ |
| UpdateLDAPProvider | UpdateLDAPProvider | write | ❌ |
| AddAppleProvider | AddAppleProvider | write | ❌ |
| UpdateAppleProvider | UpdateAppleProvider | write | ❌ |
| AddSAMLProvider | AddSAMLProvider | write | ❌ |
| UpdateSAMLProvider | UpdateSAMLProvider | write | ❌ |
| RegenerateSAMLProviderCertificate | RegenerateSAMLProviderCertificate | write | ❌ |
| AddZitadelProvider | AddZitadelProvider | write | ❌ |
| DeleteProvider | DeleteProvider | write | ❌ |
| ListActions | ListActions | read | ❌ |
| GetAction | GetAction | read | ❌ |
| CreateAction | CreateAction | write | ❌ |
| UpdateAction | UpdateAction | write | ❌ |
| DeactivateAction | DeactivateAction | write | ❌ |
| ReactivateAction | ReactivateAction | read | ❌ |
| DeleteAction | DeleteAction | write | ❌ |
| ListFlowTypes | ListFlowTypes | read | ❌ |
| ListFlowTriggerTypes | ListFlowTriggerTypes | read | ❌ |
| GetFlow | GetFlow | read | ❌ |
| ClearFlow | ClearFlow | read | ❌ |
| SetTriggerActions | SetTriggerActions | write | ❌ |

## auth.proto (1/53)

| Method | Input | Type | Status |
|---|---|---|---|
| Healthz | Healthz | read | ✅ |
| GetSupportedLanguages | GetSupportedLanguages | read | ❌ |
| GetMyUser | GetMyUser | read | ❌ |
| RemoveMyUser | RemoveMyUser | write | ❌ |
| ListMyUserChanges | ListMyUserChanges | read | ❌ |
| ListMyUserSessions | ListMyUserSessions | read | ❌ |
| ListMyMetadata | ListMyMetadata | read | ❌ |
| GetMyMetadata | GetMyMetadata | read | ❌ |
| ListMyRefreshTokens | ListMyRefreshTokens | read | ❌ |
| RevokeMyRefreshToken | RevokeMyRefreshToken | write | ❌ |
| RevokeAllMyRefreshTokens | RevokeAllMyRefreshTokens | write | ❌ |
| UpdateMyUserName | UpdateMyUserName | write | ❌ |
| GetMyPasswordComplexityPolicy | GetMyPasswordComplexityPolicy | read | ❌ |
| UpdateMyPassword | UpdateMyPassword | write | ❌ |
| GetMyProfile | GetMyProfile | read | ❌ |
| UpdateMyProfile | UpdateMyProfile | write | ❌ |
| GetMyEmail | GetMyEmail | read | ❌ |
| SetMyEmail | SetMyEmail | write | ❌ |
| VerifyMyEmail | VerifyMyEmail | read | ❌ |
| ResendMyEmailVerification | ResendMyEmailVerification | read | ❌ |
| GetMyPhone | GetMyPhone | read | ❌ |
| SetMyPhone | SetMyPhone | write | ❌ |
| VerifyMyPhone | VerifyMyPhone | read | ❌ |
| ResendMyPhoneVerification | ResendMyPhoneVerification | read | ❌ |
| RemoveMyPhone | RemoveMyPhone | write | ❌ |
| RemoveMyAvatar | RemoveMyAvatar | write | ❌ |
| ListMyLinkedIDPs | ListMyLinkedIDPs | read | ❌ |
| RemoveMyLinkedIDP | RemoveMyLinkedIDP | write | ❌ |
| ListMyAuthFactors | ListMyAuthFactors | read | ❌ |
| AddMyAuthFactorOTP | AddMyAuthFactorOTP | write | ❌ |
| VerifyMyAuthFactorOTP | VerifyMyAuthFactorOTP | read | ❌ |
| RemoveMyAuthFactorOTP | RemoveMyAuthFactorOTP | write | ❌ |
| AddMyAuthFactorOTPSMS | AddMyAuthFactorOTPSMS | write | ❌ |
| RemoveMyAuthFactorOTPSMS | RemoveMyAuthFactorOTPSMS | write | ❌ |
| AddMyAuthFactorOTPEmail | AddMyAuthFactorOTPEmail | write | ❌ |
| RemoveMyAuthFactorOTPEmail | RemoveMyAuthFactorOTPEmail | write | ❌ |
| AddMyAuthFactorU2F | AddMyAuthFactorU2F | write | ❌ |
| VerifyMyAuthFactorU2F | VerifyMyAuthFactorU2F | read | ❌ |
| RemoveMyAuthFactorU2F | RemoveMyAuthFactorU2F | write | ❌ |
| ListMyPasswordless | ListMyPasswordless | read | ❌ |
| AddMyPasswordless | AddMyPasswordless | write | ❌ |
| AddMyPasswordlessLink | AddMyPasswordlessLink | write | ❌ |
| SendMyPasswordlessLink | SendMyPasswordlessLink | read | ❌ |
| VerifyMyPasswordless | VerifyMyPasswordless | read | ❌ |
| RemoveMyPasswordless | RemoveMyPasswordless | write | ❌ |
| ListMyUserGrants | ListMyUserGrants | read | ❌ |
| ListMyProjectOrgs | ListMyProjectOrgs | read | ❌ |
| ListMyZitadelPermissions | ListMyZitadelPermissions | read | ❌ |
| ListMyProjectPermissions | ListMyProjectPermissions | read | ❌ |
| ListMyMemberships | ListMyMemberships | read | ❌ |
| GetMyLabelPolicy | GetMyLabelPolicy | read | ❌ |
| GetMyPrivacyPolicy | GetMyPrivacyPolicy | read | ❌ |
| GetMyLoginPolicy | GetMyLoginPolicy | read | ❌ |

## group (0/8)

| Method | Input | Type | Status |
|---|---|---|---|
| CreateGroup | CreateGroup | write | ❌ |
| GetGroup | GetGroup | read | ❌ |
| ListGroups | ListGroups | read | ❌ |
| UpdateGroup | UpdateGroup | write | ❌ |
| DeleteGroup | DeleteGroup | write | ❌ |
| AddUsersToGroup | AddUsersToGroup | write | ❌ |
| RemoveUsersFromGroup | RemoveUsersFromGroup | write | ❌ |
| ListGroupUsers | ListGroupUsers | read | ❌ |

---
**Summary:** 170/754 operations (23%)

Note: `api_query` provides unrestricted access to any gRPC endpoint not explicitly listed.

