import http from 'node:http';

const TARGET_URL = 'http://localhost:3000';
const CONCURRENCY_LEVELS = [10, 25, 50, 100];

function makeRequest(url) {
  return new Promise((resolve) => {
    const start = performance.now();
    const req = http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        const duration = performance.now() - start;
        resolve({
          statusCode: res.statusCode,
          duration,
          bytes: Buffer.byteLength(data),
          success: res.statusCode >= 200 && res.statusCode < 400,
        });
      });
    });

    req.on('error', (err) => {
      resolve({
        statusCode: 0,
        duration: performance.now() - start,
        bytes: 0,
        success: false,
        error: err.message,
      });
    });

    req.setTimeout(5000, () => {
      req.destroy();
      resolve({
        statusCode: 408,
        duration: performance.now() - start,
        bytes: 0,
        success: false,
        error: 'timeout',
      });
    });
  });
}

async function runScenario(concurrency, totalRequests) {
  const results = [];
  const startScenario = performance.now();

  let completed = 0;
  let active = 0;
  let queueIndex = 0;

  await new Promise((resolve) => {
    function next() {
      if (completed >= totalRequests) {
        resolve();
        return;
      }

      while (active < concurrency && queueIndex < totalRequests) {
        queueIndex++;
        active++;
        makeRequest(TARGET_URL).then((res) => {
          results.push(res);
          active--;
          completed++;
          next();
        });
      }
    }

    next();
  });

  const totalTime = performance.now() - startScenario;
  const latencies = results.map((r) => r.duration).sort((a, b) => a - b);
  const successes = results.filter((r) => r.success).length;
  const errors = results.length - successes;
  const avgLatency = (latencies.reduce((a, b) => a + b, 0) / latencies.length).toFixed(2);
  const p50 = latencies[Math.floor(latencies.length * 0.5)].toFixed(2);
  const p95 = latencies[Math.floor(latencies.length * 0.95)].toFixed(2);
  const p99 = latencies[Math.floor(latencies.length * 0.99)].toFixed(2);
  const throughput = ((results.length / totalTime) * 1000).toFixed(1);

  return {
    concurrency,
    totalRequests,
    totalTimeMs: totalTime.toFixed(1),
    throughputRps: throughput,
    avgLatencyMs: avgLatency,
    p50Ms: p50,
    p95Ms: p95,
    p99Ms: p99,
    successes,
    errors,
    errorRate: `${((errors / results.length) * 100).toFixed(2)}%`,
  };
}

async function main() {
  console.log('--- INICIANDO TESTE DE CARGA E CONCORRÊNCIA ---');
  console.log(`Alvo: ${TARGET_URL}`);

  const summary = [];
  for (const concurrency of CONCURRENCY_LEVELS) {
    const totalRequests = concurrency * 4; // e.g. 40, 100, 200, 400 requests
    const res = await runScenario(concurrency, totalRequests);
    summary.push(res);
    console.log(JSON.stringify(res, null, 2));
  }

  console.log('--- RESUMO DOS TESTES ---');
  console.table(summary);
}

main().catch(console.error);
