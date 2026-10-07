// Match the starter's supported engine before copying, installing or building.
export function checkNode(version = process.versions.node) {
  const [major, minor] = version.split('.').map(Number);
  if ((major === 22 && minor < 12) || major < 22) {
    throw new Error(`This starter requires Node 22.12+; current Node is ${version}. Select Node 22 or newer for this terminal, then retry.`);
  }
}
checkNode();
