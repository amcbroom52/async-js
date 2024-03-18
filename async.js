"use strict";

const NUMBER_API_BASE_URL = 'http://numbersapi.com'

async function showNumberTrivia(num) {
  const resp = await fetch(`${NUMBER_API_BASE_URL}/${num}?json`);
  const trivia = await resp.json();

  console.log(trivia.text);
}

async function showNumberRace(nums) {
  const promise1 = fetch(`${NUMBER_API_BASE_URL}/${nums[0]}?json`);
  const promise2 = fetch(`${NUMBER_API_BASE_URL}/${nums[1]}?json`);
  const promise3 = fetch(`${NUMBER_API_BASE_URL}/${nums[2]}?json`);
  const promise4 = fetch(`${NUMBER_API_BASE_URL}/${nums[3]}?json`);

  const resp = await Promise.race([promise1, promise2, promise3, promise4]);
  const trivia = await resp.json();

  console.log(trivia.text);
}

async function showNumberAll(nums) {
  const promise1 = fetch(`${NUMBER_API_BASE_URL}/${nums[0]}?json`);
  const promise2 = fetch(`${NUMBER_API_BASE_URL}/${nums[1]}?json`);
  const promise3 = fetch(`${NUMBER_API_BASE_URL}/${nums[2]}?json`);
  const promise4 = fetch(`${NUMBER_API_BASE_URL}/${nums[3]}?json`);

  const resps = await Promise.allSettled([promise1, promise2, promise3, promise4]);

  successfulResps = resps.filter(resp => resp.status === "fulfilled" && resp.value.ok === true);
  failedResps = resps.filter(resp => resp.status === "rejected" || resp.value.ok === false);

  const promises = successfulResps.map(async resp => {
    const trivia = await resp.value.json();
    return trivia.text;
  });

  const errors = failedResps.map(resp => resp.value.statusText);

  const texts = await Promise.all(promises);

  console.log(texts);
  console.log(errors);
}