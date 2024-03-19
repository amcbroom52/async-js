"use strict";

const NUMBER_API_BASE_URL = 'http://numbersapi.com';

/** Given an integer, call the numbers api and log a fact about the number */
async function showNumberTrivia(num) {
  const resp = await fetch(`${NUMBER_API_BASE_URL}/${num}?json`);
  const trivia = await resp.json();

  console.log(trivia.text);
}

/** Given an array of integers, log a fact about one of them */
async function showNumberRace(nums) {

  const promiseArray = nums.map(num => fetch(`${NUMBER_API_BASE_URL}/${num}?json`));

  const resp = await Promise.race(promiseArray);
  const trivia = await resp.json();

  console.log(trivia.text);
}

/** Given an array of values, log an array of facts for all the valid
 * values, and log an array of all the invalid values with their status text
 */
async function showNumberAll(nums) {
  const promiseArray = nums.map(num => fetch(`${NUMBER_API_BASE_URL}/${num}?json`));

  const resps = await Promise.allSettled(promiseArray);

  const successfulResps = resps.filter(resp =>
    resp.status === "fulfilled" && resp.value.ok === true);
  const failedResps = resps.filter(resp =>
    resp.status === "rejected" || resp.value.ok === false);

  //TODO: use a better name, "promises" is not specific
  const promises = successfulResps.map(async resp => {
    const trivia = await resp.value.json();
    return trivia.text;
  });

  const errors = failedResps.map(resp => resp.value.statusText);

  const texts = await Promise.all(promises);

  console.log(texts);
  console.log(errors);
}

/** calls several functions in order */
async function main() {
  await showNumberTrivia(12);
  await showNumberRace([1, 5, 23, 15]);
  await showNumberAll([1, 15, "WRONG", 5]);
}