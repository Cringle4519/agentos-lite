import { useState } from "react";

export default function Home() {
  const [form, setForm] = useState({
    address: "",
    list_price: "",
    beds: "",
    baths: "",
    sqft: "",
    dom: "",
    comp1_price: "",
    comp1_sqft: "",
    comp1_dom: "",
    comp2_price: "",
    comp2_sqft: "",
    comp2_dom: "",
    comp3_price: "",
    comp3_sqft: "",
    comp3_dom: "",
    buyer_financing: "",
    buyer_close_days: "",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setResult({ error: "Something went wrong" });
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>AgentOS Lite Demo</h1>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gap: "0.5rem",
          maxWidth: "400px",
          marginBottom: "2rem",
        }}
      >
        {Object.keys(form).map((key) => (
          <input
            key={key}
            name={key}
            value={form[key]}
            placeholder={key}
            onChange={handleChange}
          />
        ))}
        <button type="submit">Analyze Deal</button>
      </form>

      {loading && <p>Analyzing...</p>}

      {result && (
        <div style={{ marginTop: "2rem" }}>
          {result.error && <p style={{ color: "red" }}>{result.error}</p>}

          {result.best_offer && (
            <>
              <h2>Best Offer</h2>
              <pre>{JSON.stringify(result.best_offer, null, 2)}</pre>
            </>
          )}

          {result.deal_matrix && (
            <>
              <h2>Deal Matrix</h2>
              <pre>{JSON.stringify(result.deal_matrix, null, 2)}</pre>
            </>
          )}

          {result.forecast_curve && (
            <>
              <h2>Forecast Curve</h2>
              <pre>{JSON.stringify(result.forecast_curve, null, 2)}</pre>
            </>
          )}
        </div>
      )}
    </div>
  );
}
