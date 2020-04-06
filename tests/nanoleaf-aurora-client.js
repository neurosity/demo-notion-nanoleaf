// https://github.com/darrent/nanoleaf-aurora-api
const Nanoleaf = require("nanoleaf-aurora-client");
const { timer } = require("rxjs");
const { concatMap, tap } = require("rxjs/operators");
// ./node_modules/.bin/nanoleaves token

const nanoleaf = new Nanoleaf({
  host: "192.168.1.217",
  base: "/api/v1/",
  port: "16021",
  accessToken: "M5VoL4VgdZ2z5zGybqAgWgPZ6Vu1KCi0",
});

(async function main() {
  const info = await nanoleaf.getInfo();
  console.log(info);

  // await nanoleaf.identify();

  // await sleep(3000);

  //await sleep(1000);

  const hue = await nanoleaf.getHue();
  console.log("hue", hue);

  await nanoleaf
    .setHue(30)
    .then(function () {
      console.log("Success!");
    })
    .catch(function (err) {
      console.error(err);
    });

  // timer(0, 100)
  //   .pipe(
  //     tap((i) => {
  //       console.log("i", i);
  //       nanoleaf.setSaturation(i);
  //     })
  //   )
  //   .subscribe();
})();

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
