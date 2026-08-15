/**
 * Release notes shown in the updates modal, newest first.
 *
 * Kept as data rather than JSX so adding a release is a single entry at the top
 * of this array instead of another hand-written Accordion.Item.
 */
export interface ReleaseNote {
  /** Accordion value and key - must be unique */
  version: string
  /** Accordion heading, e.g. "RetroTrack v7.3.1 Released" */
  title: string
  /** Line above the bullet list */
  intro?: string
  items: string[]
  /** Free-text paragraphs rendered after the list */
  notes?: string[]
  /** An optional "Plans for vX" list */
  upcomingLabel?: string
  upcoming?: string[]
}

/** The newest release - used as the accordion's default-open item */
export const LATEST_VERSION = 'v7.3.1'

export const releaseNotes: ReleaseNote[] = [
  {
    version: 'v7.3.1',
    title: 'RetroTrack v7.3.1 Released',
    intro: 'Here are the changes in this release:',
    items: [
      'Softcore is now called Casual across the whole site, so the wording matches everywhere',
      'Fixed the achievement totals in the navigation showing the wrong figure and label',
      'Award colours are now consistent between game tables, playlists and profiles',
      'Further code cleanup - profile and playlist pages split into smaller components'
    ]
  },
  {
    version: 'v7.3',
    title: 'RetroTrack v7.3 Released',
    intro: 'Here are some of the new features:',
    items: [
      'Subset support - Games with achievement subsets now display them in an accordion format on game pages and modals',
      'Median Time to Beat and Median Time to Master statistics - Now visible on game pages, modals, and in game tables',
      'Major code refactoring - Game components have been reorganized into smaller, more maintainable pieces'
    ]
  },
  {
    version: 'v7.2.1',
    title: 'RetroTrack v7.2.1 Released',
    intro: 'Here are some of the improvements:',
    items: [
      'Improved visibility of unlocked achievements - they now have a distinct background colour and appear first in the list'
    ]
  },
  {
    version: 'v7.2',
    title: 'RetroTrack v7.2 Released',
    intro: 'Here are some of the new features:',
    items: [
      'Added stat cards to game pages',
      'Fixes to the search page and other minor improvements'
    ]
  },
  {
    version: 'v7.1',
    title: 'RetroTrack v7.1 Released',
    intro: 'Here are some of the new features:',
    items: [
      'Search page! You can now search for specific games and achievements by keyword. This will look in both the achievement name and description'
    ]
  },
  {
    version: 'v7',
    title: 'RetroTrack v7.0 Released',
    intro: 'Here are some of the new features:',
    items: [
      'Game playlists! Create your own playlists of games for easy tracking of games you want to play. You can also make them public too to share with everybody!',
      'Some more UI design tweaks',
      'The ability to click a game genre to automatically filter by it',
      'Total points in the navigation stats',
      'Various code improvements'
    ]
  },
  {
    version: 'v6.1',
    title: 'RetroTrack v6.1 Released',
    intro: 'Here are some of the new features:',
    items: [
      'Tables now have x amount per page options',
      'Tables now display better on mobile & smaller screens',
      'Various minor bug fixes from v6.0  release'
    ]
  },
  {
    version: 'v6.0',
    title: 'RetroTrack v6.0 Released',
    intro: 'Here are some of the new features:',
    items: [
      'Dedicated game pages! You now have the choice between the game modal and a dedicated game page which includes more information',
      'Ability to add notes to games. Easily keep track of information',
      'Various UI design updates',
      'Various code improvements'
    ]
  },
  {
    version: 'v5.2',
    title: 'RetroTrack v5.2 Released',
    intro: 'Here are some of the new features:',
    items: [
      'Logged in users have the ability to customise the order of the beaten and mastery wall'
    ]
  },
  {
    version: 'v5.1',
    title: 'RetroTrack v5.1 Released',
    intro: 'Here are some of the new features:',
    items: [
      'Mobile layout fixes',
      'Logged out user profiles'
    ],
    notes: [
      'You can now access the user profile of any registered user on RetroAchievements. You can access their profile by going to https://retroachievements.org/profile/<username> where <username> is the username of the user you want to view. All logged out users data is cached for 30 minutes so there will be a slight delay in seeing the latest data.'
    ],
    upcomingLabel: 'Plans for v5.2',
    upcoming: [
      'Customise the order of the beaten and mastery wall'
    ]
  },
  {
    version: 'v5',
    title: 'RetroTrack v5.0 Released',
    intro: 'Here are some of the new features:',
    items: [
      'Bug fixes and improvements',
      'User Profiles!'
    ],
    notes: [
      'You can now access your user profile by clicking the profile button in the navigation. You can share your profile link to show off your RetroAchievements progress to anyone!',
      'It currently only supports users registered to RetroTrack.'
    ],
    upcomingLabel: 'Plans for v5.1',
    upcoming: [
      'Support profile page for logged-out users'
    ]
  },
  {
    version: 'v4',
    title: 'RetroTrack v4.0 Released',
    intro: 'Here are some of the new features:',
    items: [
      'New user interface with a fresh design',
      'Bug fixes and performance improvements'
    ],
    notes: [
      'Thank you for using RetroTrack!',
      'If you are having issues with the new version, please try clearing your browser cache and cookies.'
    ]
  }
]
