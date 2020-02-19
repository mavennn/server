import PromiseFtp from "promise-ftp";
import fs from "fs";
import config from "../config/index";

const ftp = new PromiseFtp();

ftp.connect(config.ftp)
  .then((serverMessage) => {
    console.log(serverMessage);
    return ftp.get("smart_mirror_shk.txt");
  })
  .then((stream) => new Promise(((resolve, reject) => {
    stream.once("close", resolve);
    stream.once("error", reject);
    stream.pipe(fs.createWriteStream("foo.local-copy.txt"));
  })))
  .then(() => ftp.end());
