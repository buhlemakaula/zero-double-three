# zero-double-three

## MCP: Image generation server

This repo ships a project-scoped MCP config (`.mcp.json`) for
[`mcp-image`](https://github.com/shinpr/mcp-image) — an AI image generation
server backed by Gemini. Claude Code picks it up automatically when you open
this repo and approve the project server.

### Setup

The config reads your credentials from environment variables, so no secrets
live in the repo. Export them in your shell profile:

```sh
export GEMINI_API_KEY=your-gemini-key
# optional — defaults to ./generated-images inside the repo
export IMAGE_OUTPUT_DIR=/absolute/path/to/images
```

### Alternative: user-scoped install

To make the server available across all your projects instead, run this on
your machine:

```sh
claude mcp add mcp-image --scope user \
  --env GEMINI_API_KEY=your-gemini-key \
  --env IMAGE_QUALITY=quality \
  --env IMAGE_OUTPUT_DIR=/absolute/path/to/images \
  -- npx -y mcp-image
```

### Configuration

| Variable | Value | Notes |
| --- | --- | --- |
| `GEMINI_API_KEY` | required | Get one at https://aistudio.google.com/apikey |
| `IMAGE_QUALITY` | `quality` | `quality` (higher fidelity) or `speed` |
| `IMAGE_OUTPUT_DIR` | `./generated-images` | Where generated images are written |
