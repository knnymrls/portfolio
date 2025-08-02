# Figma MCP Setup Instructions

## Two Options for Figma MCP Integration:

### Option 1: Figma Dev Mode MCP Server (Currently Added)
- Already added to your config at `http://127.0.0.1:3845/sse`
- Requires Figma Desktop App running with Dev Mode
- To use: Open Figma Desktop → Enable Dev Mode → Select a frame/layer → Use Claude

### Option 2: Figma Developer MCP (API Key Based)
1. Get your Figma API token:
   - Go to https://www.figma.com/settings
   - Scroll to "Personal access tokens"
   - Generate a new token

2. Remove current server and add developer version:
   ```bash
   claude mcp remove figma-dev-mode-mcp-server
   claude mcp add figma-developer-mcp
   ```

3. When prompted, provide:
   - Command: `npx`
   - Args: `-y figma-developer-mcp --figma-api-key=YOUR-KEY --stdio`

### Option 3: Using Composio (Easier Authentication)
1. Visit https://mcp.composio.dev
2. Find Figma integration
3. Run the generated command in terminal
4. Follow authentication flow

## Testing the Connection
In Claude, try:
- `/mcp` to check server status
- Ask Claude to connect to Figma
- Provide a Figma frame URL or use current selection

## Troubleshooting
- Ensure Figma Desktop is running
- Check logs: `~/Library/Caches/claude-cli-nodejs/`
- For WSL users, add to `.wslconfig`:
  ```
  [wsl2]
  networkingMode = mirrored
  ```