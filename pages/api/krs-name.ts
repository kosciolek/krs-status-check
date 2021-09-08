import { IncomingMessage } from "http";
import url from "url";

export default async function handler(req: IncomingMessage, res) {
  const { id } = url.parse(req.url, true).query;

  const fetchStatus = async (krsNum) =>
    fetch(
      `https://rar.ms.gov.pl/api/v1/entities?krsNumber=${id}&repoType=RAR`,
      {
        headers: {
          "content-type": "application/json; charset=utf-8",
        },
        mode: "no-cors",
      }
    ).then((resp) => resp.json());

  res.status(200).json(await fetchStatus(id));
}