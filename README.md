# March Madness Scraper
## Background
March Madness happens every March.

I built a March Madness player model that automatically pulls player performance and merges it with a model of expected team outcomes to forecast how many points a given player would score throughout the tournament.

## Problem Statement
To run a player draft for March Madness, you would have to visit each qualifying team's ESPN page and manually export each player record.

This script scrapes the player data from all the teams that made the NCAA tournament. Simply provide the `id` for the stats page to the `pages` array to pull the respective data.

## Usage
Run `npm start`.
Use the generated Excel file with all the exported data.