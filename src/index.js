import meow from 'meow';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import * as api from './api';
import { LEVELS } from './constants';

const cli = meow(
  `
    Usage
      $ blocktober {org}/{repo} {level|clear}
 
    Options
      --clear     lift all restrictions
      
    Examples
      # apply limits to an entire org
      $ blocktober updrafts users     
      
      # apply limits to one repo 
      $ blocktober smeijer/graphql-args contributors
      
      # various options
      $ blocktober smeijer/blocktober contributors
      $ blocktober smeijer/unimported collaborators
      $ blocktober smeijer/blocktober clear
      $ blocktober smeijer/leaflet-geosearch --clear
      
    Level
      users          ${LEVELS[0].description}
      contributors   ${LEVELS[1].description}
      collaborators  ${LEVELS[2].description}
      
      We use a partial matcher for the level detection. Meaning, instead of "collaborators" you can also write "coll".
       
    Duration
      Note that all temporary interaction limits have a standard "cool down" period of 24 hours. Create a cron-job if you need to have a longer time-out.
      
    Token
      Make sure to store a personal-access-token under GITHUB_TOKEN in your environment keys.
`,
  {
    flags: {
      clear: { type: 'boolean' },
    },
  },
);

const {
  flags,
  input: [repo, level],
} = cli;

if (!repo || !process.env.GITHUB_TOKEN) {
  cli.showHelp(1);
}

const { limit } = LEVELS.find((x) => x.limit.indexOf(level) > -1) || {};

if (flags.clear || level === 'clear') {
  api.clear(repo);
} else if (limit) {
  api.limit(repo, limit);
} else {
  api.list(repo);
}
