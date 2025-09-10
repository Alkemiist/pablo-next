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
          name: { type: "string" },
          core_idea: { type: "string" },
          business_context: { type: "string" },
          timeline: { type: "string" }
        },
        required: ["name", "core_idea", "business_context", "timeline"]
      },
      
      // Page 2: Brand
      brand: {
        type: "object",
        additionalProperties: false,
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          values: {
            type: "array",
            items: { type: "string" },
            minItems: 1
          },
          personality: { type: "string" },
          positioning: { type: "string" }
        },
        required: ["name", "description", "values", "personality", "positioning"]
      },
      
      // Page 3: Product
      product: {
        type: "object",
        additionalProperties: false,
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          features: {
            type: "array",
            items: { type: "string" },
            minItems: 1
          },
          benefits: {
            type: "array",
            items: { type: "string" },
            minItems: 1
          },
          unique_selling_proposition: { type: "string" }
        },
        required: ["name", "description", "features", "benefits", "unique_selling_proposition"]
      },
      
      // Page 4: Target Audience
      audience: {
        type: "object",
        additionalProperties: false,
        properties: {
          primary_demographics: { type: "string" },
          psychographics: { type: "string" },
          pain_points: {
            type: "array",
            items: { type: "string" },
            minItems: 1
          },
          motivations: {
            type: "array",
            items: { type: "string" },
            minItems: 1
          },
          behaviors: {
            type: "array",
            items: { type: "string" },
            minItems: 1
          },
          media_consumption: {
            type: "array",
            items: { type: "string" },
            minItems: 1
          }
        },
        required: ["primary_demographics", "psychographics", "pain_points", "motivations", "behaviors", "media_consumption"]
      },
      
      // Page 5: Objectives & Success
      objectives: {
        type: "object",
        additionalProperties: false,
        properties: {
          intent: { type: "string" },
          smart_targets: {
            type: "array",
            items: { type: "string" },
            minItems: 1
          },
          success_metrics: {
            type: "array",
            items: { type: "string" },
            minItems: 1
          },
          kpis: {
            type: "array",
            items: { type: "string" },
            minItems: 1
          }
        },
        required: ["intent", "smart_targets", "success_metrics", "kpis"]
      },
      
      // Page 6: Creative Spine
      creative_spine: {
        type: "object",
        additionalProperties: false,
        properties: {
          trend_connection: { type: "string" },
          visual_direction: { type: "string" }
        },
        required: ["trend_connection", "visual_direction"]
      },
      
      // Page 7: Channels & Formats
      channels_formats: {
        type: "object",
        additionalProperties: false,
        properties: {
          platforms: {
            type: "array",
            items: { type: "string" },
            minItems: 1
          },
          formats: {
            type: "array",
            items: { type: "string" },
            minItems: 1
          },
          creative_constraints: {
            type: "array",
            items: { type: "string" }
          },
          technical_requirements: {
            type: "array",
            items: { type: "string" }
          }
        },
        required: ["platforms", "formats"]
      },
      
      // Page 8: Budget & Guardrails
      budget_guardrails: {
        type: "object",
        additionalProperties: false,
        properties: {
          budget_amount: { type: "string" },
          budget_allocation: { type: "string" },
          must_include: {
            type: "array",
            items: { type: "string" }
          },
          restrictions: {
            type: "array",
            items: { type: "string" }
          },
          compliance_requirements: {
            type: "array",
            items: { type: "string" }
          }
        },
        required: ["budget_amount", "budget_allocation"]
      },
      
      // Generated outputs
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
      "brand",
      "product",
      "audience",
      "objectives",
      "creative_spine",
      "channels_formats",
      "budget_guardrails",
      "outputs"
    ]
  },
  strict: true
} as const;