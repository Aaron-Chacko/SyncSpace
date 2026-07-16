import React from 'react';

const Sidebar = () => {
  return (
    <aside className="app-sidebar" style={{ width: '250px', background: 'var(--bg-secondary)', padding: '20px', borderRight: '1px solid var(--border-color)' }}>
      <h3>Sidebar</h3>
      <p>Configure room details and active participants here.</p>
    </aside>
  );
};

export default Sidebar;