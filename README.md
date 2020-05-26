<p align="center">
  <img width="400" src="https://user-images.githubusercontent.com/16005567/82953423-9ba1c080-9f5f-11ea-86c4-691a46b3176e.png">
  <h3 align="center">book-box</h3>
  <p align="center">📚Update a pinned gist to contain your latest reads on Goodreads</p>
</p>

---

📌✨ For more pinned-gist projects like this one, check out: https://github.com/matchai/awesome-pinned-gists

## Setup

### Prep work

1. [Create a new public GitHub Gist](https://gist.github.com/)
2. [Create a token with the `gist` scope and copy it.](https://github.com/settings/tokens/new)
3. [Create a Goodreads account](https://www.goodreads.com/user/sign_up)
4. [Create an API for the Goodreads API](https://www.goodreads.com/api/keys)

### Project setup

1. Fork this repo
2. Go to the repo **Settings > Secrets**
3. Add the following environment variables:
  - **GIST_ID:** The ID of the gist you created above (`https://gist.github.com/amorriscode/`**`3f84910b524db4819ec2dc1063f632ab`**).
  - **GH_TOKEN:** The GitHub token generated above.
  - **GOODREADS_KEY:** The API key for your Goodreads account.
  - **GOODREADS_USER_ID:** The user ID for your Goodreads account (`https://www.goodreads.com/user/show/`**`5171404`**`-anthony`).

## Inspiration

This gist was inspired by [matchai's](https://github.com/matchai) [bird-box](https://github.com/matchai/bird-box).