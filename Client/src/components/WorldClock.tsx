import React, { useEffect, useMemo, useState } from 'react';

type Props = {
  zones: string[];
  onZonesChange: (zones: string[]) => void;
  use24h: boolean;
};

function formatTime(date: Date, timeZone: string, use24h: boolean) {
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: !use24h,
    timeZone
  };
  return new Intl.DateTimeFormat(undefined, options).format(date);
}

function formatDate(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    timeZone
  }).format(date);
}

function getOffsetString(date: Date, timeZone: string) {
  try {
    // Create formatter that returns parts including timeZoneName with GMT offset (if supported)
    const fmt = new Intl.DateTimeFormat('en-US', {
      timeZone,
      timeZoneName: 'shortOffset'
    } as any);
    const parts = fmt.formatToParts(date);
    const tzPart = parts.find((p) => p.type === 'timeZoneName')?.value;
    if (tzPart) return tzPart;
  } catch {
    // fallback
  }
  // Fallback: compute offset by comparing UTC and target zone local time using toLocaleString workaround
  try {
    const tzDateStr = date.toLocaleString('en-US', { timeZone });
    const tzDate = new Date(tzDateStr);
    const diffMin = (tzDate.getTime() - date.getTime()) / 60000;
    const sign = diffMin >= 0 ? '+' : '-';
    const abs = Math.abs(diffMin);
    const hours = Math.floor(abs / 60)
      .toString()
      .padStart(2, '0');
    const minutes = (abs % 60).toString().padStart(2, '0');
    return `GMT${sign}${hours}:${minutes}`;
  } catch {
    return '';
  }
}

export default function WorldClock({ zones, onZonesChange, use24h }: Props) {
  const [now, setNow] = useState<Date>(() => new Date());
  const [newZone, setNewZone] = useState('');

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const removeZone = (tz: string) => {
    onZonesChange(zones.filter((z) => z !== tz));
  };

  const addZone = () => {
    const tz = newZone.trim();
    if (!tz) return;
    if (zones.includes(tz)) {
      alert('Zone already added.');
      return;
    }
    // Validate by trying to format; invalid IANA will throw in some engines
    try {
      new Intl.DateTimeFormat('en-US', { timeZone: tz }).format();
    } catch (err) {
      alert('Invalid IANA time zone name. Examples: "Europe/Berlin", "America/Chicago", "Asia/Tokyo".');
      return;
    }
    const next = [...zones, tz];
    onZonesChange(next);
    setNewZone('');
  };

  const zoneItems = useMemo(
    () =>
      zones.map((tz) => {
        const time = formatTime(now, tz, use24h);
        const date = formatDate(now, tz);
        const offset = getOffsetString(now, tz);
        return { tz, time, date, offset };
      }),
    [zones, now, use24h]
  );

  return (
    <div>
      <div className="add-row card">
        <input
          placeholder='Add IANA timezone (e.g. "Europe/Berlin")'
          value={newZone}
          onChange={(e) => setNewZone(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addZone()}
        />
        <button className="button" onClick={addZone}>Add</button>
        <button
          className="button button-ghost"
          onClick={() => {
            onZonesChange([
              'UTC',
              'Europe/London',
              'Europe/Paris',
              'America/New_York',
              'America/Los_Angeles',
              'Asia/Tokyo',
              'Asia/Kolkata',
              'Australia/Sydney'
            ]);
          }}
          title="Reset to defaults"
        >
          Reset
        </button>
      </div>

      <div className="grid">
        {zoneItems.map((z) => (
          <div key={z.tz} className="clock card">
            <div className="clock-header">
              <h3 className="tz-name">{z.tz}</h3>
              <button className="remove" onClick={() => removeZone(z.tz)} aria-label={`Remove ${z.tz}`}>×</button>
            </div>
            <div className="time">{z.time}</div>
            <div className="meta">
              <span>{z.date}</span>
              <span className="offset">{z.offset}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}