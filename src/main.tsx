import { createRoot } from 'react-dom/client';
import AuctionModule from './AuctionModule';

const container = document.getElementById('root');
if (!container) throw new Error('#root element not found');
createRoot(container).render(<AuctionModule />);
