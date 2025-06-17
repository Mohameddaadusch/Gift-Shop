import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import GiftCard from '../components/common/GiftCard';
import { Gift, OccasionType, OCCASIONS } from '../types';

const priceRanges = [
  { id: 'under-25',  label: 'Under $25',   min: 0,    max: 25 },
  { id: '25-50',     label: '$25 - $50',   min: 25,   max: 50 },
  { id: '50-100',    label: '$50 - $100',  min: 50,   max: 100 },
  { id: '100-200',   label: '$100 - $200', min: 100,  max: 200 },
  { id: 'over-200',  label: 'Over $200',   min: 200,  max: Infinity },
];

const AdvancedSearchPage: React.FC = () => {
  const { user, users, getRecommendedGifts } = useApp();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [selectedMail, setSelectedMail] = useState('');          // friend.mail or "__new"
  const [newName,      setNewName]      = useState('');          // free-text
  const [newHobbies,   setNewHobbies]   = useState('');          // comma-sep
  const [occasion,     setOccasion]     = useState<OccasionType>('other');  
  const [priceRange,   setPriceRange]   = useState('');

  // hydrate from URL
  useEffect(() => {
    const occ     = (searchParams.get('occasion') || '') as OccasionType;
    const rawInts = searchParams.get('interests') || '';
    const ints    = rawInts.split(',').filter(Boolean);
    const person  = decodeURIComponent(searchParams.get('person') || '');

    setOccasion(occ);

    if (ints.length && user) {
      const match = user.friends.find(fr => {
        const full = users.find(u => u.mail === fr.mail);
        return (
          full != null &&
          full.hobbies.length === ints.length &&
          full.hobbies.every(h => ints.includes(h))
        );
      });
      if (match) {
        setSelectedMail(match.mail);
      } else {
        setSelectedMail('__new');
        setNewName(person);
        setNewHobbies(ints.join(', '));
      }
    }
  }, [searchParams, user, users]);

  // build interests
  const interests = useMemo<string[]>(() => {
    if (selectedMail && selectedMail !== '__new') {
      const full = users.find(u => u.mail === selectedMail);
      return full?.hobbies || [];
    }
    return newHobbies.split(',').map(h => h.trim()).filter(Boolean);
  }, [selectedMail, newHobbies, users]);

  // run recommendations + price
  const results: Gift[] = useMemo(() => {
    if (!occasion && interests.length === 0) return [];

    const selectedPrice = priceRanges.find(p => p.id === priceRange); 
    let recs = getRecommendedGifts(occasion, selectedPrice, user ?? undefined);

    return recs;
  }, [occasion, interests, priceRange, getRecommendedGifts]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (occasion)   p.set('occasion', occasion);
    if (interests.length) {
      p.set('interests', interests.join(','));
      if (selectedMail === '__new') p.set('person', encodeURIComponent(newName));
    }
    if (priceRange) p.set('priceRange', priceRange);
    navigate(`/advanced-search?${p.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Find the Perfect Gift</h1>
          <p className="text-gray-600">
            Personalized recommendations based on your friends’ interests or custom inputs.
          </p>
        </header>

        <form onSubmit={onSubmit} className="bg-white p-6 rounded-xl shadow space-y-6">
          {/* Person */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Who are you shopping for?
            </label>
            <select
              value={selectedMail}
              onChange={e => setSelectedMail(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            >
              <option value="">Select…</option>
              {user?.friends.map(f => (
                <option key={f.mail} value={f.mail}>{f.name}</option>
              ))}
              <option value="__new">— Other / New Person —</option>
            </select>
          </div>

          {/* Custom person */}
          {selectedMail === '__new' && (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Person’s Name"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
              <input
                type="text"
                placeholder="Hobbies (comma separated)"
                value={newHobbies}
                onChange={e => setNewHobbies(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
          )}

          {/* Occasion */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              What’s the occasion?
            </label>
            <select
              value={occasion}
              onChange={e => setOccasion(e.target.value as OccasionType)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            >
              <option value="">Select…</option>
              {OCCASIONS.map(o => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>

          {/* Budget */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              What’s your budget?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {priceRanges.map(pr => (
                <label
                  key={pr.id}
                  className={`flex items-center px-3 py-2 border rounded cursor-pointer transition
                    ${priceRange === pr.id
                      ? 'bg-primary-50 border-primary-500 text-primary-700'
                      : 'hover:bg-gray-100'
                    }`}
                >
                  <input
                    type="radio"
                    name="price"
                    value={pr.id}
                    checked={priceRange === pr.id}
                    onChange={() => setPriceRange(pr.id)}
                    className="mr-2"
                  />
                  {pr.label}
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center items-center bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-md font-medium"
          >
            <Search size={20} className="mr-2" />
            Find Gifts
          </button>
        </form>

        {/* Results */}
        {results.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              {results.length} Result{results.length > 1 ? 's' : ''}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map(g => <GiftCard key={g.id} gift={g} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default AdvancedSearchPage;
