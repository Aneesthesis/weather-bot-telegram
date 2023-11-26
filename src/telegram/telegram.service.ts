// import { Injectable } from '@nestjs/common';
// const TelegramBot = require('node-telegram-bot-api');
// import axios from 'axios';
// import { UserService } from '../user/user.service';
// import { AdminService } from '../admin/admin.service';

// const WEATHER_API_KEY = '35e8595a20f9b9894bf0b928935d9b67';
// const TELEGRAM_TOKEN = '6622721403:AAE4DLyG_Y_RDW1ypsYfzRKbESmdcd97800';

// @Injectable()
// export class TelegramService {
//   private readonly bot: any;

//   constructor(
//     private readonly userService: UserService,
//     private readonly adminService: AdminService,
//   ) {
//     console.log(this.adminService.getAPIKeyBE());

//     this.bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });
//     this.bot.on('message', this.onMessageReceived);
//   }

//   onMessageReceived = async (msg: any) => {
//     const chatId = msg.chat.id;
//     const text = msg.text;

//     const existingUser = await this.userService.findUserById(
//       msg.from.id.toString(),
//     );

//     if (text === '/start') {
//       if (!existingUser) {
//         // If the user doesn't exist, create a new user
//         await this.userService.createUser(
//           msg.from.username,
//           msg.from.id.toString(),
//         );

//         console.log(`New user created: ${msg.from.username}`);
//       }

//       const greetingMessage = `Hello! Welcome to the Weather Bot. Type the name of a city to get its current weather.`;
//       this.bot.sendMessage(chatId, greetingMessage);
//     } else {
//       if (existingUser && existingUser.isBlocked) {
//         this.bot.sendMessage(chatId, 'Sorry, the Admin has blocked you');
//         return;
//       }
//       await this.handleWeatherQuery(chatId, text);
//     }
//   };

//   private async handleWeatherQuery(chatId: number, cityName: string) {
//     try {
//       const weatherResponse = await axios.get(
//         `http://api.weatherstack.com/current?access_key=${WEATHER_API_KEY}&query=${cityName}`,
//       );

//       const { current, location } = weatherResponse.data;
//       const weather = current.weather_descriptions[0];

//       const isDay = current.is_day;

//       let uv_index = current.uv_index;
//       let uv_category;

//       switch (true) {
//         case uv_index >= 3 && uv_index <= 5:
//           uv_category = 'moderate';
//           break;
//         case uv_index >= 6 && uv_index <= 7:
//           uv_category = 'high';
//           break;
//         case uv_index >= 8 && uv_index <= 10:
//           uv_category = 'very high';
//           break;
//         case uv_index > 11:
//           uv_category = 'extreme';
//           break;
//         default:
//           uv_category = 'safe';
//           break;
//       }

//       const uv_indicator =
//         uv_category === 'safe'
//           ? '🟢'
//           : uv_category === 'moderate'
//             ? '🟡'
//             : uv_category === 'high'
//               ? '🟠'
//               : uv_category === 'very high'
//                 ? '🔴'
//                 : uv_category === 'extreme'
//                   ? '🔵'
//                   : ' ';

//       const wind_emoji =
//         current.wind_speed >= 0 && current.wind_speed <= 19
//           ? '🎐'
//           : current.wind_speed >= 20 && current.wind_speed <= 29
//             ? '🍃'
//             : current.wind_speed > 29
//               ? '💨'
//               : ' ';

//       const responseMessage = ` ${
//         current.is_day === 'yes' ? '🏙️' : '🌃'
//       } City: ${location.name}, ${location.country}\n\n🌡️ Temperature: ${
//         current.temperature
//       }°C (Feels like ${current.feelslike}°C)\n\n❔Weather now: ${
//         (weather.toLowerCase().includes('clear') && isDay === 'yes' && '🌞') ||
//         (weather.toLowerCase().includes('clear') && isDay === 'no' && '🌛') ||
//         (weather.toLowerCase().includes('snow') && '❄️☃️') ||
//         (weather.toLowerCase().includes('rain possible') && '🌨️☂️') ||
//         (weather.toLowerCase().includes('thunder') && '⛈️') ||
//         (weather.toLowerCase().includes('cyclone') && '🌀') ||
//         (weather.toLowerCase().includes('rain') && '🌧️☔') ||
//         (weather.toLowerCase().includes('cloud') && '☁️') ||
//         (weather.toLowerCase().includes('overcast') && '😶‍🌫️🌂') ||
//         (weather.toLowerCase().includes('sunny') && '☀️') ||
//         (weather.toLowerCase().includes('smoke') && '🌫️') ||
//         (weather.toLowerCase().includes('haze') && '🌫️') ||
//         (weather.toLowerCase().includes('fog') && '🌫️') ||
//         'Unknown'
//       } ${weather}\n\n${wind_emoji} Wind: ${current.wind_speed} km/h from ${
//         current.wind_dir
//       }\n\n${uv_indicator} UV Index: ${current.uv_index} (${uv_category})`;

