About
=====

Library to automate Hoyolab daily login rewards for:

- Honkai: Star Rail
- Genshin Impact
- Honkai Impact 3rd
- Tears of Themis
 
Example
======

```js
import { checkin } from "@xan105/hoyolab-rewards";

console.log("Checking-in...");
const reward = await checkin("starrail", token, { lang: "en-us" });
if (reward) console.log(`Got: ${reward.cnt} x ${reward.name}`); 
//"Got: 20 x Stellar Jade"
console.log("✔️ done");
```

Install
=======

```
npm install @xan105/hoyolab-rewards
```

API
===

⚠️ This module is only available as an ECMAScript module (ESM).

## Named export

### `checkin(name: string, token: object, option?: object): Promise<void | object>`

Check-in and get the daily reward for the specified game name using the given token for authentification.

**Games**

- `starrail` : Honkai: Star Rail
- `genshin` : Genshin Impact
- `honkai` : Honkai Impact 3rd
- `themis` : Tears of Themis

**Token**

Your session token represented as a plain object:

```ts
{
  ltoken: string,
  ltuid: string,
  mhyuuid: string,
  devicefp: string,
  devicefp_seed_id: string,
  devicefp_seed_time: string
}
```

To retrieve your session token. Go to the daily login page of the game you wish to automate:

- [Honkai: Star Rail](https://act.hoyolab.com/bbs/event/signin/hkrpg/index.html?act_id=e202303301540311)
- [Genshin Impact](https://act.hoyolab.com/ys/event/signin-sea-v3/index.html?act_id=e202102251931481)
- [Honkai Impact 3rd](https://act.hoyolab.com/bbs/event/signin-bh3/index.html?act_id=e202110291205111)
- [Tears of Themis](https://act.hoyolab.com/bbs/event/signin/nxx/index.html?act_id=e202202281857121)

Open the console in the dev tool of your browser (F12) and type `document.cookie`.
This will output something like:
```
ltoken=...; ltuid=...; G_ENABLED_IDPS=google; mi18nLang=en-us; DEVICEFP=...; DEVICEFP_SEED_ID=...; DEVICEFP_SEED_TIME=...; _MHYUUID=...
```

Use these key/pair values to create a plain object representing your session token.

**Options**

```ts
{
  lang?: string,
  loot?: boolean
}
```

- `lang`: string | "en-us"
  
  Language code. Try to keep it in sync with `mi18nlang`.

- `loot`: boolean | false

  Whether to return the reward output or not (eg: 20x Stellar Jade). This will require an additional network request.

**Return value**

  When the `loot` option is set to `true` returns the reward output:
  
  ```ts
  {
    icon: string, //icon url
    name: string //reward name
    cnt: string //reward count
  }
  ```

  💡 The output is affected by the lanugage code used.

  ❌ This promise will reject on error.

CLI
===

There is a crude CLI tool provided as an implementation example in the _package.json_ `bin` field.

`hoyolab-checkin --game starrail`

Token information can be either provided by environment variable or by arguments:

`hoyolab-checkin --game starrail --ltoken=... --ltuid=... [...]`

environment variables are prefixed with `HOYOLAB_` and are all uppercase.

```
set HOYOLAB_LTOKEN=...
set HOYOLAB_LTUID=...
...
hoyolab-checkin --game starrail
```

GitHub action
=============

Check out `.github/workflows/hoyolab-daily-reward.yml` found in this repo for an example of a github action running the above CLI on a daily schedule.