import { useEffect, useState } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'
const KEY = import.meta.env.VITE_API_KEY || 'supersecretapikey123'

export default function Admin() {
  const [inventory, setInventory] = useState([])
  const [form, setForm] = useState({
    type: 'new',
    vin: '',
    year: 2025,
    make: 'Ford',
    model: 'F-150',
    modelId: 'f150',
    trim: 'XLT',
    price: 59999,
    km: 0,
    photos: []
  })

  function load() {
    axios.get(`${API}/api/inventory`).then(r => setInventory(r.data.inventory))
  }
  useEffect(() => { load() }, [])

  async function addItem(e) {
    e.preventDefault()
    await axios.post(`${API}/api/inventory`, { item: form }, { headers: { 'x-api-key': KEY } })
    load()
  }

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Admin – Inventory Intake</h1>
      <form onSubmit={addItem} className="card grid md:grid-cols-2 gap-4 mb-6">
        <Select label="Type" value={form.type} onChange={v=>set('type', v)} options={[['new','New'],['used','Used']]} />
        <Field label="VIN" value={form.vin} onChange={v=>set('vin', v)} />
        <Field label="Year" value={form.year} type="number" onChange={v=>set('year', Number(v))} />
        <Field label="Make" value={form.make} onChange={v=>set('make', v)} />
        <Field label="Model" value={form.model} onChange={v=>set('model', v)} />
        <Field label="Model ID (for Build & Price link)" value={form.modelId} onChange={v=>set('modelId', v)} />
        <Field label="Trim" value={form.trim} onChange={v=>set('trim', v)} />
        <Field label="Price" value={form.price} type="number" onChange={v=>set('price', Number(v))} />
        <Field label="KM" value={form.km} type="number" onChange={v=>set('km', Number(v))} />
        <Field label="Photo URL(s) comma-separated" value={form.photos.join(',')} onChange={v=>set('photos', v.split(',').map(s=>s.trim()).filter(Boolean))} />
        <div className="md:col-span-2">
          <button className="btn">Add to Inventory</button>
        </div>
      </form>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {inventory.map(i => (
          <div key={i.id} className="card">
            <img className="rounded-xl mb-2 aspect-video object-cover" src={i.photos?.[0] || 'https://images.pexels.com/photos/1402787/pexels-photo-1402787.jpeg'} />
            <div className="font-semibold">{i.year} {i.make} {i.model} {i.trim}</div>
            <div className="text-sm text-slate-500">VIN: {i.vin}</div>
            <div className="font-bold">${(i.price||0).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Field({ label, value, onChange, type='text' }) {
  return (
    <label className="block">
      <div className="text-sm text-slate-600 mb-1">{label}</div>
      <input className="border rounded-xl px-3 py-2 w-full" value={value} type={type} onChange={e=>onChange(e.target.value)} />
    </label>
  )
}
function Select({ label, value, onChange, options }) {
  return (
    <label className="block">
      <div className="text-sm text-slate-600 mb-1">{label}</div>
      <select className="border rounded-xl px-3 py-2 w-full" value={value} onChange={e=>onChange(e.target.value)}>
        {options.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </label>
  )
}
