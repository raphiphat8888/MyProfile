function write(level, message, metadata) {
  const timestamp = new Date().toISOString();
  const suffix = metadata
    ? ` ${metadata instanceof Error ? metadata.stack || metadata.message : JSON.stringify(metadata)}`
    : '';

  console[level](`[${timestamp}] ${message}${suffix}`);
}

const logger = {
  error(message, metadata) {
    write('error', message, metadata);
  },
  info(message, metadata) {
    write('info', message, metadata);
  },
  warn(message, metadata) {
    write('warn', message, metadata);
  },
};

module.exports = { logger };
