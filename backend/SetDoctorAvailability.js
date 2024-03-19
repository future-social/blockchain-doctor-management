const { Wallets, Gateway } = require("fabric-network");
const fs = require("fs");
const path = require("path");
const cron = require("node-cron");

cron.schedule("0 0 * * 1", async () => {
  try {