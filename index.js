require("dotenv").config();
const { Octokit } = require("@octokit/rest");
const wordwrap = require("wordwrap");
const { formatDistanceStrict } = require("date-fns");
const got = require('got');
const { parseStringPromise } = require('xml2js');
const get = require('lodash.get');

const {
  GIST_ID: gistId,
  GH_TOKEN: githubToken,
  GOODREADS_KEY: goodreadsKey,
  GOODREADS_USER_ID: goodreadsUserId,
} = process.env;

const octokit = new Octokit({
  auth: `token ${githubToken}`
});

async function main() {
  const wrap = wordwrap(58);

  try {
    const readShelf = await got(`https://www.goodreads.com/review/list/${goodreadsUserId}.xml?key=${goodreadsKey}&v=2&shelf=read&sort=date_read&per_page=1`);
    const readingShelf = await got(`https://www.goodreads.com/review/list/${goodreadsUserId}.xml?key=${goodreadsKey}&v=2&shelf=currently-reading&sort=date_read&per_page=1`);

    // Convert Goodreads data from XML to JSON
    const parsedReadShelf = await parseStringPromise(readShelf.body);
    const parsedReadingShelf = await parseStringPromise(readingShelf.body);

    // Parse out the information required from Goodreads
    const recentlyReadBook = get(parsedReadShelf, 'GoodreadsResponse.reviews[0].review[0].book[0]');
    const recentlyReadTitle = get(recentlyReadBook, 'title_without_series[0]');
    const recentlyReadAuthor = get(recentlyReadBook, 'authors[0].author[0].name[0]');

    const currentlyReadingBook = get(parsedReadingShelf, 'GoodreadsResponse.reviews[0].review[0].book[0]');
    const currentlyReadingTitle = get(currentlyReadingBook, 'title_without_series[0]');
    const currentlyReadingAuthor = get(currentlyReadingBook, 'authors[0].author[0].name[0]');

    // Create data for currently reading; remove subtitle if it exists
    const currentlyReading = currentlyReadingTitle && currentlyReadingAuthor
      ? `Currently reading: ${currentlyReadingTitle.split(':'[0])} by ${currentlyReadingAuthor}`
      : `I'm not reading anything at the moment.`

    // Create data for recently read; remove subtitle if it exists
    const recentlyRead = recentlyReadTitle && recentlyReadAuthor
      ? `Recently read: ${recentlyReadTitle.split(':')[0]} by ${recentlyReadAuthor}`
      : `I haven't read anything recently.`

    // Update your gist
    await updateGist([wrap(currentlyReading), wrap('-'.repeat(58)), wrap(recentlyRead)]);
  } catch (error) {
    console.error(`Unable to fetch Goodreads books\n${error}`)
  }
}

async function updateGist(readingStatus) {
  

  let gist;
  try {
    gist = await octokit.gists.get({ gist_id: gistId });
  } catch (error) {
    console.error(`Unable to get gist\n${error}`);
  }

  // Get original filename to update that same file
  const filename = Object.keys(gist.data.files)[0];

  // Only update if the content has changed
  if (gist.data.files[filename].content === readingStatus.join('\n')) {
    console.log(`Reading status hasn't changed; skipping update.`);
    return;
  }

  try {
    await octokit.gists.update({
      gist_id: gistId,
      files: {
        [filename]: {
          filename,
          content: readingStatus.join('\n'),
        }
      }
    });
  } catch (error) {
    console.error(`Unable to update gist\n${error}`);
  }
}

(async () => {
  await main();
})();