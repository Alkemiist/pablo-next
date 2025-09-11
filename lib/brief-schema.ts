export const BriefJsonSchema = {
  name: "marketing_brief",
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      // Page 1: Project Context
      project: {
        type: "object",
        additionalProperties: false,
        properties: {
          title: { type: "string" },
          name: { type: "string" },
          launch_window: { type: "string" },
          owner: { type: "string" },
          business_context: { type: "string" }
        },
        required: ["business_context"]
      },
      
      // Page 2: Brand
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
        required: []
      },
      
      // Page 3: Objective
      objective: {
        type: "object",
        additionalProperties: false,
        properties: {
          smart: { type: "string" },
          primary_kpis: {
            type: "array",
            items: { type: "string" }
          },
          targets: { type: "string" },
          learning_goal: { type: "string" }
        },
        required: []
      },
      
      // Page 4: Audience
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
        required: []
      },
      
      // Page 5: Insight
      insight: { type: "string" },
      
      // Page 6: Message
      message: {
        type: "object",
        additionalProperties: false,
        properties: {
          smp: { type: "string" },
          reasons_to_believe: {
            type: "array",
            items: { type: "string" }
          }
        },
        required: []
      },
      
      // Page 7: Tone & Style
      tone_style: {
        type: "object",
        additionalProperties: false,
        properties: {
          tone_tags: {
            type: "array",
            items: { type: "string" }
          },
          mood_tags: {
            type: "array",
            items: { type: "string" }
          },
          avoid: {
            type: "array",
            items: { type: "string" }
          }
        },
        required: []
      },
      
      // Page 8: Channels & Formats
      channels_formats: {
        type: "object",
        additionalProperties: false,
        properties: {
          channels: {
            type: "array",
            items: { type: "string" }
          },
          formats: {
            type: "array",
            items: { type: "string" }
          },
          constraints: {
            type: "array",
            items: { type: "string" }
          }
        },
        required: []
      },
      
      
      // Generated outputs
      outputs: {
        type: "object",
        additionalProperties: false,
        properties: {
          exec_summary: { type: "string" },
          big_idea: { type: "string" },
          strategic_insight: { type: "string" },
          creative_territories: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                description: { type: "string" },
                example_hook: { type: "string" },
                visual_direction: { type: "string" },
                target_emotion: { type: "string" }
              },
              required: ["name", "description"]
            },
            minItems: 3
          },
          journey_map: {
            type: "array",
            items: {
              type: "object",
              properties: {
                stage: { type: "string" },
                message: { type: "string" },
                asset: { type: "string" },
                kpi: { type: "string" },
                touchpoints: { type: "array", items: { type: "string" } },
                success_metrics: { type: "array", items: { type: "string" } }
              },
              required: ["stage", "message", "asset"]
            },
            minItems: 4
          },
          test_plan: {
            type: "array",
            items: {
              type: "object",
              properties: {
                hypothesis: { type: "string" },
                variant_a: { type: "string" },
                variant_b: { type: "string" },
                metric: { type: "string" },
                success_criteria: { type: "string" },
                timeline: { type: "string" }
              },
              required: ["hypothesis", "metric"]
            },
            minItems: 2
          },
          kpi_dashboard: {
            type: "array",
            items: {
              type: "object",
              properties: {
                kpi: { type: "string" },
                target: { type: "string" },
                timeframe: { type: "string" },
                measurement_method: { type: "string" },
                baseline: { type: "string" }
              },
              required: ["kpi", "target"]
            }
          },
          competitive_analysis: {
            type: "object",
            properties: {
              key_competitors: { type: "array", items: { type: "string" } },
              competitive_advantage: { type: "string" },
              market_positioning: { type: "string" },
              differentiation_strategy: { type: "string" }
            }
          },
          channel_strategy: {
            type: "object",
            properties: {
              primary_channels: { type: "array", items: { type: "string" } },
              channel_objectives: { type: "array", items: { type: "string" } },
              budget_allocation: { type: "string" },
              success_metrics: { type: "array", items: { type: "string" } }
            }
          }
        },
        required: []
      }
    },
    required: [
      "project",
      "brand",
      "objective",
      "audience",
      "insight",
      "message",
      "tone_style",
      "channels_formats",
      "outputs"
    ]
  },
  strict: true
} as const;