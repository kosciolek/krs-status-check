// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { IncomingMessage } from "http";
import url from "url";

export default async function handler(req: IncomingMessage, res) {
  const { id } = url.parse(req.url, true).query;

  const fetchStatus = async (krsNum) =>
    fetch(
      `https://rar.ms.gov.pl/api/v1/cases?pageNumber=1&resultsToReturn=20&context=KRS_SUBJECT&krsNumber=${krsNum}&repoType=RAR`,
      {
        headers: {
          "content-type": "application/json; charset=utf-8",
        },
        mode: "no-cors",
      }
    ).then((resp) => resp.json());

  res.status(200).json(await fetchStatus(id));
}
