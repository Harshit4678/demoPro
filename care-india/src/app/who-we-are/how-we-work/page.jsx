// app/who-we-are/how-we-work/page.js
export const metadata = {
  title: "How we work — Care India Welfare Trust",
  description: "Process and methodology — community engagement, partnership and impact measurement.",
  alternates: { canonical: "https://careindiawelfaretrust.org/who-we-are/how-we-work" }
};

export default function HowWeWorkPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-2xl font-bold mb-4">How we work</h1>

      <section className="space-y-4 text-gray-700">
        <p>
          Humara kaam evidence-based aur community-driven hota hai. Projects shuru karne se pehle need
          assessment karte hain, stakeholders ke saath planning karte hain aur local volunteers train karte hain.
        </p>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="p-4 border rounded">
            <h3 className="font-semibold">Assess</h3>
            <p className="text-sm">Community needs aur context samajhte hain.</p>
          </div>
          <div className="p-4 border rounded">
            <h3 className="font-semibold">Act</h3>
            <p className="text-sm">Targeted interventions (education, health, livelihood).</p>
          </div>
          <div className="p-4 border rounded">
            <h3 className="font-semibold">Assess Impact</h3>
            <p className="text-sm">Monitoring, reporting aur learnings share karna.</p>
          </div>
        </div>

        <p>
          Partnerships (local NGOs, corporates for CSR, volunteers) se hum scale achieve karte hain — aur
          har project ka impact tracked rehta hai through simple KPIs.
        </p>
      </section>
    </main>
  );
}