//       this.bot.sendMessage(chatId, responseMessage);
//     } catch (error) {
//       console.error('Error making weather API call:', error);
//       this.bot.sendMessage(chatId, 'Error fetching weather information.');
//     }
//   }
// }

import { Injectable } from '@nestjs/common';
const TelegramBot = require('node-telegram-bot-api');
import axios from 'axios';
import { UserService } from '../user/user.service';
import { AdminService } from '../admin/admin.service';

const WEATHER_API_KEY = '35e8595a20f9b9894bf0b928935d9b67';

@Injectable()
export class TelegramService {
  private bot: any;

  constructor(
    private readonly userService: UserService,
    private readonly adminService: AdminService,
  ) {
    this.initializeBot();
  }

  private async initializeBot() {
    try {
      const TELEGRAM_TOKEN = await this.adminService.getAPIKeyBE();

      this.bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });
      this.bot.on('message', this.onMessageReceived);
    } catch (error) {
      this.bot.on('polling_error', (err: Error) => {
        console.error('Polling error:', err);
        throw new Error('EFATAL');
      });

      console.error('Error initializing Telegram bot:', error);
      throw new Error('Error initializing Telegram bot');
    }
  }

  onMessageReceived = async (msg: any) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    const existingUser = await this.userService.findUserById(
      msg.from.id.toString(),
    );

    if (text === '/start') {
      if (!existingUser) {
        // If the user doesn't exist, create a new user
        await this.userService.createUser(
          msg.from.username,
          msg.from.id.toString(),
        );

        console.log(`New user created: ${msg.from.username}`);
      }

      const greetingMessage = `Hello! Welcome to the Weather Bot. Type the name of a city to get its current weather.`;
      this.bot.sendMessage(chatId, greetingMessage);
    } else {
      if (existingUser && existingUser.isBlocked) {
        this.bot.sendMessage(chatId, 'Sorry, the Admin has blocked you');
        return;
      }
      await this.handleWeatherQuery(chatId, text);
    }
  };

  private async handleWeatherQuery(chatId: number, cityName: string) {
    try {
      const weatherResponse = await axios.get(
        `http://api.weatherstack.com/current?access_key=${WEATHER_API_KEY}&query=${cityName}`,
      );
      const { current, location } = weatherResponse.data;
      const weather = current.weather_descriptions[0];
      const isDay = current.is_day;
      let uv_index = current.uv_index;
      let uv_category;
      switch (true) {
        case uv_index >= 3 && uv_index <= 5:
          uv_category = 'moderate';
          break;
        case uv_index >= 6 && uv_index <= 7:
          uv_category = 'high';
          break;
        case uv_index >= 8 && uv_index <= 10:
          uv_category = 'very high';
          break;
        case uv_index > 11:
          uv_category = 'extreme';
          break;
        default:
          uv_category = 'safe';
          break;
      }
      const uv_indicator =
        uv_category === 'safe'
          ? '🟢'
          : uv_category === 'moderate'
            ? '🟡'
            : uv_category === 'high'
              ? '🟠'
              : uv_category === 'very high'
                ? '🔴'
                : uv_category === 'extreme'
                  ? '🔵'
                  : ' ';
      const wind_emoji =
        current.wind_speed >= 0 && current.wind_speed <= 19
          ? '🎐'
          : current.wind_speed >= 20 && current.wind_speed <= 29
            ? '🍃'
            : current.wind_speed > 29
              ? '💨'
              : ' ';
      const responseMessage = ` ${
        current.is_day === 'yes' ? '🏙️' : '🌃'
      } City: ${location.name}, ${location.country}\n\n🌡️ Temperature: ${
        current.temperature
      }°C (Feels like ${current.feelslike}°C)\n\n❔Weather now: ${
        (weather.toLowerCase().includes('clear') && isDay === 'yes' && '🌞') ||
        (weather.toLowerCase().includes('clear') && isDay === 'no' && '🌛') ||
        (weather.toLowerCase().includes('snow') && '❄️☃️') ||
        (weather.toLowerCase().includes('rain possible') && '🌨️☂️') ||
        (weather.toLowerCase().includes('thunder') && '⛈️') ||
        (weather.toLowerCase().includes('cyclone') && '🌀') ||
        (weather.toLowerCase().includes('rain') && '🌧️☔') ||
        (weather.toLowerCase().includes('cloud') && '☁️') ||
        (weather.toLowerCase().includes('overcast') && '😶‍🌫️🌂') ||
        (weather.toLowerCase().includes('sunny') && '☀️') ||
        (weather.toLowerCase().includes('smoke') && '🌫️') ||
        (weather.toLowerCase().includes('haze') && '🌫️') ||
        (weather.toLowerCase().includes('fog') && '🌫️') ||
        'Unknown'
      } ${weather}\n\n${wind_emoji} Wind: ${current.wind_speed} km/h from ${
        current.wind_dir
      }\n\n${uv_indicator} UV Index: ${current.uv_index} (${uv_category})`;
      this.bot.sendMessage(chatId, responseMessage);
    } catch (error) {
      console.error('Error making weather API call:', error);
      this.bot.sendMessage(
        chatId,
        'Error fetching weather information. Check city name and Try again',
      );
    }
  }
}
