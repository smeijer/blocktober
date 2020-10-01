export const LEVELS = [
  {
    limit: 'existing_users',
    title: 'Limit to existing users',
    description:
      'Users that have recently created their account will be unable to interact with the repository.',
  },
  {
    limit: 'contributors_only',
    title: 'Limit to prior contributors',
    description:
      'Users that have not previously committed to the repository’s master branch will be unable to interact with the repository.',
  },
  {
    limit: 'collaborators_only',
    title: 'Limit to repository collaborators',
    description:
      'Only users who have been granted write access, or are collaborators, will be able to interact with the repository.',
  },
];
