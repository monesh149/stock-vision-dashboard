import React from 'react';
import { Inbox } from 'lucide-react';

const EmptyState = ({ title = 'No data', message = 'Nothing to show here yet.' }) => (
  <div className="empty-state">
    <Inbox />
    <h3>{title}</h3>
    <p>{message}</p>
  </div>
);

export default EmptyState;
