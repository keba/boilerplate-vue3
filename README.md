# boilerplate-vue3
Vue 3 with Vuetify 3, Pinia, AJV, Axios. Playwright for tests. Wrapped in Vite.

CircleCI tests: [![CircleCI](https://dl.circleci.com/status-badge/img/gh/keba/boilerplate-vue3/tree/development.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/keba/boilerplate-vue3/tree/development)

This project is a cut-down version of a website I have created, so a lot of the major functionality is alluded to in comments, or just not there as
part of being cut to give this boilerplate.

The main intent of having this published is to show how a Vue3 project can be configured, and also provide an example on how you can test using 
Playwright.

You may not like some of the approaches. I don't use typescript, I use ESM. I use AJV to validate rules on allowed formats for strings where 
appropriate. The eslint rules are something I like, and lots of people may have issues with. It's easy enough to just not use eslint when you are
looking at the code.

## Common npm commands
Usually, I use `npm run dev-checked` and a browser pointed at http://localhost:5173 to see the app while I'm working on it.

To test, I use `npm run tests-start-with-build` (or `npm run tests-start` if there have been no website changes since the last test run).

If I can't spend the time updating the node modules (major or breaking version change) then I switch to using `npm run dev`

There are a bunch of other commands that can be used, and they should be self-explanatory.

For production/hotfix/staging builds, they are based on the branch name, and CircleCI will automatically deploy accordingly. This is all based on 
using AWS for S3 and Cloudfront. CircleCI expects that you will create an appropriate aws-access `context` that will have the access key, region etc
in it.