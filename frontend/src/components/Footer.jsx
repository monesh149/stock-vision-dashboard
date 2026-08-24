import React from 'react';

const Footer = () => (
  <footer className="footer">
    <p>&copy; {new Date().getFullYear()} StockVision. All rights reserved.</p>
    <p className="footer-disclaimer">
      For informational purposes only. Not financial advice. Past performance does not guarantee future results.
    </p>
  </footer>
);

export default Footer;
