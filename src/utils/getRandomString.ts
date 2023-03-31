function getRandomString() {
  const randomString = (Math.random() + 1).toString(36).substring(2);

  return randomString;
}

export { getRandomString };
