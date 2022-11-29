import { HOST } from "../commons/env";
import { Configuration } from "../commons/types";

export async function getConfiguration(): Promise<void | Configuration> {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var requestOptions: RequestInit = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  return fetch(`${HOST}/api/config`, requestOptions)
    .then(response => response.text())
    .then(result => JSON.parse(result) as Configuration)
    .catch(error => console.log('error', error));
}

export function toggleSeasonalTagging(seasonalTagging: boolean) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    "seasonalTagging": seasonalTagging
  });

  var requestOptions: RequestInit = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch(`${HOST}/api/config`, requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}