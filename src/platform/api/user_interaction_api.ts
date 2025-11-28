```typescript
import { Router, Request, Response } from 'express';
// The InteractionService would contain the core business logic for processing these events.
// It is assumed to be defined in a separate service layer file.
import { InteractionService } from '../services/interaction_service';

const router = Router();

// --- Type Definitions for API Payloads ---

/**
 * Represents the payload for a user's narrative choice.
 */
interface UserChoicePayload {
    choiceId: string;
    optionSelected: string | number;
}

/**
 * Represents the payload for a user injecting a logical paradox into the simulation.
 */
interface ParadoxInjectionPayload {
    paradoxDescription: string;
    targetAI: string | 'all'; // The ID of the target AI, or 'all' to target every adversary.
    severity: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * Defines the structure of the request body for the interaction endpoint.
 */
interface InteractionRequestBody {
    userId: string;
    simulationId: string;
    interactionType: 'choice' | 'paradox';
    payload: UserChoicePayload | ParadoxInjectionPayload;
}

// --- Type Guard Validation Helpers ---

/**
 * Type guard to check if a payload conforms to the UserChoicePayload interface.
 * @param payload - The payload object to check.
 * @returns boolean - True if the payload is a valid UserChoicePayload.
 */
const isUserChoicePayload = (payload: any): payload is UserChoicePayload => {
    return (
        payload &&
        typeof payload.choiceId === 'string' &&
        payload.choiceId.trim() !== '' &&
        (typeof payload.optionSelected === 'string' || typeof payload.optionSelected === 'number')
    );
};

/**
 * Type guard to check if a payload conforms to the ParadoxInjectionPayload interface.
 * @param payload - The payload object to check.
 * @returns boolean - True if the payload is a valid ParadoxInjectionPayload.
 */
const isParadoxInjectionPayload = (payload: any): payload is ParadoxInjectionPayload => {
    const validSeverities = ['low', 'medium', 'high', 'critical'];
    return (
        payload &&
        typeof payload.paradoxDescription === 'string' &&
        payload.paradoxDescription.trim() !== '' &&
        typeof payload.targetAI === 'string' &&
        payload.targetAI.trim() !== '' &&
        typeof payload.severity === 'string' &&
        validSeverities.includes(payload.severity)
    );
};


// --- API Endpoint Definition ---

/**
 * @route   POST /api/interact
 * @desc    Captures and processes user interactions, such as narrative choices
 *          and paradox injections, within a specific simulation instance.
 * @access  Protected (Auth middleware should be applied before this router in the main app)
 */
router.post('/interact', async (req: Request, res: Response) => {
    const { userId, simulationId, interactionType, payload } = req.body as InteractionRequestBody;

    // --- Basic Validation ---
    if (!userId || !simulationId || !interactionType || !payload) {
        return res.status(400).json({
            success: false,
            message: 'Missing required fields: userId, simulationId, interactionType, payload.',
        });
    }

    try {
        let result;

        switch (interactionType) {
            case 'choice':
                if (!isUserChoicePayload(payload)) {
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid payload for interaction type "choice". Requires: choiceId (string), optionSelected (string|number).',
                    });
                }
                console.log(`[API] Processing choice for user ${userId} in simulation ${simulationId}`);
                result = await InteractionService.handleUserChoice(
                    simulationId,
                    userId,
                    payload
                );
                break;

            case 'paradox':
                if (!isParadoxInjectionPayload(payload)) {
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid payload for interaction type "paradox". Requires: paradoxDescription (string), targetAI (string), severity (low|medium|high|critical).',
                    });
                }
                console.log(`[API] Processing paradox injection from user ${userId} in simulation ${simulationId}`);
                result = await InteractionService.handleParadoxInjection(
                    simulationId,
                    userId,
                    payload as ParadoxInjectionPayload
                );
                break;

            default:
                return res.status(400).json({
                    success: false,
                    message: `Unknown interactionType: '${interactionType}'. Valid types are 'choice' or 'paradox'.`,
                });
        }

        // --- Success Response ---
        return res.status(200).json({
            success: true,
            message: `Interaction of type '${interactionType}' processed successfully.`,
            data: result, // This would be the new state or outcome from the service layer
        });

    } catch (error) {
        // --- Error Handling ---
        console.error(`[API Error] Failed to process interaction for simulation ${simulationId}:`, error);
        
        const errorMessage = error instanceof Error ? error.message : 'An unexpected server error occurred.';
        
        return res.status(500).json({
            success: false,
            message: `Server error while processing interaction: ${errorMessage}`,
        });
    }
});

export default router;
```