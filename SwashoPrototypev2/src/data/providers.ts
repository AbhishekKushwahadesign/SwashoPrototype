export type ProviderOffer = {
  id: string;
  name: string;
  rating: number;
  offer: string;
  topPicks?: boolean;
};

export const SEARCH_OFFERS: ProviderOffer[] = [
  { id: '1', name: 'Laundromat', rating: 4.5, offer: '20% upto 100' },
  { id: '2', name: 'Laundromat', rating: 4.5, offer: '20% upto 100', topPicks: true },
  { id: '3', name: 'Laundromat', rating: 4.5, offer: '20% upto 100', topPicks: true },
  { id: '4', name: 'Laundromat', rating: 4.5, offer: '20% upto 100', topPicks: true },
  { id: '5', name: 'Laundromat', rating: 4.5, offer: '20% upto 100', topPicks: true },
  { id: '6', name: 'Laundromat', rating: 4.5, offer: '20% upto 100', topPicks: true },
];

export const RECENT_SEARCHES = ['Recent search', 'Recent search', 'Recent search'];
