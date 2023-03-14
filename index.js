const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');
const ExcelJS = require('exceljs');

const workbook = new ExcelJS.Workbook();
const worksheet = workbook.addWorksheet('Player Stats');

const pages = [248, 333, 251, 2509, 2305, 2250, 12, 26, 41, 269, 
  239, 156, 150, 2633, 96, 84, 245, 2628, 21, 66, 2, 2752, 235, 
  2306, 2608, 8, 258, 127, 2294, 356, 120, 277, 2390, 328, 2507, 
  213, 344, 68, 30, 2226, 2181, 77, 142, 152, 2670, 9, 232, 221, 
  2309, 2440, 198, 231, 314, 309, 261, 2253, 2142, 147, 2540, 163, 
  338, 94, 2427, 357, 2546, 47, 2640, 161];

async function scrape() {
  for await (const page of pages) {
    axios.get(`https://www.espn.com/mens-college-basketball/team/stats/_/id/${page}`)
      .then(response => {
        const $ = cheerio.load(response.data);

        const team_name = $('h1.headline.headline__h1.dib').text();
        const left_table = $('table:eq(0)');
        const right_table = $('table:eq(1)');
        const left_rows = left_table.find('tr').slice(1, -1);
        const right_rows = right_table.find('tr').slice(1, -1);

        const stats = [];
        left_rows.each((index, row) => {
          const left_cols = $(row).find('td');
          const right_cols = $(right_rows[index]).find('td');
          const player_name = left_cols.eq(0).find('a').text();
          const games_played = parseFloat(right_cols.eq(0).text());
          const minutes_played = parseFloat(right_cols.eq(1).text());
          const points_per_game = parseFloat(right_cols.eq(2).text());
          const rebounds_per_game = parseFloat(right_cols.eq(3).text());
          const assists_per_game = parseFloat(right_cols.eq(4).text());
          const steals_per_game = parseFloat(right_cols.eq(5).text());
          const blocks_per_game = parseFloat(right_cols.eq(6).text());
          const field_goal_percentage = parseFloat(right_cols.eq(8).text());
          const three_point_percentage = parseFloat(right_cols.eq(10).text());
          const free_throw_percentage = parseFloat(right_cols.eq(9).text());
          stats.push({
            'Team Name': team_name,
            'Player Name': player_name,
            'Games Played': games_played,
            'Minutes Played': minutes_played,
            'Points per Game': points_per_game,
            'Rebounds per Game': rebounds_per_game,
            'Assists per Game': assists_per_game,
            'Steals per Game': steals_per_game,
            'Blocks per Game': blocks_per_game,
            'Field Goal Percentage': field_goal_percentage + '%',
            'Three-Point Percentage': three_point_percentage + '%',
            'Free Throw Percentage': free_throw_percentage + '%'
          });
        });

        // Add header row
        const headers = Object.keys(stats[0]);
        worksheet.addRow(headers);

        // Add data rows
        stats.forEach(stat => {
          const row = Object.values(stat);
          worksheet.addRow(row);
        });

        // Write to file
        workbook.xlsx.writeFile(`player_stats.xlsx`)
          .catch(error => console.log(error));
      });
  }
}

scrape();