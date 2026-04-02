/**
 * Disify MCP — wraps Disify API (free, no auth)
 *
 * Tools:
 * - validate_email: Check whether an email address is disposable or invalid
 * - check_domain: Check whether a domain is associated with disposable email services
 */

interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
}

const BASE_URL = 'https://www.disify.com/api';

type RawEmailResponse = {
  format: boolean;
  dns: boolean;
  disposable: boolean;
  alias: boolean;
  whitelisted: boolean;
};

type RawDomainResponse = {
  dns: boolean;
  disposable: boolean;
  whitelisted: boolean;
};

const tools: McpToolExport['tools'] = [
  {
    name: 'validate_email',
    description:
      'Validate an email address to check if it is properly formatted, has valid DNS, is disposable, or is an alias.',
    inputSchema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          description: 'The email address to validate.',
        },
      },
      required: ['email'],
    },
  },
  {
    name: 'check_domain',
    description:
      'Check whether a domain is associated with disposable or temporary email services.',
    inputSchema: {
      type: 'object',
      properties: {
        domain: {
          type: 'string',
          description: 'The domain name to check, e.g. "mailinator.com".',
        },
      },
      required: ['domain'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'validate_email':
      return validateEmail(args.email as string);
    case 'check_domain':
      return checkDomain(args.domain as string);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function validateEmail(email: string) {
  const res = await fetch(`${BASE_URL}/email/${encodeURIComponent(email)}`);
  if (!res.ok) throw new Error(`Disify API error: ${res.status}`);
  const data = (await res.json()) as RawEmailResponse;
  return {
    email,
    format_valid: data.format,
    dns_valid: data.dns,
    disposable: data.disposable,
    alias: data.alias,
    whitelisted: data.whitelisted,
  };
}

async function checkDomain(domain: string) {
  const res = await fetch(`${BASE_URL}/domain/${encodeURIComponent(domain)}`);
  if (!res.ok) throw new Error(`Disify API error: ${res.status}`);
  const data = (await res.json()) as RawDomainResponse;
  return {
    domain,
    dns_valid: data.dns,
    disposable: data.disposable,
    whitelisted: data.whitelisted,
  };
}

export default { tools, callTool } satisfies McpToolExport;
