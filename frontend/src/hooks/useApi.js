import { useState, useEffect, useCallback } from 'react';

export function useApi(apiFn, immediate = true) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error,   setError]   = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFn(...args);
      setData(res.data.data);
      return res.data.data;
    } catch (e) {
      setError(e.response?.data?.message || 'An error occurred');
      throw e;
    } finally {
      setLoading(false);
    }
  }, [apiFn]);

  useEffect(() => { if (immediate) execute(); }, []);

  return { data, loading, error, execute, setData };
}
