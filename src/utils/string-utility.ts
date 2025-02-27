export function createAlias(username: string) {
  const tempArr = username.split(" ");
  let result = "";
  result += (tempArr.at(0)?.charAt(0) ?? "") + (tempArr.at(1)?.charAt(0) ?? "");
  return result.toUpperCase();
}
