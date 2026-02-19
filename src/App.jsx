import { useEffect, useState } from "react";

export default function App() {
  const [city, setCity] = useState("Latakia,Syria");
  const [timings, setTimings] = useState(null);
  const [nextPrayer, setNextPrayer] = useState(null);
  const [loading, setLoading] = useState(true);

  const cities = [
    { label: "اللاذقية", value: "Latakia,Syria" },
    { label: "أبو ظبي", value: "Abu Dhabi,UAE" },
    { label: "هامبورغ", value: "Hamburg,Germany" },
    { label: "دالاس", value: "Dallas,USA" },
    { label: "اسطنبول", value: "Istanbul,Turkey" },
  ];

  const prayers = [
    { name: "الفجر", key: "Fajr" },
    { name: "الشروق", key: "Sunrise" },
    { name: "الظهر", key: "Dhuhr" },
    { name: "العصر", key: "Asr" },
    { name: "المغرب", key: "Maghrib" },
    { name: "العشاء", key: "Isha" },
  ];

  useEffect(() => {
    setLoading(true);

    fetch(
      `https://api.aladhan.com/v1/timingsByAddress?address=${city}&method=3`
    )
      .then((res) => res.json())
      .then((data) => {
        const t = data.data.timings;
        setTimings(t);
        detectNextPrayer(t);
        setLoading(false);
      });
  }, [city]);

  const detectNextPrayer = (t) => {
    const now = new Date();

    for (let prayer of prayers) {
      const [hour, minute] = t[prayer.key].split(":");
      const prayerTime = new Date();
      prayerTime.setHours(hour, minute, 0);

      if (prayerTime > now) {
        setNextPrayer(prayer.key);
        return;
      }
    }

    setNextPrayer("Fajr");
  };

return (
  <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 flex items-center justify-center p-6">
    <div className="w-full max-w-sm bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 text-white">

      <h1 className="text-3xl font-bold text-center tracking-wide mb-6">
        مواقيت الصلاة
      </h1>

      <select
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="w-full mb-8 px-4 py-2 rounded-xl bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white transition"
      >
        {cities.map((c) => (
          <option key={c.value} value={c.value} className="text-black">
            {c.label}
          </option>
        ))}
      </select>

      {loading ? (
        <p className="text-center text-white/70">جارِ التحميل...</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {prayers.map((prayer) => (
            <div
              key={prayer.key}
              className={`p-4 rounded-2xl transition-all duration-300 text-center
              ${
                nextPrayer === prayer.key
                  ? "bg-yellow-400 text-black shadow-xl scale-105"
                  : "bg-white/15 hover:bg-white/25"
              }`}
            >
              <h3 className="text-sm opacity-80 mb-1">
                {prayer.name}
              </h3>
              <p className="text-xl font-bold tracking-wider">
                {timings[prayer.key]}
              </p>
            </div>
          ))}
        </div>
      )}

      {nextPrayer && !loading && (
        <div className="mt-8 text-center text-sm text-white/70">
          الصلاة القادمة:
          <span className="font-semibold text-white ml-2">
            {prayers.find((p) => p.key === nextPrayer)?.name}
          </span>
        </div>
      )}
    </div>
  </div>
);
}
