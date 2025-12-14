/**
 * LLM Configuration
 * Settings for OpenAI and Anthropic API connections
 */

const LLM_PROVIDERS = {
  OPENAI: 'openai',
  ANTHROPIC: 'anthropic',
};

const getConfig = () => {
  const provider = process.env.LLM_PROVIDER || LLM_PROVIDERS.OPENAI;

  const configs = {
    [LLM_PROVIDERS.OPENAI]: {
      provider: LLM_PROVIDERS.OPENAI,
      apiKey: process.env.OPENAI_API_KEY,
      model: process.env.LLM_MODEL || 'gpt-4',
      maxTokens: parseInt(process.env.LLM_MAX_TOKENS) || 4000,
      temperature: parseFloat(process.env.LLM_TEMPERATURE) || 0.7,
    },
    [LLM_PROVIDERS.ANTHROPIC]: {
      provider: LLM_PROVIDERS.ANTHROPIC,
      apiKey: process.env.ANTHROPIC_API_KEY,
      model: process.env.ANTHROPIC_MODEL || 'claude-3-sonnet-20240229',
      maxTokens: parseInt(process.env.LLM_MAX_TOKENS) || 4000,
      temperature: parseFloat(process.env.LLM_TEMPERATURE) || 0.7,
    },
  };

  return configs[provider] || configs[LLM_PROVIDERS.OPENAI];
};

// Model capabilities for different invocations
const MODEL_CONFIGS = {
  invocation1: { temperature: 0.7, maxTokens: 2000 },  // Course description - creative
  invocation2: { temperature: 0.5, maxTokens: 3000 },  // Learning objectives - balanced
  invocation3: { temperature: 0.6, maxTokens: 4000 },  // Topics/structure - balanced
  invocation4: { temperature: 0.4, maxTokens: 8000 },  // Full build - precise
  invocation5: { temperature: 0.3, maxTokens: 2000 },  // Template mapping - precise
};

module.exports = {
  LLM_PROVIDERS,
  getConfig,
  MODEL_CONFIGS,
};
