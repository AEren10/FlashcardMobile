-- lookup_word RPC — 5K sözlükten kelime ara
-- wordLookup.js tarafından çağrılır (CreateListScreen en-only mode)

CREATE OR REPLACE FUNCTION lookup_word(q TEXT)
RETURNS TABLE (
  word TEXT,
  meaning TEXT,
  example TEXT,
  example_tr TEXT
)
LANGUAGE SQL
STABLE
AS $$
  SELECT w.word, w.meaning, w.example, w.example_tr
  FROM words w
  WHERE w.list_id = 'd25e0b14-e775-453c-9e73-28ae4fbeb0d1'
    AND LOWER(w.word) = LOWER(q)
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION lookup_word(TEXT) TO anon, authenticated;
