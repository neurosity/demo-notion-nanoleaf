const Nanoleaf = require("nanoleaves");
const { Notion } = require("@neurosity/notion");
const { config } = require("dotenv");
const { combineLatest } = require("rxjs");

config();

const notion = new Notion({
  deviceId: process.env.NEUROSITY_DEVICE_ID,
});

const nanoleaf = new Nanoleaf({
  host: process.env.HOST,
  token: process.env.ACCESS_TOKEN,
});

(async function main() {
  const info = await nanoleaf.info();
  console.log(info.panelLayout.layout.positionData);

  await notion.login({
    email: process.env.NEUROSITY_EMAIL,
    password: process.env.NEUROSITY_PASSWORD,
  });

  const panels = info.panelLayout.layout.positionData;
  panels.pop(); // remove 9th

  const status$ = notion.status();
  const calm$ = notion.calm();

  combineLatest(calm$, status$).subscribe(
    async ([calm, { sleepMode }]) => {
      const panelColors = sleepMode
        ? getSleepModeColors(panels)
        : getProgressBar(calm.probability, panels);

      console.log("calm", calm.probability, sleepMode);

      await nanoleaf
        .setStaticPanel(panelColors)
        .catch((error) => console.error(error.message));
    }
  );
})();

function getProgressBar(calmScore, panels) {
  const handicap = 0.25;
  return panels.map(({ panelId: id }, panelIndex) => ({
    id,
    r: calmScore * 10 + handicap < panelIndex ? 100 : 0,
    g: calmScore * 10 + handicap < panelIndex ? 100 : 0,
    b: calmScore * 10 + handicap >= panelIndex ? 100 : 100,
    transition: 3,
  }));
}

function getSleepModeColors(panels) {
  return panels.map(({ panelId: id }) => ({
    id,
    r: 50,
    g: 50,
    b: 50,
    transition: 1,
  }));
}
