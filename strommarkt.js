document.addEventListener('DOMContentLoaded', () => {
  const currentEl = document.getElementById('stromCurrent');
  const lowEl = document.getElementById('stromLow');
  const highEl = document.getElementById('stromHigh');
  const canvas = document.getElementById('stromChart');

  if (!currentEl || !lowEl || !highEl || !canvas) return;

  const endpoint = 'https://www.smard.de/app/chart_data/4169/DE/4169_DE_quarterhour_PT15M.json';
  const ctx = canvas.getContext('2d');

  const formatEuro = (value) => `${value.toLocaleString('de-DE', { maximumFractionDigits: 1, minimumFractionDigits: 1 })} €/MWh`;

  const drawChart = (values) => {
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    if (!values.length) return;

    const min = Math.min(...values);
    const max = Math.max(...values);
    const padding = { top: 20, right: 18, bottom: 24, left: 16 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;
    const range = max - min || 1;

    ctx.strokeStyle = 'rgba(201,150,58,0.25)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i += 1) {
      const y = padding.top + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
    }

    ctx.beginPath();
    values.forEach((val, index) => {
      const x = padding.left + (index / (values.length - 1 || 1)) * chartW;
      const y = padding.top + ((max - val) / range) * chartH;
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#C9963A';
    ctx.lineWidth = 2;
    ctx.stroke();

    const last = values[values.length - 1];
    const lx = padding.left + chartW;
    const ly = padding.top + ((max - last) / range) * chartH;
    ctx.fillStyle = '#E8B86D';
    ctx.beginPath();
    ctx.arc(lx, ly, 3.5, 0, Math.PI * 2);
    ctx.fill();
  };

  const parseData = (payload) => {
    const seriesValues = payload?.series?.[0]?.values;
    if (!Array.isArray(seriesValues)) return [];

    return seriesValues
      .map((row) => {
        if (!Array.isArray(row) || row.length < 2) return null;
        const ts = Number(row[0]);
        const val = Number(row[1]);
        if (!Number.isFinite(ts) || !Number.isFinite(val)) return null;
        return { ts, val };
      })
      .filter(Boolean)
      .sort((a, b) => a.ts - b.ts);
  };

  fetch(endpoint)
    .then((res) => {
      if (!res.ok) throw new Error(`SMARD ${res.status}`);
      return res.json();
    })
    .then((payload) => {
      const points = parseData(payload);
      if (!points.length) throw new Error('Keine Datenpunkte verfügbar');

      const latest24 = points.slice(-96);
      const vals = latest24.map((item) => item.val);

      const current = vals[vals.length - 1];
      const low = Math.min(...vals);
      const high = Math.max(...vals);

      currentEl.textContent = formatEuro(current);
      lowEl.textContent = formatEuro(low);
      highEl.textContent = formatEuro(high);

      drawChart(vals);
    })
    .catch(() => {
      currentEl.textContent = 'Derzeit nicht verfügbar';
      lowEl.textContent = '—';
      highEl.textContent = '—';
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(249,246,239,.72)';
      ctx.font = '16px "DM Sans", sans-serif';
      ctx.fillText('SMARD-Daten konnten gerade nicht geladen werden.', 20, 40);
    });
});
