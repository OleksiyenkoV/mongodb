import {MongoClient} from "mongodb";

const url = "mongodb://localhost:27017/test";
const mongoClient = new MongoClient(url, { useNewUrlParser: true });

import request from 'request';
import cheerio from 'cheerio';

const url2 = 'https://www.google.com.ua/search?q=bmw&sxsrf=ALeKk03sAo_MeIf2Sp45xUMjbxkTJgdXlA:1588100623885&source=lnms&tbm=isch&sa=X&ved=2ahUKEwieirfs54vpAhVjyaYKHeuyBZcQ_AUoAXoECCcQAw&biw=1920&bih=940';

const content = [];

mongoClient.connect((err, client) => { 
    const db = client.db("usersdb");
    const collection = db.collection("users");

    request(url2, (err, res, body) => {
      const $ = cheerio.load(body);
      $('img').each(function(i, elem) {

          let user = {src: $(this).attr('src')};
          content.push(user);

          for (var i = 0; i<content.length; i++) {     
            console.log(content[i]['src']);  

          };
      });

      collection.insertMany(content, (err, result) => { 
        console.log('Запис створений');

        if(err){ 
          return console.log(err);
        };
      });

      console.log('База закрита')
      client.close();

    });
});