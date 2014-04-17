# -*- coding: utf-8 -*-

# CAS Configuration.
module CasAuth
  OPTIONS = { host: 'www.dev.laclasse.com',
              ssl: true,
              port: 443,
              disable_ssl_verification: true,
              login_url: '/sso-mysql/login',
              service_validate_url: '/sso-mysql/serviceValidate',
              logout_url: '/sso-mysql/logout',
              logout_saml:'/saml/saml2/idp/SingleLogoutService.php'}
end
