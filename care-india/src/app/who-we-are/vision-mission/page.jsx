// app/who-we-are/vision-mission/page.js
export const metadata = {
  title: "Vision & Mission — Care India Welfare Trust",
  description: "Our vision and mission statements — long-term goals for community welfare.",
  alternates: { canonical: "https://careindiawelfaretrust.org/who-we-are/vision-mission" }
};

export default function VisionMissionPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-2xl font-bold mb-3">Vision & Mission</h1>

      <section className="space-y-4 text-gray-700">
        <div>
          <h2 className="font-semibold">Vision</h2>
          <p>
            Ek inclusive India jahan har bachcha, mahila aur elderly ko dignity aur opportunities milen —
            sustainable communities jahan basic needs aur choices ensured ho.
          </p>
        </div>

        <div>
          <h2 className="font-semibold">Mission</h2>
          <p>
            Hum empower karte hain vulnerable communities ko education, health aur livelihood interventions
            ke through, partnerships se scalable models banake aur transparent governance follow karke.
          </p>
        </div>

        <div>
          <h2 className="font-semibold">Values</h2>
          <ul className="list-disc pl-5">
            <li>Transparency</li>
            <li>Community-centrism</li>
            <li>Respect & Dignity</li>
            <li>Impact-focus</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
