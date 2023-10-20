class Storage {
  static get(key: string) {
    if (typeof window === 'undefined') return "use localStorage only on client"

    return localStorage.getItem(`gostat_${key}`);
  };

  static set(key: string, payload: any) {
    if (typeof window === 'undefined') return "use localStorage only on client"
    return localStorage.setItem(`gostat_${key}`, payload);
  };

  static delete(key: string) {
    if (typeof window === 'undefined') return "use localStorage only on client"
    return localStorage.removeItem(`gostat_${key}`);
  };
}

export default Storage;