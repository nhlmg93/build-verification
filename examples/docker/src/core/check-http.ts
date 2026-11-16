export async function checkHttp(url: string, expected: string) {
  const checkedAt = new Date().toISOString();

  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(5_000) });
    const body = (await response.text()).trim();

    return {
      url,
      checkedAt,
      passed: response.status === 200 && body === expected,
      status: response.status,
      expected,
      body,
    };
  } catch (error) {
    return {
      url,
      checkedAt,
      passed: false,
      expected,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
