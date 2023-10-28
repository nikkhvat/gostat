function createNewToken(session) {
  return generateJWT(session, 30 * 20 * 1000);
}

function getUtmParams(urlString) {
  const url = new URL(urlString);
  const params = url.searchParams;

  const utmTags = {
    utm_source: params.get("utm_source") || null,
    utm_medium: params.get("utm_medium") || null,
    utm_campaign: params.get("utm_campaign") || null,
    utm_term: params.get("utm_term") || null,
    utm_content: params.get("utm_content") || null
  };

  for (let key in utmTags) {
    if (utmTags[key] === null) {
      delete utmTags[key];
    }
  }

  return utmTags;
}

function getScriptParam(scriptName, paramName) {
  const scripts = document.querySelectorAll('script');

  for (let i = 0; i < scripts.length; i++) {
    if (scripts[i].src.indexOf(scriptName) > -1) {
      const url = new URL(scripts[i].src);
      return url.searchParams.get(paramName);
    }
  }
  return null;
}

const HOST = "https://gostat.app"
// const HOST = "http://localhost:8080"
const APP_ID = getScriptParam('stat.js', 'app');

function utf8ToBase64(str) {
  return window.btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
    return String.fromCharCode('0x' + p1);
  }));
}

function base64ToUtf8(base64) {
  return decodeURIComponent(window.atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
}


function base64UrlEncode(str) {
  let base64 = utf8ToBase64(str);
  return base64.replace('+', '-').replace('/', '_').replace(/=+$/, '');
}

function generateJWT(id, expirationTime) {
  const header = {
    alg: "none",
    typ: "JWT"
  };

  const payload = {
    id: id,
    exp: Date.now() + expirationTime
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));

  return encodedHeader + "." + encodedPayload;
}

function getTokenData(token) {
  const payloadEncoded = token.split('.')[1];
  const payloadStr = base64ToUtf8(payloadEncoded);
  const payload = JSON.parse(payloadStr);

  return {
    isExpired: Date.now() > payload.exp,
    id: payload.id
  };
}


function isTokenExpired(token) {
  const payloadEncoded = token.split('.')[1];
  const payloadStr = base64ToUtf8(payloadEncoded);
  const payload = JSON.parse(payloadStr);

  return Date.now() > payload.exp;
}

let lastActivityTime = Date.now();
let liveInterval;
let inactivityTimeout;

document.addEventListener("mousemove", resetTimer);
document.addEventListener("mousedown", resetTimer);
document.addEventListener("keydown", resetTimer);
document.addEventListener("scroll", resetTimer);
document.addEventListener("touchstart", resetTimer);

function resetTimer() {
  lastActivityTime = Date.now();
  if (inactivityTimeout) {
    clearTimeout(inactivityTimeout);
  }
  if (!liveInterval) {
    startLiveInterval();
  }
  checkForInactivity();
}

function checkForInactivity() {
  inactivityTimeout = setTimeout(() => {
    if (Date.now() - lastActivityTime >= 10000) {
      stopLiveInterval();
    }
  }, 10000);
}

async function getSession(expired) {
  const utm = getUtmParams(window.location.href);

  try {
    const response = await fetch(`${HOST}/api/stats/visit/${APP_ID}`, {
      method: 'POST',
      redirect: 'follow',
      body: JSON.stringify({
        pathname: window.location.pathname,
        host: window.location.host,
        hash: window.location.hash,
        title: document.title,
        expired: expired,
        resolution: `${window.screen.availWidth}/${window.screen.availHeight}`,
        utm: utm
      })
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const body = await response.json();

    if (body.successfully) {
      return body.session;
    } else {
      throw new Error('Response body indicates failure');
    }
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error.message);
  }
}


async function extendSession(session) {
  const data = await fetch(`${HOST}/api/stats/visit/${session}`, {method: 'PATCH', redirect: 'follow'
  });
  const body = await data.json()

  if (body.successfully) {
    return true
  }
  return false
}

function startLiveInterval() {
  liveInterval = setInterval(async () => {
    if (Date.now() - lastActivityTime < 10000) {
      if (!localStorage.gs_token) {
        const data = await getSession(false)
        const newToken = createNewToken(data);
        localStorage.gs_token = newToken
      }

      const token = localStorage.gs_token;
      const tokenData = getTokenData(token);

      if (tokenData.isExpired) {
        const data = await getSession(true)
        const generatedToken = createNewToken(data);
        localStorage.gs_token = generatedToken;
      } else {
        const extended = await extendSession(tokenData.id);
        if (extended) {
          const refreshedToken = createNewToken(tokenData.id);
          localStorage.gs_token = refreshedToken;
        }
      }
    }
  }, 5000);
}

function stopLiveInterval() {
  clearInterval(liveInterval);
  liveInterval = null;
}

startLiveInterval();
