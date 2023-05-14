#!/usr/bin/env node

/*
Copyright (c) Anthony Beaumont
This source code is licensed under the MIT License
found in the LICENSE file in the root directory of this source tree.
*/

import { parseArgs } from "node:util";
import { env } from "node:process";
import { checkin } from "../lib/kurukuru.js";

const { values : args } = parseArgs({
  options: {
    "game": {
      type: "string"
    },
    "ltoken": {
      type: "string"
    },
    "ltuid": {
      type: "string"
    },
    "mhyuuid": {
      type: "string"
    },
    "devicefp": {
      type: "string"
    },
    "devicefp_seed_id": {
      type: "string"
    },
    "devicefp_seed_time": {
      type: "string"
    }
  },
  strict: true
});

try{
  const token = {
    ltoken: args.ltoken || env["HOYOLAB_LTOKEN"],
    ltuid: args.ltuid || env["HOYOLAB_LTUID"],
    mhyuuid: args.mhyuuid || env["HOYOLAB_MHYUUID"],
    devicefp: args.devicefp || env["HOYOLAB_DEVICEFP"],
    devicefp_seed_id: args.devicefp_seed_id || env["HOYOLAB_DEVICEFP_SEED_ID"],
    devicefp_seed_time: args.devicefp_seed_time || env["HOYOLAB_DEVICEFP_SEED_TIME"]
  };
  console.log("Checking-in...");
  const reward = await checkin(args.game, token, { loot: true });
  if (reward) console.log(`Got: ${reward.cnt} x ${reward.name}`);
  console.log("✔️ done");
  process.exit(0);
}catch(err){
  console.error(err);
  process.exit(1);
}