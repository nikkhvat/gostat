const checkTheme = () => {
  if (typeof window === 'undefined') return;

  const savedTheme = localStorage.getItem('gostat_theme');
  const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme !== 'dark' && savedTheme !== 'light') {
    document.body.className = isDarkMode ? 'dark-theme' : 'light-theme';
  } else {
    document.body.className = savedTheme === 'dark' ? 'dark-theme' : 'light-theme';
  }
};

checkTheme();

const handleChange = (e) => {
  const newTheme = e.matches ? 'dark-theme' : 'light-theme';
  document.body.className = newTheme;
};

const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
mediaQuery.addEventListener('change', handleChange);
