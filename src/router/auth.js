export function isTokenValid() {
    const authData = JSON.parse(localStorage.getItem('authentication'));
      if (!authData) {
    return false;
  }
  const currentTime = new Date().getTime();
  return currentTime < authData.expirationTime;
}