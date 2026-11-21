import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import {
  UtensilsCrossed,
  Search,
  Plus,
  Flame
} from 'lucide-react';

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await api.getMenu();
        if (res.success) {
          setMenuItems(res.data || []);
        }
      } catch (err) {
        console.error('Menu load error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddItem = (item) => {
    addToCart({
      _id: item._id,
      name: item.name,
      title: item.name,
      itemType: 'menu_item',
      type: 'one_time',
      price: item.price,
      quantity: 1,
      image: item.image,
      portion: item.portion
    });
  };

  return (
    <div className="font-sans py-5">
      
      {/* Header Banner */}
      <section className="text-center py-5 bg-white border-bottom mb-5">
        <div className="container">
          <span className="badge rounded-pill bg-cream text-roast border px-3 py-1 fw-bold text-uppercase small mb-2">
            Fresh Everyday
          </span>
          <h1 className="font-serif display-4 fw-black text-roast mb-2">
            Our Rotational Daily Menu
          </h1>
          <p className="font-serif fst-italic text-secondary fs-5 fw-bold mb-3">
            "A Taste You'll Keep Coming Back For!"
          </p>
          <p className="lead text-muted fs-6 col-lg-6 mx-auto mb-4">
            Prepared every morning with whole spices, cold-pressed oils, pure cow desi ghee, and farm-picked seasonal produce.
          </p>

          {/* Search Bar */}
          <div className="col-12 col-md-6 col-lg-5 mx-auto mb-4">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 rounded-start-pill ps-3">
                <Search size={16} className="text-muted" />
              </span>
              <input
                type="text"
                placeholder="Search dishes (Poha, Paneer, Dal, Chaas...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-control rounded-end-pill border-start-0 bg-light py-2"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="d-flex flex-wrap items-center justify-content-center gap-2">
            {[
              { id: 'all', label: 'All Items' },
              { id: 'breakfast', label: 'Breakfast' },
              { id: 'lunch', label: 'Lunch Meals' },
              { id: 'dinner', label: 'Dinner Boxes' },
              { id: 'addon', label: 'Add-Ons & Beverages' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`btn btn-sm rounded-pill px-3 py-1.5 fw-bold ${
                  activeCategory === tab.id ? 'btn-roast' : 'btn-light border text-dark'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* Menu Grid */}
      <section className="container mb-5">
        {loading ? (
          <div className="row g-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="col-12 col-md-6 col-lg-4">
                <div className="card dr-card placeholder-glow" style={{ height: '380px' }}></div>
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="card dr-card p-5 text-center my-4">
            <UtensilsCrossed size={48} className="text-muted mx-auto mb-3" />
            <h4 className="font-serif fw-bold text-roast">No dishes match your search</h4>
            <p className="text-muted small mb-3">Try searching with a different keyword or category.</p>
            <button
              onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
              className="btn btn-roast btn-sm rounded-pill px-4 mx-auto"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="row g-4">
            {filteredItems.map((item) => (
              <div key={item._id} className="col-12 col-md-6 col-lg-4">
                <div className="card dr-card h-100 overflow-hidden d-flex flex-column justify-content-between">
                  <div>
                    {/* Food Image */}
                    <div className="position-relative" style={{ height: '200px', overflow: 'hidden' }}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-100 h-100 object-fit-cover"
                      />
                      <span className="position-absolute top-0 start-0 m-3 badge rounded-pill bg-dark bg-opacity-75 text-white small fw-bold text-uppercase">
                        {item.category}
                      </span>
                      {item.calories && (
                        <span className="position-absolute bottom-0 end-0 m-3 badge rounded-pill bg-white text-dark shadow-sm small fw-bold d-flex align-items-center gap-1">
                          <Flame size={12} className="text-danger" />
                          <span>{item.calories} kcal</span>
                        </span>
                      )}
                    </div>

                    <div className="card-body p-4">
                      <div className="d-flex justify-content-between align-items-baseline mb-2">
                        <h5 className="font-serif fw-bold text-roast mb-0 fs-6 text-truncate pe-2">
                          {item.name}
                        </h5>
                        <span className="fs-5 fw-black text-secondary font-serif">
                          ₹{item.price}
                        </span>
                      </div>

                      <p className="small text-muted mb-3 leading-relaxed" style={{ fontSize: '0.82rem' }}>
                        {item.description}
                      </p>

                      {item.dietaryTags?.length > 0 && (
                        <div className="d-flex flex-wrap gap-1">
                          {item.dietaryTags.map((tag, idx) => (
                            <span key={idx} className="badge bg-light text-muted border small" style={{ fontSize: '0.65rem' }}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="card-footer bg-white border-top p-4 pt-0 border-0 d-flex align-items-center justify-content-between small">
                    <span className="text-muted small" style={{ fontSize: '0.75rem' }}>{item.portion || 'Standard Tiffin'}</span>
                    <button
                      onClick={() => handleAddItem(item)}
                      className="btn btn-outline-roast btn-sm rounded-pill px-3 fw-bold d-flex align-items-center gap-1"
                    >
                      <Plus size={14} />
                      <span>Add to Tiffin</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
