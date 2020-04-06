import { NanoleafClient } from "nanoleaf-client";
import Neurosity from "@neurosity/notion";
import dotenv from "dotenv";

const { Notion } = Neurosity;

dotenv.config();

const notion = new Notion({
  deviceId: process.env.NEUROSITY_DEVICE_ID,
});

(async function main() {
  const nanoleaves = new NanoleafClient(
    process.env.HOST,
    process.env.ACCESS_TOKEN
  );

  await notion.login({
    email: process.env.NEUROSITY_EMAIL,
    password: process.env.NEUROSITY_PASSWORD,
  });

  const info = await nanoleaves.getInfo().catch(console.error);

  console.log("info", info);
  console.log("positionData", info.panelLayout.layout.positionData);

  console.log(nanoleaves._client);

  const body = {
    write: {
      command: "display",
      version: "1.0",
      animType: "static",
      animData: "1",
      loop: false,
      panels: {
        [info.panelLayout.layout.positionData[2].panelId]: {
          r: 55,
          g: 55,
          b: 55,
          w: 0,
          transition: 50,
        },
      },
    },
  };

  console.log("body", body);

  const res = await nanoleaves._client.putRequest(
    "effects",
    JSON.stringify(body)
  );

  // const res = await nanoleaves.setEffect("Nemo");

  console.log("res", res);

  // await nanoleaves.setSaturation(0);
  // const response = await nanoleaves.setHue(signalQualityToHue.bad);
  // console.log("response", response);

  // notion.signalQuality().subscribe((signalQuality) => {
  //   console.log(signalQuality);
  // });
})().catch(console.error);

function signalQualityToNanoleavesColor() {
  return {
    noContact: (nanoleaves) => nanoleaves.setSaturation(0),
    ok: (nanoleaves) =>
      Promise.all([
        nanoleaves.setSaturation(100),
        nanoleaves.setHue(50),
      ]),
    great: (nanoleaves) =>
      Promise.all([
        nanoleaves.setSaturation(100),
        nanoleaves.setHue(100),
      ]),
    bad: (nanoleaves) =>
      Promise.all([
        nanoleaves.setSaturation(100),
        nanoleaves.setHue(0),
      ]),
  };
}
