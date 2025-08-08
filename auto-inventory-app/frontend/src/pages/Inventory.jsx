import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export default function Inventory() {
  const { type } = useParams()
  const [items, setItems] = useState([])
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    axios.get(`${API}/api/inventory`, { params: { type } }).then(res => {
      setItems(res.data.inventory)
    }).finally(() => setLoading(false))
  }, [type])

  const filtered = items.filter(i => {
    const s = `${i.year} ${i.make} ${i.model} ${i.trim} ${i.vin}`.toLowerCase()
    return s.includes(q.toLowerCase())
  })

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">{type === 'new' ? 'New' : 'Used'} Inventory</h1>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search VIN, model..." className="border rounded-xl px-3 py-2 w-64" />
      </div>
      {loading ? <div>Loading…</div> : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(i => (
            <div key={i.id} className="card">
              <img className="rounded-xl mb-3 aspect-video object-cover" src={i.photos?.[0] || 'https://images.pexels.com/photos/1402787/pexels-photo-1402787.jpeg'} />
              <div className="font-semibold text-lg">{i.year} {i.make} {i.model} {i.trim}</div>
              <div className="text-slate-500 text-sm mb-2">VIN: {i.vin}</div>
              <div className="font-bold text-xl mb-3">${(i.price || 0).toLocaleString()}</div>
              {i.type === 'new' ? (
                <Link to={`/build-and-price/${i.modelId || 'f150'}`} className="btn w-full">Build & Price</Link>
              ) : (
                <Link to={`/used-calculator?price=${i.price || 0}`} className="btn w-full">Estimate Payments</Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
