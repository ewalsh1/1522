import { Link } from 'react-router-dom'

export default function App() {
  return (
    <div>
      <header className="bg-white/70 backdrop-blur sticky top-0 z-10 border-b">
        <div className="max-w-7xl mx-auto p-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-extrabold" style={{color:'var(--brand)'}}>NORTH COAST FORD</Link>
          <nav className="flex gap-4">
            <Link to="/inventory/new" className="btn-outline">New</Link>
            <Link to="/inventory/used" className="btn-outline">Used</Link>
            <Link to="/used-calculator" className="btn-outline">Used Calculator</Link>
            <Link to="/admin" className="btn">Admin</Link>
          </nav>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-5xl font-extrabold leading-tight mb-4">Built for life in Atlantic Canada.</h1>
            <p className="text-slate-600 mb-6">Explore our latest lineup, build and price your dream Ford, and browse quality pre-owned inventory with transparent pricing.</p>
            <div className="flex gap-3">
              <Link to="/inventory/new" className="btn">Shop New</Link>
              <Link to="/inventory/used" className="btn-outline">Shop Used</Link>
            </div>
          </div>
          <div className="card">
            <img className="rounded-xl" src="https://images.pexels.com/photos/1402787/pexels-photo-1402787.jpeg" alt="Hero" />
          </div>
        </div>
      </section>

      <section className="bg-white py-10 border-t">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">Popular Models</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { id:'f150', name:'F‑150', img:'https://images.pexels.com/photos/1159541/pexels-photo-1159541.jpeg' },
              { id:'escape', name:'Escape', img:'https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg' },
            ].map(m => (
              <Link key={m.id} to={`/models/${m.id}`} className="card hover:shadow-md transition">
                <img className="rounded-xl mb-3" src={m.img} />
                <div className="flex items-center justify-between">
                  <div className="text-xl font-semibold">{m.name}</div>
                  <div className="text-sm text-slate-500">Build & Price →</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="mt-12 border-t">
        <div className="max-w-7xl mx-auto p-6 text-sm text-slate-500">
          © {new Date().getFullYear()} North Coast Ford
        </div>
      </footer>
    </div>
  )
}
