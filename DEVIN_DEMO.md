# Devin demo: Connect an MCP server and use it

**What it shows:** You install the free DeepWiki MCP in Devin. Devin uses it to ask how the date-fns v4 time zone API works, then uses the answer to fix a delivery date bug, and opens a PR with passing tests.

**Needs:** GitHub. DeepWiki is free and needs no account, key or sign-in.

More demos: [devin-advanced-demos](https://github.com/thequantexplorer/devin-advanced-demos)

## The problem

`npm test` fails. The delivery promise is worked out in UTC, so it is wrong in the warehouse's own time zone, and it ignores weekends and holidays. Monday 13:30 in Los Angeles should ship Mon, Nov 2. Friday 16:30 in Berlin should ship Mon, Nov 9.

```text
$ npm run eta
LAX  ordered 2026-11-02T21:30:00Z  transit 2d  ->  Ships Tue, Nov 3 · Arrives by Thu, Nov 5
BER  ordered 2026-11-06T15:30:00Z  transit 1d  ->  Ships Sat, Nov 7 · Arrives by Sun, Nov 8

$ npm test
# tests 21
# pass 5
# fail 16
```

## Set it up

1. Click **Use this template → Create a new repository**, choose your GitHub account as the owner, and keep the name `devin-demo-mcp`. The prompt below assumes that name. Use the template, not a fork: pull requests on a fork go to the original repo by default.
2. In Devin, open [**Settings → Connections → GitHub**](https://app.devin.ai/settings/connections/github) and make sure Devin can access the new repository.
3. Install the DeepWiki MCP. In Devin, click **Customize** in the left sidebar and stay on the **Plugins** tab. Leave **Install plugins for** set to **Myself**. Under **Marketplace**, click the **DeepWiki** card, then click **Install for me**. If Devin shows a security notice, confirm it. DeepWiki needs no key, so there is nothing to connect.
4. Open the [**MCPs**](https://app.devin.ai/customize?tab=mcps) tab on the same page and check that **deepwiki** is listed under **From plugins**. (The old **Settings → Connections → MCP servers** page now opens this tab.)
5. Optional: to see the failing tests yourself, open the **Actions** tab of your new repo, click **Tests**, then **Run workflow**.

## Prompt

Start a new Devin session at [app.devin.ai](https://app.devin.ai) and paste this. Replace `<you>` with your GitHub user.

```text
Clone https://github.com/<you>/devin-demo-mcp. The delivery promise on our checkout page is wrong, and `npm test` fails: `estimateDelivery` in src/eta.js works in UTC and ignores weekends and warehouse holidays. The rules are in the README.

This repo uses date-fns v4 with @date-fns/tz (see AGENTS.md). Before you write any code, use the DeepWiki MCP to ask about the date-fns/date-fns repo: how do v4 functions like addDays, getHours, isWeekend and format work in a given IANA time zone, and what does the `in` option with `tz()` from @date-fns/tz do? If the DeepWiki MCP is not available in this session, stop and tell me instead of guessing.

Then fix src/eta.js using what you learned. Do not change the tests and do not add dependencies. Make `npm test` pass and open a PR. In the PR description, quote the question you asked DeepWiki, sum up its answer in two or three lines, and show the `npm run eta` output before and after the fix.
```

## What to watch

- Devin calls the DeepWiki `ask_question` tool on `date-fns/date-fns` before it edits any code.
- The fix uses the `in: tz(...)` option or `TZDate` from what DeepWiki said, not hand-written UTC offsets.

## Done when

- The PR description quotes the DeepWiki question and sums up the answer.
- `npm test` passes (21 of 21) and the **Tests** check on the PR is green.
- The tests and `package.json` dependencies are unchanged.
