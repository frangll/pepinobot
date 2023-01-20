# Pepino bot

## Installation
To install the modules for the bot just copy the files in a directory and then run the following command

```
npm install
```

## Configuration
Create a *config* folder in the root of the project and inside create a *main.json* file and fill it with the following configuration

```
{
    "token": "your bot token",
    "version": "0.0.1",
    "clientId": "your discord bot client id"
}
```

## Deploying commands
After you've created your command file and placed it inside the *commands* folder make sure to run the following command to register the new command you just created.

```
npm run commands
```

## Starting the bot
To start the bot just type the following command

```
npm start
```

## Found a bug?
Open an issue on this repository, thanks.
