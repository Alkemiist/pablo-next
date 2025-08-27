# AI Marketing Brief Generator

A Next.js application that generates comprehensive marketing briefs using OpenAI's API with structured JSON outputs and real-time streaming.

## Features

- **Structured AI Outputs**: Uses JSON Schema to ensure consistent, parseable responses
- **Real-time Streaming**: Server-Sent Events (SSE) for live AI generation feedback
- **Dual Input Methods**: Form-based interface and direct JSON input
- **Type Safety**: Full TypeScript support with interfaces matching the JSON schema
- **Professional Prompts**: CMO-level strategic thinking with execution-ready outputs

## Architecture

### Core Components

1. **`lib/brief-schema.ts`** - JSON Schema definition for structured outputs
2. **`lib/prompt.ts`** - System and user prompt engineering
3. **`lib/brief-types.ts`** - TypeScript interfaces for type safety
4. **`app/api/generate-brief/route.ts`** - API endpoint with streaming
5. **`app/brief-builder/page.tsx`** - User interface with form and JSON tabs

### Data Flow

```
User Input → Form/JSON → API Route → OpenAI API → Streaming Response → UI Display
```

## Setup

### 1. Environment Variables

Create a `.env.local` file in your project root:

```bash
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-2024-08-06  # Optional, defaults to this model
```

### 2. Dependencies

The system requires these packages (already included in your project):

```bash
npm install openai
```

### 3. API Key Setup

1. Get your OpenAI API key from [OpenAI Platform](https://platform.openai.com/)
2. Add it to your `.env.local` file
3. Ensure your account has access to the Responses API

## Usage

### Form-Based Input

1. Navigate to `/brief-builder`
2. Use the "Form Input" tab to fill out project details:
   - **Project**: Title, launch window, owner, business context
   - **Objective**: SMART goals, KPIs, targets, learning goals
   - **Audience**: Descriptors, pain points, emotions, desired actions
   - **Brand**: Role, positioning, competitors
   - **Message**: Single-minded proposition, reasons to believe
   - **Tone & Style**: Tone tags, mood, things to avoid
   - **Channels & Formats**: Platforms, content types, constraints
   - **Culture & Creative**: Trends, hashtags, references
   - **Budget & Legal**: Budget tier, must-include items

### JSON Input

1. Switch to the "JSON Input" tab
2. Paste or modify the example JSON structure
3. Use the "Sync Form with JSON" button to populate the form

### Generating Briefs

1. Fill out the required fields (marked with asterisks in the schema)
2. Click "Generate Marketing Brief"
3. Watch the real-time streaming response
4. The AI will generate a structured brief including:
   - Executive summary
   - Big idea
   - Creative territories with hooks
   - Customer journey map
   - Test plan with hypotheses
   - KPI dashboard

## Output Schema

The AI generates a comprehensive brief with this structure:

```typescript
interface MarketingBrief {
  project: ProjectDetails;
  objective: ObjectiveDetails;
  audience: AudienceDetails;
  insight: string;
  brand: BrandDetails;
  message: MessageDetails;
  tone_style: ToneStyleDetails;
  channels_formats: ChannelsFormatsDetails;
  culture_creative?: CultureCreativeDetails;
  budget_legal: BudgetLegalDetails;
  outputs: {
    exec_summary: string;
    big_idea: string;
    creative_territories: CreativeTerritory[];
    journey_map: JourneyStage[];
    test_plan?: TestHypothesis[];
    kpi_dashboard?: KPIRow[];
  };
}
```

## Customization

### Modifying the Schema

1. Update `lib/brief-schema.ts` to change the output structure
2. Update `lib/brief-types.ts` to match the new schema
3. Modify prompts in `lib/prompt.ts` to guide the AI accordingly

### Adjusting Prompts

The system uses two types of prompts:

- **System Prompt**: Defines the AI's role and output rules
- **User Prompt**: Transforms user input into structured instructions

Modify these in `lib/prompt.ts` to change the AI's behavior and output style.

### Adding New Fields

1. Add the field to the JSON schema
2. Update the TypeScript interfaces
3. Add form inputs in the UI
4. Update the prompt generation function

## Production Considerations

### Error Handling

- The API includes basic error handling for malformed requests
- Consider adding validation middleware for production use
- Implement rate limiting for the OpenAI API calls

### Performance

- Uses Edge Runtime for lower latency
- Streaming responses provide immediate feedback
- Consider caching generated briefs for repeated requests

### Security

- Validate all user inputs before sending to OpenAI
- Implement user authentication and authorization
- Monitor API usage and costs

### Monitoring

- Log API requests and responses
- Monitor OpenAI API usage and costs
- Track user engagement and brief quality

## Troubleshooting

### Common Issues

1. **"Invalid JSON" errors**: Check your JSON syntax in the JSON tab
2. **API errors**: Verify your OpenAI API key and account status
3. **Streaming issues**: Ensure your browser supports Server-Sent Events
4. **Type errors**: Check that all required fields are filled in the form

### Debug Mode

The system logs streaming responses to help debug issues. Check the browser console for detailed information about the AI generation process.

## Example Output

Here's what a generated brief looks like:

```json
{
  "project": {
    "title": "Q4 Launch: Instant Chef",
    "launch_window": "Oct–Nov 2025",
    "owner": "Growth Team",
    "business_context": "Entering crowded meal-kit category; need point of difference for busy families."
  },
  "outputs": {
    "exec_summary": "Launch a meal-kit service targeting busy urban parents with a focus on decision fatigue relief...",
    "big_idea": "The easiest dinner is the one you don't have to think about",
    "creative_territories": [
      {
        "name": "Decision Liberation",
        "description": "Position Instant Chef as the antidote to dinner decision fatigue",
        "example_hook": "What if dinner could decide itself?"
      }
    ],
    "journey_map": [
      {
        "stage": "Awareness",
        "message": "Introduce the concept of decision-free dinners",
        "asset": "6-second TikTok hook",
        "kpi": "View completion rate"
      }
    ]
  }
}
```

## Contributing

To extend this system:

1. Fork the repository
2. Create a feature branch
3. Implement your changes
4. Update tests and documentation
5. Submit a pull request

## License

This project is part of your Next.js practice workspace. Feel free to modify and use as needed for learning and development purposes.
