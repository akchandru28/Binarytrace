import emitter from '../../events/emitter.js';
import InferenceLog from '../../models/InferenceLog.js';

emitter.on('log.created', async (data) => {
  try {
    await InferenceLog.create(data);
    console.log(`📊 Log saved [${data.provider}] ${data.latency}ms`);
  } catch (err) {
    console.error('Failed to save log:', err.message);
  }
});

console.log('🔄 Log worker listening for events...');
