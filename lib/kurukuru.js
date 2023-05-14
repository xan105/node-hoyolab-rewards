/*
Copyright (c) Anthony Beaumont
This source code is licensed under the MIT License
found in the LICENSE file in the root directory of this source tree.
*/

import { setTimeout } from "node:timers/promises";
import { getJSON, postJSON } from "@xan105/request";
import { Failure } from "@xan105/error";
import { shouldObj, shouldObjLike } from "@xan105/is/assert";
import { asBoolean, asStringNotEmpty } from "@xan105/is/opt";
import {
  isBoolean,
  isStringNotEmpty,
  isIntegerPositive,
  isIntegerPositiveOrZero,
  isArrayOfObjLike
} from "@xan105/is";
import games from "./games.json" assert { type: "json" };

async function checkin(name, token, option = {}){

  if (!(Object.keys(games)).includes(name))
    throw new Failure("Unsupported game", {
      code: 1, 
      info: {
        name,
        supported: Object.keys(games)
      }
    });
 
  shouldObjLike(token, {
    ltoken: isStringNotEmpty,
    ltuid: isStringNotEmpty,
    mhyuuid: isStringNotEmpty,
    devicefp: isStringNotEmpty,
    devicefp_seed_id: isStringNotEmpty,
    devicefp_seed_time: isStringNotEmpty
  }, 
  new Failure("Expected a token as an object", {
    code: 1, 
    info: {
      value: token,
      expected: {
        ltoken: "string",
        ltuid: "string",
        mhyuuid: "string",
        devicefp: "string",
        devicefp_seed_id: "string",
        devicefp_seed_time: "string"
      }
    }
  }));

  shouldObj(option);
  const options = {
    lang: asStringNotEmpty(option.lang) ?? "en-us",
    loot: asBoolean(option.loot) ?? false
  };

  const game = games[name];
  const headers = {
    "Referer": "https://act.hoyolab.com/",
    "Cookie": `ltoken=${token.ltoken}; ` +
              `ltuid=${token.ltuid}; ` +
              "G_ENABLED_IDPS=google; " +
              `mi18nLang=${options.lang.toLowerCase()}; ` +
              `_MHYUUID=${token.mhyuuid}; ` +
              `DEVICEFP=${token.devicefp}; ` +
              `DEVICEFP_SEED_ID=${token.devicefp_seed_id}; ` +
              `DEVICEFP_SEED_TIME=${token.devicefp_seed_time};`
  };
  const url = (path) => `${game.base_url}/${path}?lang=${options.lang}&act_id=${game.act_id}`;
  
  const info = await getJSON(url("info"), { maxRetry: 1, headers });
  if(info.retcode !== 0) throw new Failure(info.message);
  
  const { data } = info;
  shouldObjLike(data, {
    total_sign_day: isIntegerPositiveOrZero,
    is_sign: isBoolean
  });

  //Already checked in today
  if (data.is_sign === true) return;
  
  //not a robot
  const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
  const delay = random(3, 9) * 1000;
  await setTimeout(delay);

  const response = await postJSON(url("sign"), {
    "act_id": game.act_id
  }, { maxRetry: 1, headers });

  if (!(
    response.retcode === 0 || 
    response.retcode === -5003) //Already checked in
  ) throw new Failure(response.message);
  
  if(options.loot){
    try{
      const request = await getJSON(url("home"));
      if(request.retcode !== 0) throw new Failure(request.message);
      
      shouldObjLike(request.data, {
        awards: [isArrayOfObjLike, [{
          icon: isStringNotEmpty,
          name: isStringNotEmpty,
          cnt: isIntegerPositive
        }]]
      });
      
      const { awards } = request.data;
      const reward = awards.at(data.total_sign_day);
      return reward;
      
    }catch(err){
      console.warn(err);
    }
  }
}

export { checkin };