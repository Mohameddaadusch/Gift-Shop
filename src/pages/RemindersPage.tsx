import React, { useState } from 'react';
import { PlusCircle, Trash2, ShoppingCart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Reminder, OccasionType, OCCASIONS } from '../types';
import { useNavigate } from 'react-router-dom';

type FormState = {
  recipientMail: string;    // friend.mail or "__custom"
  customName:    string;    // free-text name when custom
  isCustom:      boolean;
  occasion:      OccasionType;
  date:          string;
  hobbiesInput:  string;    // comma-sep for “Other”
};

const RemindersPage: React.FC = () => {
  const { user, users, reminders, addReminder, removeReminder } = useApp();
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>({
    recipientMail: '',
    customName:    '',
    isCustom:      false,
    occasion:      '' as OccasionType,
    date:          '',
    hobbiesInput:  '',
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    // must pick friend OR customName, plus occasion & date
    if (
      (!form.isCustom && !form.recipientMail) ||
      ( form.isCustom && !form.customName.trim()) ||
      !form.occasion ||
      !form.date
    ) return;

    // derive recipientName & hobbies[]
    let recipientName: string;
    let hobbies: string[];

    if (form.isCustom) {
      recipientName = form.customName.trim();
      hobbies = form.hobbiesInput
        .split(',')
        .map(h => h.trim())
        .filter(Boolean);
    } else {
      const full = users.find(u => u.mail === form.recipientMail);
      recipientName = full ? full.name : form.recipientMail;
      hobbies = full?.hobbies || [];
    }

    addReminder({
      id:             Math.random().toString(36).substring(2,11),
      recipientName,
      occasion:       form.occasion,
      date:           form.date,
      hobbies,
    } as Reminder);

    // reset
    setForm({
      recipientMail: '',
      customName:    '',
      isCustom:      false,
      occasion:      '' as OccasionType,
      date:          '',
      hobbiesInput:  '',
    });
  };

  const handleFindGift = (r: Reminder) => {
    const params = new URLSearchParams();
    params.set('occasion', r.occasion);
    if (r.hobbies?.length) {
      params.set('interests', r.hobbies.join(','));
      params.set('person', encodeURIComponent(r.recipientName));
    }
    navigate(`/advanced-search?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-8">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">My Gift Reminders</h1>

        {reminders.length === 0 ? (
          <p className="text-gray-600">You don’t have any reminders yet.</p>
        ) : (
          <ul className="space-y-4">
            {reminders.map(r => (
              <li
                key={r.id}
                className="flex items-center justify-between p-4 bg-gray-50 border rounded-lg shadow-sm"
              >
                <div>
                  <div className="font-semibold text-lg text-gray-800">
                    {r.recipientName}
                  </div>
                  <div className="text-sm text-gray-600">
                    Occasion: <span className="font-medium">{r.occasion}</span> | Date:{' '}
                    <span className="font-medium">{r.date}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleFindGift(r)}
                    className="inline-flex items-center space-x-1 bg-primary-600 hover:bg-primary-700 text-white px-3 py-1 rounded-md transition"
                  >
                    <ShoppingCart size={16} />
                    <span>Find Gift</span>
                  </button>
                  <button
                    onClick={() => removeReminder(r.id)}
                    className="text-red-500 hover:text-red-700 transition"
                    aria-label="Delete reminder"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <hr className="my-6" />

        <form onSubmit={handleAdd} className="space-y-4">
          <h2 className="flex items-center text-lg font-semibold text-gray-700">
            <PlusCircle className="mr-2 text-primary-600" size={20} />
            Add New Reminder
          </h2>

          {/* friend selector */}
          {user?.friends?.length ? (
            <select
              value={form.isCustom ? '__custom' : form.recipientMail}
              onChange={e => {
                const v = e.target.value;
                if (v === '__custom') {
                  setForm(f => ({ ...f, isCustom: true,  recipientMail: '' }));
                } else {
                  setForm(f => ({ ...f, isCustom: false, recipientMail: v }));
                }
              }}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            >
              <option value="">Select a friend…</option>
              {user.friends.map(f => (
                <option key={f.mail} value={f.mail}>
                  {f.name}
                </option>
              ))}
              <option value="__custom">— Other / New Person —</option>
            </select>
          ) : null}

          {/* custom name + hobbies */}
          {(!user?.friends?.length || form.isCustom) && (
            <>
              <input
                type="text"
                placeholder="Person’s Name"
                value={form.customName}
                onChange={e => setForm(f => ({ ...f, customName: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
              <input
                type="text"
                placeholder="Hobbies (comma separated)"
                value={form.hobbiesInput}
                onChange={e => setForm(f => ({ ...f, hobbiesInput: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </>
          )}

          {/* occasion dropdown */}
          <select
            value={form.occasion}
            onChange={e => setForm(f => ({ ...f, occasion: e.target.value as OccasionType }))}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            required
          >
            <option value="">Select an occasion…</option>
            {OCCASIONS.map(o => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={form.date}
            onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            required
          />

          <button
            type="submit"
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 rounded-md transition"
          >
            Add Reminder
          </button>
        </form>
      </div>
    </div>
  );
};

export default RemindersPage;
