const paths = {
  home: 'M3 10l9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z',
  tasks: 'M9 5h11M9 12h11M9 19h11M3 5l1 1 2-2M3 12l1 1 2-2M3 19l1 1 2-2',
  wallet: 'M20 7V5a2 2 0 0 0-2-2H5a3 3 0 0 0 0 6h16v11H5a3 3 0 0 1-3-3V6m19 6h-5v5h5m-3-2.5h.01',
  target: 'M21 12a9 9 0 1 1-9-9m5 9a5 5 0 1 1-5-5m0 5 9-9m-5 0h5v5',
  bell: 'M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4',
  users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m20 0v-2a4 4 0 0 0-3-3.9M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8m7 0a4 4 0 0 1 0 8',
  arrow: 'M4 12h16m-6-6 6 6-6 6',
  plus: 'M12 5v14M5 12h14',
  check: 'M5 12l4 4L19 6',
  clock: 'M12 8v4l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0',
  logout: 'M9 21H4V3h5m6 5 5 4-5 4m-6-4h11',
  book: 'M12 5c-3-2-7-2-10-1v15c3-1 7-1 10 1m0-15c3-2 7-2 10-1v15c-3-1-7-1-10 1V5',
  close: 'M6 6l12 12M6 18 18 6',
  leaf: 'M20 3C7 1 1 7 5 16c8 7 16-1 15-13ZM4 21 15 10',
  star: 'm12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9z',
  copy: 'M9 9h12v12H9zM15 5V3H3v12h2',
};
export default function Icon({ name = 'leaf', size = 20, ...props }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}><path d={paths[name] || paths.leaf} /></svg>; }
