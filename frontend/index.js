import fs from "fs"
import "dotenv/config"
import { Client, Events, GatewayIntentBits, REST, Routes } from "discord.js"

const commandFolder = fs.readdirSync("./commands")
const commands = new Map()
const register = []
const rest = new REST().setToken(process.env.token)

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates]
})

client.once("ready", (info) => {
    console.log(`Logged in as: ${info.user.username}`)
})


/* 
    Reads the commands folder directory and gives you the file names
    and then goes through a loop to check if the file exists. Then storing it in a map.
*/

for (const data of commandFolder) {
    let commandPath = `./commands/${data}`
    let command = (await import(commandPath)).default
    if (command['data'] && command['init']){
        commands.set(command.data.name, command)
        register.push(command.data.toJSON())
    }
}

async function handle() {
    try {
        // Slightly modified code from: https://discordjs.guide/creating-your-bot/command-deployment.html#guild-commands
        console.log(`Started refreshing ${register.length} application (/) commands.`);

        const data = await rest.put(
            Routes.applicationGuildCommands(process.env.clientId, process.env.guildId),
            { body: register},
        );

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
}

handle()

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand) return;
    console.log(interaction)
    const command = await commands.get(interaction.commandName)

    if (!command) {
        console.error(`No command file was found for ${interaction.commandName}!`)
        return
    }

    try {
        await command.init(interaction)
    }
    catch(error) {
        console.error(error)
        if (interaction.replied || interaction.deferred) { // You can't reply twice to the same command so you need to use follow up!
            interaction.followUp("An error has occurred while running this command!")
        }
        else {
            interaction.reply("An error has occurred while running this command!")
        }
    }
})


client.login(process.env.token)