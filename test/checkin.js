import toast from "powertoast";
import { shouldArrayOfObjLike } from "@xan105/is/assert";
import { isObj, isStringNotEmpty } from "@xan105/is";
import { checkin } from "../lib/kurukuru.js";

const { default: config } = await import("./config.json", {
  assert: {
    type: "json"
  }
});
shouldArrayOfObjLike(config, {
  game:  isStringNotEmpty,
  lang: isStringNotEmpty,
  token: isObj
});

const games = {
  "starrail": "Honkai: Star Rail",
  "genshin": "Genshin Impact",
  "honkai": "Honkai Impact 3rd",
  "themis": "Tears of Themis"
};

for (const account of config){
  console.log(`Checking-in... (${games[account.game]})`);
  const reward = await checkin(account.game, account.token, { lang: account.lang, loot: true });
  if (reward) {
    toast({
      appid: "Microsoft.WindowsTerminal_8wekyb3d8bbwe!App",
      title: games[account.game],
      message: `${reward.cnt} x ${reward.name}`,
      icon: reward.icon
    }).catch((err) => { 
      console.error(err);
    });
  }
}
console.log("✔️ done");