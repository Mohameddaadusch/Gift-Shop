import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';

type Reminder = {
  id: string;
  personName: string;
  occasion: string;
  date: string;
};

const RemindersPage: React.FC = () => {
  const [reminders, setReminders] = useState<Reminder[]>([
    { id: '1', personName: 'Mom', occasion: 'Birthday', date: '2025-07-10' },
    { id: '2', personName: 'Alex', occasion: 'Graduation', date: '2025-06-25' },
  ]);
  
  const [newReminder, setNewReminder] = useState({ personName: '', occasion: '', date: '' });

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReminder.personName || !newReminder.occasion || !newReminder.date) return;

    setReminders([
      ...reminders,
      {
        id: Math.random().toString(36).substring(2, 9),
        ...newReminder,
      },
    ]);
    setNewReminder({ personName: '', occasion: '', date: '' });
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-8 bg-gray-50">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">My Gift Reminders</h1>

        {/* List of reminders */}
        {reminders.length === 0 ? (
          <p className="text-gray-600 mb-6">You don’t have any reminders yet.</p>
        ) : (
          <ul className="space-y-4 mb-8">
            {reminders.map((reminder) => (
              <li key={reminder.id} className="p-4 border rounded-lg shadow-sm bg-gray-50">
                <div className="font-semibold text-lg text-primary-700">{reminder.personName}</div>
                <div className="text-sm text-gray-600">
                  Occasion: {reminder.occasion} | Date: {reminder.date}
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Add Reminder Form */}
        <form onSubmit={handleAddReminder} className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-700 flex items-center">
            <PlusCircle size={20} className="mr-2 text-primary-600" /> Add New Reminder
          </h2>

          <input
            type="text"
            placeholder="Person's Name"
            value={newReminder.personName}
            onChange={(e) => setNewReminder({ ...newReminder, personName: e.target.value })}
            className="w-full p-2 border rounded-md"
            required
          />

          <input
            type="text"
            placeholder="Occasion (e.g. Birthday)"
            value={newReminder.occasion}
            onChange={(e) => setNewReminder({ ...newReminder, occasion: e.target.value })}
            className="w-full p-2 border rounded-md"
            required
          />

          <input
            type="date"
            value={newReminder.date}
            onChange={(e) => setNewReminder({ ...newReminder, date: e.target.value })}
            className="w-full p-2 border rounded-md"
            required
          />

          <button
            type="submit"
            className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-md font-medium"
          >
            Add Reminder
          </button>
        </form>
      </div>
    </div>
  );
};

export default RemindersPage;
