import OpenAI from "@openai/openai";
import { blue, green, red, yellow } from "https://deno.land/std@0.220.1/fmt/colors.ts";
import { parseArgs } from "https://deno.land/std@0.220.1/cli/parse_args.ts";

const client = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: Deno.env.get('OPENROUTER_API_KEY'),
});

async function getOSInfo(): Promise<string> {
    const os = Deno.build.os;
    const osMap: Record<string, string> = {
        darwin: "macOS",
        linux: "Linux",
        windows: "Windows",
    };

    // Get Linux distribution info if on Linux
    let distroInfo = "";
    if (os === "linux") {
        try {
            const lsbRelease = await Deno.readTextFile("/etc/lsb-release");
            const distroMatch = lsbRelease.match(/DISTRIB_ID=([^\n]+)/);
            const versionMatch = lsbRelease.match(/DISTRIB_RELEASE=([^\n]+)/);
            if (distroMatch && versionMatch) {
                distroInfo = ` (${distroMatch[1]} ${versionMatch[1]})`;
            }
        } catch (error) {
            // Ignore error if file doesn't exist or can't be read
        }
    }

    return osMap[os] || os + distroInfo;
}

async function copyToClipboard(text: string): Promise<boolean> {
    const os = Deno.build.os;
    let command: string;
    let args: string[];

    if (os === "linux") {
        command = "xclip";
        args = ["-selection", "clipboard"];
    } else if (os === "darwin") {
        command = "pbcopy";
        args = [];
    } else if (os === "windows") {
        command = "clip";
        args = [];
    } else {
        console.error(red("Unsupported operating system for clipboard operations"));
        return false;
    }

    try {
        const process = new Deno.Command(command, {
            args,
            stdin: "piped",
            stdout: "piped",
            stderr: "piped",
        });

        const child = process.spawn();
        const writer = child.stdin.getWriter();
        await writer.write(new TextEncoder().encode(text));
        await writer.close();

        const { success } = await child.status;
        return success;
    } catch (error) {
        console.error(red("Failed to copy to clipboard:"), error);
        return false;
    }
}

async function main(): Promise<void> {
    // Parse command line arguments
    const flags = parseArgs(Deno.args, {
        string: ["query"],
        default: { query: "" },
    });

    const userQuery = flags.query || flags._.join(" ");

    if (!userQuery) {
        console.log(yellow("Please provide a command request as an argument."));
        console.log(blue("Example: ai 'find all PDF files'"));
        return;
    }

    const osInfo = await getOSInfo();

    const completion = await client.chat.completions.create({
        model: 'microsoft/phi-3-mini-128k-instruct',
        temperature: 0.0,
        messages: [
            {
                role: 'system',
                content: `You are a command line expert for ${osInfo}. Your task is to convert natural language requests into appropriate commands for ${osInfo}. 
Respond with ONLY the command, nothing else. Do not include explanations or additional text.`,
            },
            {
                role: 'user',
                content: userQuery
            }
        ],
    });

    const command = completion.choices[0].message.content;
    if (!command) {
        console.error(red("No command generated"));
        return;
    }

    // Clean up the command string
    const cleanCommand = command.replace(/`/g, '').trim();

    const success = await copyToClipboard(cleanCommand);

    if (success) {
        console.log(green(`Copied \`${cleanCommand}\``));
    } else {
        console.error(red("Failed to copy command to clipboard"));
    }
}

main();