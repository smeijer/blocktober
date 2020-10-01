import fetch from 'node-fetch';
import colors from 'colors';
import { remaining } from './time';
import { LEVELS } from './constants';

async function interactionLimits(method, repo, data) {
  const type = repo.indexOf('/') > -1 ? 'repos' : 'orgs';

  const response = await fetch(
    `https://api.github.com/${type}/${repo}/interaction-limits`,
    {
      method,

      headers: {
        accept: 'application/vnd.github.sombra-preview+json',
        authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },

      body: JSON.stringify(data),
    },
  );

  let result = await response.text();
  result =
    typeof result === 'string' && result.trim()[0] === '{'
      ? JSON.parse(result)
      : result;

  if (result.message) {
    console.log(colors.red(`Error: ${result.message}`));
    console.log(`
Note that the token needs to have:
  'repo'      permissions if you target a repo.
  'admin:org' permissions if you target an org`);
    process.exit(1);
  }

  return result;
}

function print({ limit, expires_at } = {}) {
  const lines = LEVELS.map((level) =>
    [
      colors.bold(level.title),
      level.description,
      level.limit === limit
        ? colors.green(
            `Enabled with ${remaining(expires_at).friendly} remaining.`,
          )
        : undefined,
    ]
      .filter(Boolean)
      .join('\n'),
  ).join('\n\n');

  console.log(lines);
}

export async function list(repo) {
  const res = await interactionLimits('GET', repo);
  print(res);
}

export async function limit(repo, limit) {
  // clear old timers, so that it can be used to renew early
  await interactionLimits('DELETE', repo);

  const res = await interactionLimits('PUT', repo, {
    limit,
  });

  print(res);
}

export async function clear(repo) {
  await interactionLimits('DELETE', repo);
  print();
}
