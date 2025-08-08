import { useMemo, useState, useEffect } from 'react'

function pmt(rate, nper, pv) {
  // monthly payment for loan
  const r = rate/12
  return r === 0 ? -(pv / nper) : -(pv * r) / (1 - Math.pow(1 + r, -nper))
}

export default function UsedCalculator() {
  const params = new URLSearchParams(window.location.search)
  const defaultPrice = Number(params.get('price')) || 25000

  const [price, setPrice] = useState(defaultPrice)
  const [down, setDown] = useState(2000)
  const [term, setTerm] = useState(60)
  const [apr, setApr] = useState(6.49)
  const [taxRate, setTaxRate] = useState(15.0)
  const [fees, setFees] = useState(499)

  const financed = Math.max(price - down + fees, 0)
  const monthly = useMemo(() => Math.abs(pmt(apr/100, term, financed*(1+taxRate/100))), [apr, term, financed, taxRate])
  const total = useMemo(() => monthly * term + down, [monthly, term, down])

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Used Vehicle Payment Calculator</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <div className="space-y-3">
            <Field label="Price" value={price} setValue={setPrice} prefix="$" />
            <Field label="Down Payment" value={down} setValue={setDown} prefix="$" />
            <Field label="Term (months)" value={term} setValue={setTerm} />
            <Field label="APR (%)" value={apr} setValue={setApr} />
            <Field label="Tax Rate (%)" value={taxRate} setValue={setTaxRate} />
            <Field label="Fees" value={fees} setValue={setFees} prefix="$" />
          </div>
        </div>
        <div className="card">
          <div className="text-xl font-semibold mb-2">Your Estimated Payments</div>
          <div className="text-5xl font-extrabold mb-2">${monthly.toFixed(0)}</div>
          <div className="text-slate-600 mb-4">per month x {term} months</div>
          <div className="text-slate-700"><b>Total cost</b> (incl. tax & fees): ${total.toLocaleString(undefined, {maximumFractionDigits:0})}</div>
          <div className="text-slate-500 text-sm mt-3">Estimates only. OAC. Contact dealer for exact terms.</div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, value, setValue, prefix }) {
  return (
    <label className="block">
      <div className="text-sm text-slate-600 mb-1">{label}</div>
      <div className="flex items-center gap-2 border rounded-xl px-3 py-2">
        {prefix ? <span className="text-slate-500">{prefix}</span> : null}
        <input className="w-full outline-none" type="number" value={value} onChange={e=>setValue(Number(e.target.value))} />
      </div>
    </label>
  )
}
