// Staff login, step 1: checks the staff email + password and, only if they're right,
// emails a 6-digit login code. Step 2 happens in the app with supabase.auth.verifyOtp().
//
// Supabase Auth never sends emails itself (its send-email hook refuses them all), so this
// is the only way to get a login code.
//
// Secrets (npx supabase secrets set ...):
//   SMTP_USER, SMTP_PASS   the sending account, e.g. a Gmail address + its app password
//   SMTP_HOST, SMTP_PORT   optional, default smtp.gmail.com:465
import { createClient } from 'npm:@supabase/supabase-js@2';
import nodemailer from 'npm:nodemailer@6.10.1';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Always 200 with { sent } or { error } so the app can show the message
const reply = (body: { sent?: true; error?: string }) =>
  new Response(JSON.stringify(body), { headers: { ...cors, 'Content-Type': 'application/json' } });

const REFUSED: Record<string, string> = {
  invalid: 'Wrong email or password.',
  locked: 'Too many wrong tries. Please wait 15 minutes and try again.',
  wait: 'A code was just sent. Please wait a minute before asking for another.',
};

const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const emailHtml = (code: string) => `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; max-width: 420px; margin: 0 auto; padding: 24px; color: #111;">
  <h2 style="margin: 0 0 8px; font-size: 20px;">Staff login code</h2>
  <p style="margin: 0 0 20px; font-size: 15px; color: #555;">Enter this code on the Brand Yuva staff login page:</p>
  <p style="margin: 0 0 20px; padding: 16px; background: #f4f4f5; border-radius: 12px; text-align: center; font-family: Consolas, monospace; font-size: 32px; font-weight: 700; letter-spacing: 8px;">${code}</p>
  <p style="margin: 0; font-size: 13px; color: #777;">The code works for 10 minutes. If you didn't try to log in, someone knows your staff password: change it in Staff area → Settings. Nobody from the shop will ever ask you for this code.</p>
</div>`;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: cors });

  let email = '';
  let password = '';
  try {
    const body = await req.json();
    email = String(body?.email ?? '').trim().toLowerCase();
    password = String(body?.password ?? '');
  } catch {
    return reply({ error: REFUSED.invalid });
  }
  if (!email || !password || email.length > 254 || password.length > 200) return reply({ error: REFUSED.invalid });

  const smtpUser = Deno.env.get('SMTP_USER');
  const smtpPass = Deno.env.get('SMTP_PASS');
  if (!smtpUser || !smtpPass) {
    return reply({ error: 'Login emails are not set up yet. Ask the person who set up this website.' });
  }

  const { data: result, error } = await admin.rpc('request_staff_login', { p_email: email, p_password: password });
  if (error) {
    console.error('request_staff_login failed:', error);
    return reply({ error: 'Could not check the login. Please try again.' });
  }
  if (result !== 'ok') return reply({ error: REFUSED[result as string] ?? REFUSED.invalid });

  // Password is right: have Supabase Auth create a login code (this sends nothing by itself)
  const failed = async (message: string, err: unknown) => {
    console.error(message, err);
    // Let them try again straight away instead of waiting out the one-minute gap
    await admin.from('staff_members').update({ last_code_sent_at: null }).eq('email', email);
    return reply({ error: 'The login email could not be sent. Please try again.' });
  };

  const { data: link, error: linkError } = await admin.auth.admin.generateLink({ type: 'magiclink', email });
  const code = link?.properties?.email_otp;
  if (linkError || !code) return failed('generateLink failed:', linkError);

  const port = Number(Deno.env.get('SMTP_PORT') || 465);
  const transport = nodemailer.createTransport({
    host: Deno.env.get('SMTP_HOST') || 'smtp.gmail.com',
    port,
    secure: port === 465,
    auth: { user: smtpUser, pass: smtpPass },
  });

  try {
    await transport.sendMail({
      from: `"Brand Yuva" <${smtpUser}>`,
      to: email,
      subject: 'Your Brand Yuva staff login code',
      text: `Your Brand Yuva staff login code is ${code}. It works for 10 minutes.`,
      html: emailHtml(code),
    });
  } catch (err) {
    return failed('Sending the login email failed:', err);
  }

  return reply({ sent: true });
});
