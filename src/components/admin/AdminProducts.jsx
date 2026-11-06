import React, { useState } from 'react';
import { useMLM } from '../../context/MLMContext';
import { CATEGORIES } from '../../data/products';
import { formatCurrency } from '../../utils/helpers';
import { 
  Package, 
  Plus, 
  Edit3, 
  Trash2, 
  Sparkles, 
  Search, 
  X, 
  Check, 
  Image as ImageIcon 
} from 'lucide-react';

export const AdminProducts = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useMLM();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    category: CATEGORIES[1] || 'Combos & Starter Kits',
    price: 2000,
    mrp: 2800,
    bv: 100,
    isQualifying: true,
    isFeatured: false,
    image: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80',
    shortDesc: 'Ayurvedic wellness formulation for vitality.',
    description: 'Classical Ayurvedic herbs prepared in GMP certified laboratory.',
    dosage: '1 serving twice daily with warm water.',
    certification: 'AYUSH GMP Certified'
  });

  const filtered = products.filter(p => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      name: '',
      category: CATEGORIES[1] || 'Combos & Starter Kits',
      price: 2000,
      mrp: 2800,
      bv: 100,
      isQualifying: true,
      isFeatured: false,
      image: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80',
      shortDesc: 'Ayurvedic wellness formulation for vitality.',
      description: 'Classical Ayurvedic herbs prepared in GMP certified laboratory.',
      dosage: '1 serving twice daily with warm water.',
      certification: 'AYUSH GMP Certified'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setEditingId(p.id);
    setFormData({
      name: p.name,
      category: p.category,
      price: p.price,
      mrp: p.mrp,
      bv: p.bv || 50,
      isQualifying: p.isQualifying,
      isFeatured: p.isFeatured,
      image: p.image,
      shortDesc: p.shortDesc || '',
      description: p.description || '',
      dosage: p.dosage || '',
      certification: p.certification || 'AYUSH GMP Certified'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updateProduct(editingId, formData);
    } else {
      addProduct(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header (Light Theme) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs text-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-2">
            <Package className="w-3.5 h-3.5 text-emerald-600" />
            <span>Product Catalogue & PV/BV Management</span>
          </div>
          <h2 className="text-2xl font-black">Ayurvedic Formulations ({products.length})</h2>
          <p className="text-xs text-slate-500 mt-1">
            Configure pricing, Business Volume points, and 8-level qualifying flags.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Formulation</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-200">
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3 text-right">Price</th>
                <th className="py-3 px-3 text-right">MRP</th>
                <th className="py-3 px-3 text-center">BV</th>
                <th className="py-3 px-3 text-center">8-Level Qualifier</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((prod) => (
                <tr key={prod.id} className="hover:bg-slate-50/80 text-slate-700 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={prod.image}
                        alt=""
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                      <div>
                        <p className="font-bold text-slate-900 text-xs line-clamp-1">{prod.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">ID: {prod.id}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-3 font-medium text-slate-700">
                    {prod.category}
                  </td>

                  <td className="py-3.5 px-3 text-right font-black text-slate-900">
                    {formatCurrency(prod.price)}
                  </td>

                  <td className="py-3.5 px-3 text-right text-slate-400 line-through">
                    {formatCurrency(prod.mrp)}
                  </td>

                  <td className="py-3.5 px-3 text-center font-mono font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-lg">
                    {prod.bv || 50} BV
                  </td>

                  <td className="py-3.5 px-3 text-center">
                    {prod.isQualifying ? (
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-emerald-600" />
                        Qualifying (₹290)
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[10px]">Standard</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(prod)}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                        title="Edit Formulation"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteProduct(prod.id)}
                        className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors"
                        title="Delete Formulation"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal (Light Theme) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-lg w-full text-slate-800 relative max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-lg text-slate-900">
              {editingId ? "Edit Ayurvedic Formulation" : "Add New Ayurvedic Product"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  >
                    {CATEGORIES.filter(c => c !== 'All Categories').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">BV (Business Volume)</label>
                  <input
                    type="number"
                    value={formData.bv}
                    onChange={(e) => setFormData({ ...formData, bv: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">MRP (₹)</label>
                  <input
                    type="number"
                    value={formData.mrp}
                    onChange={(e) => setFormData({ ...formData, mrp: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Image URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.isQualifying}
                    onChange={(e) => setFormData({ ...formData, isQualifying: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>8-Level Qualifying Product</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded text-brand-600 focus:ring-brand-500"
                  />
                  <span>Feature on Homepage</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                >
                  Save Formulation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
