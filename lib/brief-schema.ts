export const BriefJsonSchema = {
  name: "marketing_brief",
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      project: {
        type: "object",
        additionalProperties: false,
        properties: {
          title: { type: "string" },
          launch_window: { type: "string" },
          owner: { type: "string" },
          business_context: { type: "string" }
        },
        required: ["title", "launch_window", "business_context"]
      },
      objective: {
        type: "object",
        additionalProperties: false,
        properties: {
          smart: { type: "string" },
          primary_kpis: {
            type: "array",
            items: { type: "string" },
            minItems: 1
          },
          targets: { type: "string" },
          learning_goal: { type: "string" }
        },
        required: ["smart", "primary_kpis"]
      },
      audience: {
        type: "object",
        additionalProperties: false,
        properties: {
          descriptor: { type: "string" },
          pain_tension: { type: "string" },
          current_emotion: { type: "string" },
          desired_emotion: { type: "string" },
          desired_action: { type: "string" }
        },
        required: ["descriptor", "pain_tension", "desired_action"]
      },
      insight: { type: "string" },
      brand: {
        type: "object",
        additionalProperties: false,
        properties: {
          role: { type: "string" },
          positioning: { type: "string" },
          competitors: {
            type: "array",
            items: { type: "string" }
          }
        },
        required: ["role"]
      },
      message: {
        type: "object",
        additionalProperties: false,
        properties: {
          smp: { type: "string", description: "single-minded proposition" },
          reasons_to_believe: {
            type: "array",
            items: { type: "string" },
            minItems: 1
          }
        },
        required: ["smp", "reasons_to_believe"]
      },
      tone_style: {
        type: "object",
        additionalProperties: false,
        properties: {
          tone_tags: { type: "array", items: { type: "string" } },
          mood_tags: { type: "array", items: { type: "string" } },
          avoid: { type: "array", items: { type: "string" } }
        },
        required: ["tone_tags"]
      },
      channels_formats: {
        type: "object",
        additionalProperties: false,
        properties: {
          channels: { type: "array", items: { type: "string" }, minItems: 1 },
          formats: { type: "array", items: { type: "string" }, minItems: 1 },
          constraints: { type: "array", items: { type: "string" } }
        },
        required: ["channels", "formats"]
      },
      culture_creative: {
        type: "object",
        additionalProperties: false,
        properties: {
          trends_hashtags: { type: "array", items: { type: "string" } },
          references: { type: "array", items: { type: "string" } }
        }
      },
      budget_legal: {
        type: "object",
        additionalProperties: false,
        properties: {
          budget_tier: { type: "string", enum: ["lean", "moderate", "big"] },
          must_include: { type: "array", items: { type: "string" } }
        },
        required: ["budget_tier"]
      },
      // AI-friendly deliverables
      outputs: {
        type: "object",
        additionalProperties: false,
        properties: {
          exec_summary: { type: "string" },
          big_idea: { type: "string" },
          creative_territories: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                description: { type: "string" },
                example_hook: { type: "string" }
              },
              required: ["name", "description"]
            },
            minItems: 2
          },
          journey_map: {
            type: "array",
            items: {
              type: "object",
              properties: {
                stage: { type: "string" },
                message: { type: "string" },
                asset: { type: "string" },
                kpi: { type: "string" }
              },
              required: ["stage", "message", "asset"]
            },
            minItems: 3
          },
          test_plan: {
            type: "array",
            items: {
              type: "object",
              properties: {
                hypothesis: { type: "string" },
                variant_a: { type: "string" },
                variant_b: { type: "string" },
                metric: { type: "string" }
              },
              required: ["hypothesis", "metric"]
            },
            minItems: 1
          },
          kpi_dashboard: {
            type: "array",
            items: {
              type: "object",
              properties: {
                kpi: { type: "string" },
                target: { type: "string" },
                timeframe: { type: "string" }
              },
              required: ["kpi", "target"]
            }
          }
        },
        required: ["exec_summary", "big_idea", "creative_territories", "journey_map"]
      }
    },
    required: [
      "project",
      "objective",
      "audience",
      "insight",
      "brand",
      "message",
      "tone_style",
      "channels_formats",
      "budget_legal",
      "outputs"
    ]
  },
  strict: true
} as const;
