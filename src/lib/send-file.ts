export async function sendFile(formData: FormData, extractApiKey: string) {
  const url = `${process.env.BASE_URL!}/api/extract`;

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
    headers: {
      Authorization: `Bearer ${extractApiKey}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    return { ok: false, error: data?.error || 'Extraction failed' };
  }

  return { ok: true, data };
}
