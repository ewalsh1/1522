import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export default function Model() {
  const { id } = useParams()
  const [model, setModel] = useState(null)

  useEffect(() => {
    axios.get(`${API}/api/models`).then(res => {
      const found = res.data.models.find(m => m.id === id)
      setModel(found)
    })
  }, [id])

  if (!model) return <div className="max-w-7xl mx-auto px-4 py-10">Loading…</div>

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <img className="rounded-2xl shadow" src={model.heroImage} />
        <div>
          <h1 className="text-4xl font-extrabold mb-2">{model.year} {model.make} {model.model}</h1>
          <div className="text-slate-600 mb-4">Starting at ${model.basePrice.toLocaleString()}</div>
          <p className="mb-6 text-slate-700">High-strength design, advanced tech, and the capability you expect. Configure trims and packages to build the perfect {model.model} for your life.</p>
          <Link to={`/build-and-price/${model.id}`} className="btn">Build & Price</Link>
        </div>
      </div>
    </div>
  )
}
