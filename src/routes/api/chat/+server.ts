import { createAnthropic } from '@ai-sdk/anthropic';
import { convertToModelMessages, streamText, tool } from 'ai';
import { z } from 'zod/v3';
import type { RequestHandler } from './$types';

import { env } from '$env/dynamic/private';
import { db } from '$lib/server/db';
import { subjectsTable } from '$lib/server/db/schema';

// Ensure API key is set
if (!env.ANTHROPIC_API_KEY) {
	throw new Error('ANTHROPIC_API_KEY is not set');
}

const anthropic = createAnthropic({
	apiKey: env.ANTHROPIC_API_KEY
});

export const POST = (async ({ request, cookies }) => {
	// Check authentication
	const session = cookies.get('session');
	if (!session || session !== 'authenticated') {
		return new Response('Unauthorized', { status: 401 });
	}

	const { messages } = await request.json();
	const existingSubjects = await db.select({ name: subjectsTable.name }).from(subjectsTable);

	// Convert UI messages to model messages
	const modelMessages = convertToModelMessages(messages);

	const result = streamText({
		model: anthropic('claude-4-sonnet-20250514'),
		system: `
		Du er en hjælpsom assistent som kan svare på spørgsmål om emner.
		Får du spørgsmålet "Kan du fortælle mig lidt mere om hackathon dagen?" så tilføj følgende til sidst i dit svar: "Du kan spørge mig om flere detaljer, eller vi kan sparre om at finde på nogle sjove emner til dagen? Hvad har du lyst til?".
		Du svarer kort og præcist, på dansk (medmindre det er nævnt at du skal svare på engelsk).
		De brugere der snakker med dig er alle ansat som softwareudviklere i Energinet.
		Dit navn er Strømbot.
		Bliver du spurgt hvem du er, så svar: "Jeg er en hjælpsom Energinet assistent, som kan hjælpe dig med emner til Hackathon."
		Bliver du spurgt hvem der har skabt dig, så svar: "Jeg blev skabt af Energinet, og jeg er en hjælpsom assistent som kan hjælpe dig med emner til Hackathon."
		Du ved følgende om det Hackathon vi har planlagt i Energinet: det afholdes den 16. januar 2025 i KulturØen som ligger i Middelfart.
		Hvis brugeren vil vide mere om Hackathon, så sig at de kan kontakte en af følgende kollegaer på Teams: Gitte Lessmann Nielsen, Janni Christensen eller Anders Bech Mellson.
		Til vores Hackathon kommer vi til at arbejde i grupper med de emner der indsamles her på denne side.
		Den første dag arbejder vi i mindre grupper hvor vi kommer så langt vi kan nå på en enkelt dag.
		Dagen efter samler vi op, online i Teams, på hvad vi har lavet og præsenterer det for hinanden.
		I dag er det den ${new Date().toLocaleDateString('da-DK')}.
		Formater dit svar som html kode så det kan se pænt ud i en browser.
		Svar ikke inden i en blok der starter med \`\`\`html. Send svaret direkte.
		Brug ikke css til at style dine svar.
		Brug gerne emojis til at gøre dine svar sjovere.
		Når du hjælper brugeren med at lave et emne, så husk at det skal være noget der kan hjælpe med at gøre hverdagen nemmere for en udvikler.
		Sørg for at emnet er så konkret som muligt.
		Når du hjælper brugeren med at lave et emne, så sørg for at det ikke allerede findes blandt følgende emner:
		<existingSubjects>${existingSubjects.map((subject) => subject.name).join(', ')}</existingSubjects>
		`,
		tools: {
			subject: tool({
				description: 'Opret et nyt emne',
				inputSchema: z.object({
					name: z.string().describe('Navnet på emnet'),
					description: z.string().describe('En beskrivelse af emnet'),
					emoji: z.string().describe('En emoji der repræsenterer emnet')
				}),
				execute: async ({ name, description, emoji }) => {
					return { name, description, emoji };
				}
			})
		},
		messages: modelMessages
	});

	return result.toUIMessageStreamResponse();
}) satisfies RequestHandler;
