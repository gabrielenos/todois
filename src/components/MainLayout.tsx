'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Dashboard from './views/Dashboard';
import TodosView from './views/TodosView';
import Contacts from './views/Contacts';
import Calendar from './views/Calendar';
import Notes from './views/Notes';
import Statistics from './views/Statistics';
import Settings from './views/Settings';

export default function MainLayout() {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'todos':
        return <TodosView />;
      case 'contacts':
        return <Contacts />;
      case 'calendar':
        return <Calendar />;
      case 'notes':
        return <Notes />;
      case 'statistics':
        return <Statistics />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          {renderView()}
        </main>
      </div>
    </div>
  );
}
