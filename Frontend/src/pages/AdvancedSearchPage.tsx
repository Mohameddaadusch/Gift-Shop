import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useAuth, useApp } from '../context/AppContext';
import GiftCard from '../components/common/GiftCard';
import HobbySelector from '../components/common/HobbySelector';
import { Gift, OccasionType, OCCASIONS } from '../types';

const priceRanges = [
  { id: 'no budget', label: 'No Budget', min: 0, max: Infinity},
  { id: 'under-25',  label: 'Under $25',   min: 0,    max: 25 },
  { id: '25-50',     label: '$25 - $50',   min: 25,   max: 50 },
  { id: '50-100',    label: '$50 - $100',  min: 50,   max: 100 },
  { id: '100-200',   label: '$100 - $200', min: 100,  max: 200 },
  { id: 'over-200',  label: 'Over $200',   min: 200,  max: Infinity },
];

const AdvancedSearchPage: React.FC = () => {
  const { users, userData } = useApp();
  const { currentUser } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [selectedMail, setSelectedMail] = useState('');          // friend.mail or "__new"
  const [newName,      setNewName]      = useState('');          // free-text
  const [newHobbies,   setNewHobbies]   = useState<string[]>([]);// array of hobbies
  const [newAge,       setNewAge]       = useState('');          // age input
  const [newGender,    setNewGender]    = useState('');          // gender input
  const [newRelationship, setNewRelationship] = useState('');    // relationship input
  const [occasion,     setOccasion]     = useState<OccasionType>('other');  
  const [customOccasion, setCustomOccasion] = useState('');
  const [priceRange,   setPriceRange]   = useState('');
  const [results, setResults] = useState<Gift[]>([]);
  const [allResults, setAllResults] = useState<{ score: number; gift: Gift }[]>([]);
  const [showLowScoreResults, setShowLowScoreResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const SCORE_THRESHOLD = 0.6;

  // hydrate from URL
  useEffect(() => {
    const occ     = (searchParams.get('occasion') || '') as OccasionType;
    const rawInts = searchParams.get('interests') || '';
    const ints    = rawInts.split(',').filter(Boolean);
    const person  = decodeURIComponent(searchParams.get('person') || '');
    const price   = searchParams.get('priceRange') || '';

    // Set occasion from URL
    if (occ && OCCASIONS.includes(occ)) {
      setOccasion(occ);
      setCustomOccasion('');
    } else if (occ) {
      // If it's not in the predefined occasions, treat it as a custom occasion
      setOccasion('other');
      setCustomOccasion(occ);
    }

    // Set price range from URL
    if (price && priceRanges.some(pr => pr.id === price)) {
      setPriceRange(price);
    }

    if (ints.length && currentUser) {
      const match = userData?.friends.find(fr => {
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
        setNewHobbies(ints);
      }
    }
  }, [searchParams, userData, users, currentUser]);

  // Reset form fields when switching between friend and new person
  useEffect(() => {
    // Skip reset if we have URL parameters (indicating this is from a URL load)
    const hasUrlParams = searchParams.get('occasion') || searchParams.get('interests') || searchParams.get('priceRange');
    if (hasUrlParams) return;
    
    if (selectedMail === '__new') {
      // Reset new person fields when switching to new person
      setNewName('');
      setNewAge('');
      setNewGender('');
      setNewRelationship('');
      setNewHobbies([]);
    }
    // Clear results and error when switching person type
    setResults([]);
    setAllResults([]);
    setShowLowScoreResults(false);
    setError(null);
    
    // Reset occasion and price when manually switching
    if (selectedMail !== '') { // Only reset if there's actually a selection
      setOccasion('other');
      setCustomOccasion('');
      setPriceRange('');
    }
  }, [selectedMail, searchParams]);

  // build interests
  const interests = useMemo<string[]>(() => {
    if (selectedMail && selectedMail !== '__new') {
      const full = users.find(u => u.mail === selectedMail);
      return full?.hobbies || [];
    }
    return newHobbies;
  }, [selectedMail, newHobbies, users]);

  // Get selected friend's wishlist
  const friendWishlist = useMemo<Gift[]>(() => {
    if (selectedMail && selectedMail !== '__new') {
      const fullUser = users.find(u => u.mail === selectedMail);
      return fullUser?.wishlist || [];
    }
    return [];
  }, [selectedMail, users]);

  // Helper functions for managing search results
  const handleShowMoreResults = () => {
    setShowLowScoreResults(true);
    setResults(allResults.map((item: { score: number; gift: Gift }) => item.gift));
  };

  // Calculate display counts
  const highScoreCount = allResults.filter((item: { score: number; gift: Gift }) => item.score >= SCORE_THRESHOLD).length;
  const lowScoreCount = allResults.filter((item: { score: number; gift: Gift }) => item.score < SCORE_THRESHOLD).length;
  const hasLowScoreResults = lowScoreCount > 0 && !showLowScoreResults;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if ((!occasion || (occasion === 'other' && !customOccasion.trim())) || interests.length === 0) {
      setError('Please select an occasion and person with interests');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Get selected friend's data for age, gender, relationship
      let age;
      let gender;
      let relationship;
      if (selectedMail && selectedMail !== '__new') {
        const friend = userData?.friends.find(f => f.mail === selectedMail);
        const fullUser = users.find(u => u.mail === selectedMail);
        if (friend && fullUser) {
          age = fullUser.age;
          gender = fullUser.gender.toLowerCase();
          relationship = friend.relationShip;
        }
      } else {
        // Use values from form for new person
        age = parseInt(newAge) || 25;
        gender = newGender.toLowerCase() || 'other';
        relationship = newRelationship.toLowerCase() || 'friend';
      }

      // Get budget range
      const selectedPrice = priceRanges.find(p => p.id === priceRange) || priceRanges[0];
      const budget: [number, number] = [selectedPrice.min, selectedPrice.max === Infinity ? 1000000 : selectedPrice.max];

      const requestBody = {
        age,
        gender,
        hobbies: interests,
        relationship,
        occasion: occasion === 'other' ? customOccasion.trim() : occasion,
        budget,
      };

      console.log("Sending request with:", requestBody);

      const response = await fetch("http://127.0.0.1:8000/rank", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Recommended products:", data);
      
      // Convert API response from sorted pairs [score, product] to Gift format
      // Backend now returns array of [score, product] pairs sorted by score descending
      
      const resultsWithScores: { score: number; gift: Gift }[] = data.map((pair: [number, any]) => ({
        score: pair[0],
        gift: pair[1]
      }));
      
      // Separate high-score and low-score results
      const highScoreResults = resultsWithScores.filter((item: { score: number; gift: Gift }) => item.score >= SCORE_THRESHOLD);
      
      console.log(`High score results (>= ${SCORE_THRESHOLD}):`, highScoreResults.length);
      console.log(`Low score results (< ${SCORE_THRESHOLD}):`, resultsWithScores.length - highScoreResults.length);
      
      // Store all results for potential "show more" functionality
      setAllResults(resultsWithScores);
      
      // Initially show only high-score results
      setResults(highScoreResults.map((item: { score: number; gift: Gift }) => item.gift));
      setShowLowScoreResults(false);

      // Update URL
      const p = new URLSearchParams();
      const finalOccasion = occasion === 'other' ? customOccasion.trim() : occasion;
      if (finalOccasion) p.set('occasion', finalOccasion);
      if (interests.length) {
        p.set('interests', interests.join(','));
        if (selectedMail === '__new') p.set('person', encodeURIComponent(newName));
      }
      if (priceRange) p.set('priceRange', priceRange);
      navigate(`/advanced-search?${p.toString()}`);

    } catch (err) {
      console.error("Error fetching recommendations:", err);
      setError(err instanceof Error ? err.message : 'Failed to fetch recommendations');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Find the Perfect Gift</h1>
          <p className="text-gray-600">
            Personalized recommendations based on your friends' interests or custom inputs.
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
              {userData?.friends.map(f => (
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
                placeholder="Person's Name"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Age"
                  value={newAge}
                  onChange={e => setNewAge(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  min="1"
                  max="120"
                  required
                />
                <select
                  value={newGender}
                  onChange={e => setNewGender(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <select
                value={newRelationship}
                onChange={e => setNewRelationship(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              >
                <option value="">Select Relationship</option>
                <option value="friend">Friend</option>
                <option value="family">Family</option>
                <option value="grandparent">Grandparent</option>
                <option value="coworker">Coworker</option>
                <option value="partner">Partner</option>
                <option value="spouse">Spouse</option>
                <option value="parent">Parent</option>
                <option value="child">Child</option>
                <option value="sibling">Sibling</option>
                <option value="other">Other</option>
              </select>
              <HobbySelector
                selectedHobbies={newHobbies}
                onHobbiesChange={setNewHobbies}
                placeholder="Type to search hobbies..."
                label=""
                required={true}
              />
            </div>
          )}

          {/* Occasion */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              What's the occasion?
            </label>
            <select
              value={occasion}
              onChange={e => {
                setOccasion(e.target.value as OccasionType);
                if (e.target.value !== 'other') {
                  setCustomOccasion('');
                }
              }}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            >
              <option value="">Select…</option>
              {OCCASIONS.filter(o => o !== 'other').map(o => (
                <option key={o} value={o}>{o}</option>
              ))}
              <option value="other">Other (specify below)</option>
            </select>
            
            {/* Custom occasion input */}
            {occasion === 'other' && (
              <input
                type="text"
                placeholder="Enter custom occasion..."
                value={customOccasion}
                onChange={e => setCustomOccasion(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 mt-2"
                required
                maxLength={50}
              />
            )}
          </div>

          {/* Budget */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              What's your budget?
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
            disabled={isLoading}
            className="w-full flex justify-center items-center bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white py-3 rounded-md font-medium"
          >
            <Search size={20} className="mr-2" />
            {isLoading ? 'Finding Gifts...' : 'Find Gifts'}
          </button>

          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
        </form>

        {/* Friend's Wishlist */}
        {friendWishlist.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              {userData?.friends.find(f => f.mail === selectedMail)?.name}'s Wishlist ({friendWishlist.length} item{friendWishlist.length > 1 ? 's' : ''})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {friendWishlist.map(g => <GiftCard key={g.asin} gift={g} />)}
            </div>
          </section>
        )}

        {/* API Results */}
        {results.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Recommended Gifts ({results.length} result{results.length > 1 ? 's' : ''})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map(g => <GiftCard key={g.asin} gift={g} />)}
            </div>
            
            {/* Show More Button */}
            {hasLowScoreResults && (
              <div className="flex justify-center pt-4">
                <button
                  onClick={handleShowMoreResults}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
                >
                  <span>Show {lowScoreCount} Less Relevant Gift{lowScoreCount > 1 ? 's' : ''}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default AdvancedSearchPage;
