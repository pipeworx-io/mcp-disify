# mcp-disify

MCP server for detecting disposable email addresses via [Disify API](https://www.disify.com). No authentication required.

## Tools

| Tool | Description |
|------|-------------|
| `validate_email` | Check whether an email address is disposable or invalid |
| `check_domain` | Check whether a domain is associated with disposable email services |

## Quickstart via Pipeworx Gateway

Call any tool through the hosted gateway with zero setup:

```bash
curl -X POST https://gateway.pipeworx.io/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "disify_validate_email",
      "arguments": { "email": "test@mailinator.com" }
    }
  }'
```

## License

MIT
