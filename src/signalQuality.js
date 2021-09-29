const Nanoleaf = require("nanoleaves");
const { Notion } = require("@neurosity/notion");
const { config } = require("dotenv");

config();

const notion = new Notion({
  deviceId: process.env.NEUROSITY_DEVICE_ID,
});

const nanoleaf = new Nanoleaf({
  host: process.env.NANOLEAF_HOST,
  token: process.env.NANOLEAF_ACCESS_TOKEN,
});

(async function main() {
  const info = await nanoleaf.info();
  console.log(info.panelLayout.layout.positionData);

  await notion.login({
    email: process.env.NEUROSITY_EMAIL,
    password: process.env.NEUROSITY_PASSWORD,
  });

  const panels = info.panelLayout.layout.positionData;

  notion.signalQuality().subscribe(async (signalQuality) => {
    const panelColors = signalQualityToColors(signalQuality, panels);

    console.log(
      Object.values(signalQuality).map(({ status }) => status)
    );

    await nanoleaf
      .setStaticPanel(panelColors)
      .catch((error) => console.error(error.message));
  });
})();

function signalQualityToColors(signalQuality, panels) {
  return Object.values(signalQuality).map((signal, index) => {
    const id = panels[index].panelId;

    if (signal.status === "great") {
      return { id, r: 0, g: 100, b: 0, transition: 1 };
    }

    if (signal.status === "good") {
      return { id, r: 0, g: 50, b: 0, transition: 1 };
    }

    if (signal.status === "bad") {
      return { id, r: 100, g: 0, b: 0, transition: 1 };
    }

    if (signal.status === "noContact") {
      return { id, id, r: 0, g: 0, b: 0, transition: 1 };
    }
  });
}
