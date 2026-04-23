/**
 * Intelligent Log Processor Utility
 * Analyzes raw logs to detect types, levels, and patterns.
 */

export const processLogs = (rawLogs) => {
  if (!rawLogs) return null;

  const lines = rawLogs.split('\n').filter(line => line.trim() !== '');
  const result = {
    type: 'Generic',
    stats: { errors: 0, warnings: 0, info: 0 },
    groupedErrors: {},
    timeline: [],
    detectedType: 'Unknown'
  };

  // 1. Detect Log Type
  if (rawLogs.includes('at ') && rawLogs.includes('node_modules')) {
    result.detectedType = 'Node.js';
  } else if (rawLogs.includes('nginx') || /\[\d{2}\/\w{3}\/\d{4}/.test(rawLogs)) {
    result.detectedType = 'Nginx';
  } else if (rawLogs.includes('Traceback') || rawLogs.includes('File "')) {
    result.detectedType = 'Python';
  } else if (rawLogs.includes('kube') || rawLogs.includes('pod')) {
    result.detectedType = 'Kubernetes';
  }

  // 2. Process Lines
  lines.forEach((line, index) => {
    let level = 'info';
    
    // Level Detection
    if (/error|critical|fatal|severe|failed/i.test(line)) {
      level = 'error';
      result.stats.errors++;
      
      // Grouping
      const msg = line.replace(/\[.*?\]/g, '').trim(); // Remove timestamps for better grouping
      result.groupedErrors[msg] = (result.groupedErrors[msg] || 0) + 1;
    } else if (/warn|warning|caution/i.test(line)) {
      level = 'warning';
      result.stats.warnings++;
    } else {
      result.stats.info++;
    }

    // Timeline Extraction (Simple heuristic)
    const timestampMatch = line.match(/\d{2}:\d{2}:\d{2}/) || line.match(/T\d{2}:\d{2}:\d{2}/);
    if (timestampMatch || level !== 'info') {
      result.timeline.push({
        id: index,
        time: timestampMatch ? timestampMatch[0].replace('T', '') : null,
        message: line.substring(0, 120) + (line.length > 120 ? '...' : ''),
        level
      });
    }
  });

  // Sort and limit timeline
  result.timeline = result.timeline.slice(-10); // Last 10 significant events

  return result;
};
