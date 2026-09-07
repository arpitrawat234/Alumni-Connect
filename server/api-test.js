// api-test.js – runs the full authentication boundary checks for Phase 3
// Node 18+ provides global fetch, no extra deps needed.

const base = 'http://localhost:5000/api';

async function login() {
  const res = await fetch(`${base}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'student@alumniconnect.com', password: 'Password123!' }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error('Login failed: ' + JSON.stringify(data));
  console.log('✅ Login succeeded');
  return data.accessToken;
}

async function getAuthMe(token) {
  const res = await fetch(`${base}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  console.log('\nGET /auth/me with JWT =>', res.status);
  console.log(JSON.stringify(data, null, 2));
}

async function getAuthMeNoJwt() {
  const res = await fetch(`${base}/auth/me`);
  const txt = await res.text();
  console.log('\nGET /auth/me without JWT =>', res.status);
  console.log(txt);
}

async function getProfileMe(token) {
  const res = await fetch(`${base}/profiles/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  console.log('\nGET /profiles/me with JWT =>', res.status);
  console.log(JSON.stringify(data, null, 2));
  return data.profile;
}

async function updateProfileMe(token, patch) {
  const res = await fetch(`${base}/profiles/me`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  });
  const data = await res.json();
  console.log('\nPUT /profiles/me =>', res.status);
  console.log(JSON.stringify(data, null, 2));
}

async function getAlumni() {
  const res = await fetch(`${base}/alumni`);
  const data = await res.json();
  console.log('\nGET /alumni =>', res.status);
  console.log('Count:', data.length);
  console.log('Sample:', data.slice(0, 2));
}

(async () => {
  try {
    const token = await login();
    await getAuthMe(token);
    await getAuthMeNoJwt();
    await getProfileMe(token);
    // Update a tiny field – e.g., add a new skill to student profile
    await updateProfileMe(token, { skills: ['React', 'Node.js', 'TypeScript'] });
    await getProfileMe(token);
    await getAlumni();
  } catch (e) {
    console.error('❌ Test failed', e);
  }
})();
