## WebSocket Hosting Configuration (Important for Forks)

If you fork this repository and host the build under your own GitHub Pages URL or another domain, make sure to update the WebSocket host-selection logic in `client_deobfuscated.js`.

The function `q()` determines which host the game connects to. It contains special cases for supported hosting domains, including `iogame4.pages.dev` and `smiledemic.github.io`. If your fork uses a different hostname, the function may fall back to the page's own host and attempt to open a WebSocket connection to the static website instead of the actual game server. This can leave the game stuck on **"Reconnecting…"**.

### For forks and coding agents

- Add your fork's hosting hostname to the appropriate host-selection condition in `client_deobfuscated.js`.
- Ensure the returned WebSocket URL points to the intended, compatible game server—not the GitHub Pages hostname.
- Preserve the existing pathname and query-string behavior unless your server requires otherwise.
- Select `wss://` when connecting securely from an HTTPS-hosted page. The target server must support secure WebSocket connections.
- Test the connection in browser DevTools before assuming the issue is fixed.

**Using an AI coding agent?** Ask it to read this section before modifying the WebSocket configuration. If the original hosting configuration works, remember that your fork still needs its own hostname added to the server-selection logic. Do not blindly replace every `ws://` occurrence with `wss://`; verify both the hostname and the connection handshake.

This configuration only selects a destination. It does not provide or guarantee access to a compatible game server.
