'use client';

import { useState } from 'react';
import { usePreferences } from '@/context/PreferencesContext';

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  color: string;
  description?: string;
}

export default function Calendar() {
  const { t } = usePreferences();
  const [currentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '',
    color: 'blue',
    description: ''
  });

  const getMonthName = (monthIndex: number) => {
    const monthKeys = [
      'calendar.monthJan', 'calendar.monthFeb', 'calendar.monthMar', 'calendar.monthApr',
      'calendar.monthMay', 'calendar.monthJun', 'calendar.monthJul', 'calendar.monthAug',
      'calendar.monthSep', 'calendar.monthOct', 'calendar.monthNov', 'calendar.monthDec'
    ];
    return t(monthKeys[monthIndex]);
  };

  const getDayName = (dayIndex: number) => {
    const dayKeys = [
      'calendar.daySun', 'calendar.dayMon', 'calendar.dayTue', 'calendar.dayWed',
      'calendar.dayThu', 'calendar.dayFri', 'calendar.daySat'
    ];
    return t(dayKeys[dayIndex]);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const days = getDaysInMonth(currentDate);

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.time) {
      alert(t('calendar.eventTitle') + ', ' + t('calendar.date') + ', ' + t('calendar.time'));
      return;
    }

    const event: Event = {
      id: Date.now(),
      title: newEvent.title,
      date: newEvent.date,
      time: newEvent.time,
      color: newEvent.color,
      description: newEvent.description
    };

    setEvents([...events, event]);
    setShowAddModal(false);
    setNewEvent({
      title: '',
      date: '',
      time: '',
      color: 'blue',
      description: ''
    });
  };

  const handleDeleteEvent = (id: number) => {
    setEvents(events.filter(e => e.id !== id));
  };

  const getColorClass = (color: string) => {
    const colors: { [key: string]: string } = {
      blue: 'from-blue-500 to-blue-600',
      purple: 'from-purple-500 to-purple-600',
      green: 'from-green-500 to-green-600',
      red: 'from-red-500 to-red-600',
      yellow: 'from-yellow-500 to-yellow-600',
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="p-8 min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
          📅 {t('calendar.title')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t('calendar.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              {getMonthName(currentDate.getMonth())} {currentDate.getFullYear()}
            </h2>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                ←
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all">
                {t('calendar.today')}
              </button>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                →
              </button>
            </div>
          </div>

          {/* Day Names */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => (
              <div
                key={dayIndex}
                className="text-center font-semibold text-gray-600 dark:text-gray-400 py-2"
              >
                {getDayName(dayIndex)}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, index) => (
              <div
                key={index}
                className={`aspect-square flex items-center justify-center rounded-lg transition-all ${
                  day
                    ? day === currentDate.getDate()
                      ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold shadow-lg'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-800 dark:text-white'
                    : ''
                }`}
              >
                {day}
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
            {t('calendar.upcomingEvents')}
          </h2>
          {events.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📅</div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {t('calendar.noEvents')}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                {t('calendar.clickToAdd')}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="p-4 rounded-xl border-l-4 bg-gray-50 dark:bg-gray-700 hover:shadow-md transition-shadow"
                  style={{
                    borderLeftColor:
                      event.color === 'blue'
                        ? '#3b82f6'
                        : event.color === 'purple'
                        ? '#9333ea'
                        : event.color === 'green'
                        ? '#22c55e'
                        : event.color === 'red'
                        ? '#ef4444'
                        : '#eab308',
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 dark:text-white mb-1">
                        {event.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        📅 {event.date}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        🕐 {event.time}
                      </p>
                      {event.description && (
                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                          {event.description}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => setShowAddModal(true)}
            className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
          >
            ➕ {t('calendar.addEvent')}
          </button>
        </div>
      </div>

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                ➕ {t('calendar.addEvent')}
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('calendar.eventTitle')} *
                </label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder={t('calendar.eventTitle')}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('calendar.date')} *
                </label>
                <input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('calendar.time')} *
                </label>
                <input
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('calendar.color')}
                </label>
                <div className="flex gap-2">
                  {['blue', 'purple', 'green', 'red', 'yellow'].map((color) => (
                    <button
                      key={color}
                      onClick={() => setNewEvent({ ...newEvent, color })}
                      className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getColorClass(color)} ${
                        newEvent.color === color ? 'ring-4 ring-offset-2 ring-blue-500' : ''
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('todo.description')}
                </label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  placeholder={`${t('todo.description')}...`}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {t('calendar.cancel')}
              </button>
              <button
                onClick={handleAddEvent}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
              >
                {t('calendar.save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
