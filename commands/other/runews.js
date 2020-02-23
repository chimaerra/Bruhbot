const { MessageEmbed } = require('discord.js');
const { newsAPI } = require('../../config.json');
const { Command } = require('discord.js-commando');
const fetch = require('node-fetch');

module.exports = class YnetNewsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'runews',
      aliases: ['rusnews'],
      group: 'other',
      memberName: 'runews',
      description: 'Отправляет 5 последних новостей из России',
      throttling: {
        usages: 2,
        duration: 10
      }
    });
  }

  async run(message) {
    // powered by NewsAPI.org
    try {
      const response = await fetch(
        `https://newsapi.org/v2/top-headlines?sources=google-news-ru&pageSize=5&apiKey=${newsAPI}`
      );
      const json = await response.json();
      let articleArr = json.articles;
      let processArticle = article => {
        let embed = new MessageEmbed()
          .setColor('#BA160C')
          .setTitle(article.title)
          .setURL(article.url)
          .setAuthor(article.author)
          .setDescription(article.description)
          .setThumbnail(article.urlToImage)
          .setTimestamp(article.publishedAt)
          .setFooter('by NewsAPI.org');
        return embed;
      };
      async function processArray(array) {
        for (let article of array) {
          let msg = await processArticle(article);
          message.say(msg);
        }
      }
      await processArray(articleArr);
    } catch (err) {
      message.say('Что-то пошло не так :(');
      return console.error(err);
    }
  }
};