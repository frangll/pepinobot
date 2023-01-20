import { Client, GatewayIntentBits, BitFieldResolvable, GatewayIntentsString, Events, Collection, Interaction } from "discord.js";
const { token } = require("./config/main.json");
import fs from "fs";
import path from "path";

const intents: BitFieldResolvable<GatewayIntentsString, number> = [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates
];

const client = new Client({ intents: intents });
//@ts-ignore
client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".ts"));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ("data" in command && "execute" in command) {
        //@ts-ignore
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[Warning]: Missing command file ${filePath}`);
    }
}

client.once("ready", (res) => {
    console.log(`Bot is ready at ${res.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
     if(!interaction.isChatInputCommand()) return;

     //@ts-ignore
     const command = interaction.client.commands.get(interaction.commandName);

     if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

     try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.login(token);
