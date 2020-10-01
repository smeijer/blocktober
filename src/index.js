import * as api from './api';
import { LEVELS } from './constants';

if (process.env.NODE_ENV === 'development') {
  require('dotenv')({ path: './.env' });
}

const help = `
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
      $ blocktober smeijer/leaflet-geosearch
      
    Level
      users          ${LEVELS[0].description}
      contributors   ${LEVELS[1].description}
      collaborators  ${LEVELS[2].description}
      
      We use a partial matcher for the level detection. Meaning, instead of "collaborators" you can also write "coll".
       
    Duration
      Note that all temporary interaction limits have a standard "cool down" period of 24 hours. Create a cron-job if you need to have a longer time-out.
      
    Token
      Make sure to store a personal-access-token under GITHUB_TOKEN in your environment keys.
`;

const [repo, level] = process.argv.slice(2);

if (!repo || !process.env.GITHUB_TOKEN) {
  console.log(help);
  process.exit(1);
}

const { limit } = LEVELS.find((x) => x.limit.indexOf(level) > -1) || {};

if (level === 'clear') {
  api.clear(repo);
} else if (limit) {
  api.limit(repo, limit);
} else {
  api.list(repo);
}
