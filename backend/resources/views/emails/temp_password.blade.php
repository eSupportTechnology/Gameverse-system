<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Temporary Password</title>
</head>
<body style="margin:0;padding:0;background-color:#06080F;font-family:Arial,Helvetica,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#06080F;padding:40px 20px;">
    <tr>
      <td align="center">

        <!-- Card -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0"
          style="max-width:560px;background-color:#0F111F;border-radius:16px;border:1px solid #1E1B33;overflow:hidden;">

          <!-- Top accent bar -->
          <tr>
            <td style="height:4px;background:linear-gradient(to right,#CF36E1,#33B2F7);font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- Header -->
          <tr>
            <td align="center" style="padding:36px 40px 20px;">
              <p style="margin:0;font-size:28px;font-weight:800;letter-spacing:3px;color:#CF36E1;text-transform:uppercase;">
                GAMEVERSE
              </p>
              <p style="margin:8px 0 0;font-size:13px;color:#5C5E7A;letter-spacing:1px;text-transform:uppercase;">
                Account Created
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="height:1px;background-color:#1E1B33;font-size:0;line-height:0;">&nbsp;</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body text -->
          <tr>
            <td align="center" style="padding:32px 40px 0;">
              <p style="margin:0;font-size:16px;color:#A0A3C0;line-height:1.7;">
                Hello, <strong style="color:#ffffff;">{{ $name }}</strong> 👋<br/>
                Your Gameverse account has been created successfully.<br/>
                Use the login details below to access your account.
              </p>
            </td>
          </tr>

          <!-- Login details box -->
          <tr>
            <td style="padding:24px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                style="background-color:#17192E;border-radius:12px;border:1px solid #2E2B4A;">

                <!-- Email row -->
                <tr>
                  <td style="padding:16px 20px;border-bottom:1px solid #2E2B4A;">
                    <p style="margin:0;font-size:11px;letter-spacing:2px;color:#5C5E7A;text-transform:uppercase;">Login Email</p>
                    <p style="margin:6px 0 0;font-size:15px;color:#ffffff;font-weight:600;">{{ $email }}</p>
                  </td>
                </tr>

                <!-- Password row -->
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0;font-size:11px;letter-spacing:2px;color:#5C5E7A;text-transform:uppercase;">Temporary Password</p>
                    <p style="margin:10px 0 0;font-family:'Courier New',Courier,monospace;font-size:24px;font-weight:800;letter-spacing:6px;color:#CF36E1;">
                      {{ $tempPassword }}
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- Warning -->
          <tr>
            <td style="padding:0 40px 28px;">
              <table cellpadding="0" cellspacing="0" border="0"
                style="background-color:#1A0E20;border-radius:8px;border:1px solid #3B1A42;width:100%;">
                <tr>
                  <td style="padding:14px 18px;">
                    <p style="margin:0;font-size:13px;color:#C084DC;line-height:1.6;">
                      &#9888;&nbsp; <strong>Security notice:</strong> You will be required to change this password immediately after your first login. Do not share it with anyone.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td align="center" style="padding:0 40px 36px;">
              <a href="{{ config('app.frontend_url') }}/admin/login"
                style="display:inline-block;background:linear-gradient(to right,#CF36E1,#33B2F7);color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;padding:13px 40px;border-radius:8px;letter-spacing:0.5px;">
                Login to Dashboard &rarr;
              </a>
            </td>
          </tr>

          <!-- Footer divider -->
          <tr>
            <td style="padding:0 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="height:1px;background-color:#1E1B33;font-size:0;line-height:0;">&nbsp;</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:24px 40px 36px;">
              <p style="margin:0;font-size:12px;color:#3A3C58;line-height:1.7;">
                &copy; {{ date('Y') }} Gameverse. All rights reserved.<br/>
                This is an automated message — please do not reply.
              </p>
            </td>
          </tr>

          <!-- Bottom accent bar -->
          <tr>
            <td style="height:4px;background:linear-gradient(to right,#33B2F7,#CF36E1);font-size:0;line-height:0;">&nbsp;</td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
