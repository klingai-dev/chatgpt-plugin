import assert from 'node:assert/strict';
import { readFileSync, readdirSync, lstatSync, existsSync } from 'node:fs';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const plugin = join(root, 'plugins/kling-ai');
const read = (path) => JSON.parse(readFileSync(path, 'utf8'));
const marketplace = read(join(root, '.agents/plugins/marketplace.json'));
assert.equal(marketplace.name, 'kling-ai');
assert.equal(marketplace.plugins.length, 1);
assert.equal(resolve(root, marketplace.plugins[0].source.path), plugin);
const manifest = read(join(plugin, 'plugin.json'));
const compatibility = read(join(plugin, '.codex-plugin/plugin.json'));
const pkg = read(join(plugin, 'package.json'));
for (const item of [manifest, compatibility, pkg]) {
  assert.equal(item.name, 'kling-ai');
  assert.equal(item.version, manifest.version);
}
assert.equal(compatibility.mcpServers, './.mcp.json');
for (const name of ['mcp.json', '.mcp.json']) {
  const config = read(join(plugin, name));
  assert.deepEqual(Object.keys(config.mcpServers), ['kling-ai']);
  assert.equal(config.mcpServers['kling-ai'].url, 'https://kling.ai/mcp/plugin');
}
for (const metadata of [compatibility.interface, manifest.extensions['com.openai'].interface]) {
  assert.ok(metadata.shortDescription.length <= 30);
  for (const key of ['logo', 'logoDark', 'composerIcon', 'composerIconDark']) {
    assert.ok(existsSync(resolve(plugin, metadata[key])), `Missing ${key}`);
  }
}
let skills = 0;
function walk(directory) {
  for (const name of readdirSync(directory)) {
    const path = join(directory, name);
    assert.ok(!lstatSync(path).isSymbolicLink(), `Symlink: ${path}`);
    assert.ok(!['mcp-app', 'node_modules', '.env'].includes(name), `Excluded file: ${path}`);
    if (lstatSync(path).isDirectory()) { walk(path); continue; }
    if (name !== 'SKILL.md') continue;
    skills++;
    const text = readFileSync(path, 'utf8');
    assert.ok(text.startsWith('---\n'), `Missing frontmatter: ${path}`);
    assert.ok(/^name: kling-ai(?:-generate-(?:image|video))?$/m.test(text));
    assert.ok(/^description: .+/m.test(text));
    for (const match of text.matchAll(/\]\(([^)#]+)(?:#[^)]*)?\)/g)) {
      if (/^[a-z]+:/i.test(match[1])) continue;
      assert.ok(existsSync(resolve(dirname(path), match[1])), `Broken reference: ${match[1]}`);
    }
  }
}
walk(plugin);
assert.equal(skills, 3);
console.log('Validated marketplace, manifests, Global MCP endpoint, assets, and 3 Skills.');
