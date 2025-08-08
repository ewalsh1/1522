import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export default function BuildPrice() {
  const { id } = useParams()
  const [model, setModel] = useState(null)
  const [trim, setTrim] = useState(null)
  const [chosen, setChosen] = useState([])

  useEffect(() => {
    axios.get(`${API}/api/models`).then(res => {
      const found = res.data.models.find(m => m.id === id)
      setModel(found)
      setTrim(found?.trims?.[0]?.code || null)
    })
  }, [id])

  const price = useMemo(() => {
    if (!model) return 0
    const trimDelta = model.trims.find(t => t.code === trim)?.priceDelta || 0
    const optionsTotal = chosen.reduce((sum, code) => {
      const opt = model.options.find(o => o.code === code)
      return sum + (opt?.price || 0)
    }, 0)
    return model.basePrice + trimDelta + optionsTotal
  }, [model, trim, chosen])

  if (!model) return <div className="max-w-7xl mx-auto px-4 py-10">Loading…</div>

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-8">
        <img className="rounded-2xl shadow" src={model.heroImage} />
        <div>
          <h1 className="text-3xl font-bold mb-4">{model.year} {model.make} {model.model}</h1>
          <div className="mb-4">
            <label className="font-semibold block mb-2">Trim</label>
            <div className="flex flex-wrap gap-2">
              {model.trims.map(t => (
                <button key={t.code} onClick={()=>setTrim(t.code)} className={`btn-outline ${trim===t.code ? 'ring-2 ring-[var(--brand)]' : ''}`}>
                  {t.code} {t.priceDelta>0 ? `(+$${t.priceDelta.toLocaleString()})` : ''}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="font-semibold block mb-2">Options</label>
            <div className="grid sm:grid-cols-2 gap-2">
              {model.options.map(o => {
                const on = chosen.includes(o.code)
                return (
                  <label key={o.code} className="card flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={on} onChange={(e)=>{
                      setChosen(x => e.target.checked ? [...x, o.code] : x.filter(c=>c!==o.code))
                    }} />
                    <span className="font-medium">{o.name}</span>
                    <span className="ml-auto">${o.price.toLocaleString()}</span>
                  </label>
                )
              })}
            </div>
          </div>
          <div className="text-2xl font-extrabold">Total: ${price.toLocaleString()}</div>
          <div className="text-slate-500 text-sm">* Estimated MSRP before taxes, fees, and dealer pricing.</div>
        </div>
      </div>
    </div>
  )
}
