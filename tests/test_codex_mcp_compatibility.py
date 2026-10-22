import json
from pathlib import Path
import unittest


PLUGIN = Path(__file__).resolve().parents[1] / "plugins" / "kling-ai"


def read_json(name):
    return json.loads((PLUGIN / name).read_text())


class CodexMcpCompatibilityTest(unittest.TestCase):
    def test_portable_server_uses_supported_transport_fields(self):
        servers = read_json("mcp.json")["mcpServers"]
        self.assertEqual(list(servers), ["kling-ai"])
        server = servers["kling-ai"]
        # The desktop transport parser rejects unknown fields, including
        # extensions.com.openai.auth, before registering the MCP server.
        self.assertFalse(set(server) - {"type", "url", "headers"})
        self.assertEqual(server["type"], "streamable-http")
        self.assertEqual(server["url"], "https://kling.ai/mcp/plugin")

    def test_native_entry_preserves_oauth_scopes(self):
        manifest = read_json(".codex-plugin/plugin.json")
        self.assertEqual(manifest["mcpServers"], "./.mcp.json")
        servers = read_json(".mcp.json")["mcpServers"]
        self.assertEqual(list(servers), ["kling-ai"])
        self.assertEqual(servers["kling-ai"]["url"], "https://kling.ai/mcp/plugin")
        self.assertEqual(servers["kling-ai"]["scopes"], [
            "generation.create", "generation.read", "account.credit.read"
        ])

    def test_no_qa_app_dependency(self):
        self.assertFalse((PLUGIN / ".app.json").exists())
        portable = read_json("plugin.json")["extensions"]["com.openai"]
        native = read_json(".codex-plugin/plugin.json")
        self.assertNotIn("apps", portable)
        self.assertNotIn("apps", native)

    def test_all_examples_and_svg_icons_remain_valid(self):
        portable = read_json("plugin.json")["extensions"]["com.openai"]["interface"]
        native = read_json(".codex-plugin/plugin.json")["interface"]
        self.assertEqual(portable["defaultPrompt"], native["defaultPrompt"])
        self.assertEqual(len(portable["defaultPrompt"]), 3)
        for prompt in portable["defaultPrompt"]:
            self.assertTrue(0 < len(" ".join(prompt.split())) <= 128)
        for interface in [portable, native]:
            for key in ["composerIcon", "composerIconDark", "logo", "logoDark"]:
                self.assertEqual(interface[key], "./assets/kling-logo.svg")
        self.assertTrue((PLUGIN / "assets/kling-logo.svg").is_file())


if __name__ == "__main__":
    unittest.main()
