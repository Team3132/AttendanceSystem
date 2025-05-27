export const strToRegex = (str: string) => {
  const match = str.match(/^\/(.*)\/([gimuy]*)$/);
  if (!match) {
    return new RegExp(str);
  }
  return new RegExp(match[1], match[2]);
};
