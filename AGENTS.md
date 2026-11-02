# Notes for coding agents

- Dates and time zones: use `date-fns` v4 and `@date-fns/tz`. Both are already installed.
- Do not add `date-fns-tz`, `moment`, `luxon` or `dayjs`, and do not add any other dependency.
- Do not do UTC offset math by hand, and do not depend on the server's own time zone (`TZ`). The tests run under more than one `TZ`.
- Do not change the tests to make them pass. The rules they check are in the README.
- Run `npm test` before you open a pull request.
