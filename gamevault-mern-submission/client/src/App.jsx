import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/games';
const emptyForm = {
  title: '',
  genre: '',
  platform: '',
  releaseYear: '',
  rating: '7'
};

function App() {
  const [games, setGames] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [filterPlatform, setFilterPlatform] = useState('All');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [loading, setLoading] = useState(true);

  const showMessage = (text, type = 'success') => {
    setMessage(text);
    setMessageType(type);
  };

  const loadGames = async () => {
    try {
      const response = await axios.get(API_URL);
      setGames(response.data);
      setMessage('');
    } catch (error) {
      showMessage(
        'Could not load games. Make sure the backend and MongoDB are running.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGames();
  }, []);

  const platforms = useMemo(
    () => ['All', ...new Set(games.map((game) => game.platform))],
    [games]
  );

  const filteredGames = games.filter((game) => {
    const matchesSearch = game.title.toLowerCase().includes(search.toLowerCase());
    const matchesPlatform = filterPlatform === 'All' || game.platform === filterPlatform;
    return matchesSearch && matchesPlatform;
  });

  const updateField = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const submitForm = async (event) => {
    event.preventDefault();
    const currentYear = new Date().getFullYear();
    const year = Number(form.releaseYear);
    const rating = Number(form.rating);

    if (!form.title.trim() || !form.genre.trim() || !form.platform.trim() || !form.releaseYear) {
      showMessage('Please fill in all required fields.', 'error');
      return;
    }
    if (!Number.isInteger(year) || year < 1950 || year > currentYear + 2) {
      showMessage(`Enter a release year between 1950 and ${currentYear + 2}.`, 'error');
      return;
    }
    if (!Number.isFinite(rating) || rating < 0 || rating > 10) {
      showMessage('Rating must be between 0 and 10.', 'error');
      return;
    }

    const payload = {
      title: form.title.trim(),
      genre: form.genre.trim(),
      platform: form.platform.trim(),
      releaseYear: year,
      rating
    };

    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, payload);
        showMessage('Game updated successfully.');
      } else {
        await axios.post(API_URL, payload);
        showMessage('Game added successfully.');
      }
      resetForm();
      await loadGames();
    } catch (error) {
      showMessage(error.response?.data?.message || 'Unable to save game. Check the backend.', 'error');
    }
  };

  const editGame = (game) => {
    setEditingId(game._id);
    setForm({
      title: game.title,
      genre: game.genre,
      platform: game.platform,
      releaseYear: String(game.releaseYear),
      rating: String(game.rating)
    });
    setMessage('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteGame = async (game) => {
    if (!window.confirm(`Delete "${game.title}" from your collection?`)) return;
    try {
      await axios.delete(`${API_URL}/${game._id}`);
      if (editingId === game._id) resetForm();
      showMessage('Game deleted successfully.');
      await loadGames();
    } catch (error) {
      showMessage(error.response?.data?.message || 'Unable to delete game.', 'error');
    }
  };

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="GAMEVAULT home">
          <span className="brand-icon">G</span>
          <span>GAME<span className="brand-accent">VAULT</span></span>
        </a>
        <span className="topbar-note">YOUR PERSONAL GAME LIBRARY</span>
      </header>

      <section className="hero">
        <div>
          <p className="eyebrow">COLLECT · ORGANIZE · PLAY</p>
          <h1>Your games.<br /><span>Your collection.</span></h1>
          <p className="hero-copy">Keep every title in one place. Add games, update details, and find your next play.</p>
        </div>
        <div className="hero-symbol" aria-hidden="true">⌁</div>
      </section>

      <section className="stats-grid" aria-label="Collection statistics">
        <div className="stat-card"><span className="stat-label">TOTAL GAMES</span><strong>{games.length}</strong><span className="stat-foot">In your collection</span></div>
        <div className="stat-card"><span className="stat-label">PLATFORMS</span><strong>{new Set(games.map((game) => game.platform)).size}</strong><span className="stat-foot">Different platforms</span></div>
        <div className="stat-card"><span className="stat-label">AVERAGE RATING</span><strong>{games.length ? (games.reduce((sum, game) => sum + game.rating, 0) / games.length).toFixed(1) : '—'}<small>/10</small></strong><span className="stat-foot">Your game ratings</span></div>
      </section>

      <section className="content-grid">
        <section className="panel form-panel">
          <div className="section-heading">
            <div><p className="eyebrow">COLLECTION MANAGER</p><h2>{editingId ? 'Edit game' : 'Add a game'}</h2></div>
            <span className="heading-mark">{editingId ? '✎' : '+'}</span>
          </div>
          <form onSubmit={submitForm}>
            <label htmlFor="title">Game name *</label>
            <input id="title" name="title" value={form.title} onChange={updateField} placeholder="e.g. Elden Ring" maxLength="80" required />

            <div className="form-row">
              <div>
                <label htmlFor="genre">Genre *</label>
                <select id="genre" name="genre" value={form.genre} onChange={updateField} required>
                  <option value="">Choose genre</option>
                  {['Action', 'Adventure', 'RPG', 'Racing', 'Sports', 'Shooter', 'Strategy', 'Simulation', 'Puzzle', 'Other'].map((genre) => <option key={genre}>{genre}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="platform">Platform *</label>
                <select id="platform" name="platform" value={form.platform} onChange={updateField} required>
                  <option value="">Choose platform</option>
                  {['PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Mobile', 'Other'].map((platform) => <option key={platform}>{platform}</option>)}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div>
                <label htmlFor="releaseYear">Release year *</label>
                <input id="releaseYear" name="releaseYear" type="number" min="1950" max={new Date().getFullYear() + 2} value={form.releaseYear} onChange={updateField} placeholder="2024" required />
              </div>
              <div>
                <label htmlFor="rating">Rating (0–10) *</label>
                <input id="rating" name="rating" type="number" min="0" max="10" step="0.1" value={form.rating} onChange={updateField} required />
              </div>
            </div>

            <button className="primary-button" type="submit">{editingId ? 'Save changes' : '＋ Add to collection'}</button>
            {editingId && <button className="secondary-button" type="button" onClick={resetForm}>Cancel editing</button>}
          </form>
          {message && <p className={`notice ${messageType}`} role="status">{message}</p>}
        </section>

        <section className="panel library-panel">
          <div className="section-heading library-heading">
            <div><p className="eyebrow">YOUR LIBRARY</p><h2>Game collection <span className="count-pill">{filteredGames.length}</span></h2></div>
          </div>
          <div className="toolbar">
            <input aria-label="Search game titles" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="⌕  Search game titles..." />
            <select aria-label="Filter by platform" value={filterPlatform} onChange={(event) => setFilterPlatform(event.target.value)}>
              {platforms.map((platform) => <option key={platform}>{platform}</option>)}
            </select>
          </div>

          {loading ? <div className="empty-state">Loading your collection…</div> :
            filteredGames.length === 0 ? (
              <div className="empty-state"><span className="empty-icon">⌕</span><h3>No games found</h3><p>Add a game or change your search filters.</p></div>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead><tr><th>GAME</th><th>GENRE</th><th>PLATFORM</th><th>YEAR</th><th>RATING</th><th>ACTIONS</th></tr></thead>
                  <tbody>
                    {filteredGames.map((game) => (
                      <tr key={game._id}>
                        <td className="game-title">{game.title}</td>
                        <td><span className="tag">{game.genre}</span></td>
                        <td>{game.platform}</td>
                        <td>{game.releaseYear}</td>
                        <td><span className="rating">★ {Number(game.rating).toFixed(1)}</span></td>
                        <td className="actions">
                          <button type="button" className="edit-button" onClick={() => editGame(game)} aria-label={`Edit ${game.title}`}>Edit</button>
                          <button type="button" className="delete-button" onClick={() => deleteGame(game)} aria-label={`Delete ${game.title}`}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          <p className="table-footnote">Records are loaded from your MongoDB database.</p>
        </section>
      </section>
      <footer>GAMEVAULT <span>·</span> MERN STACK PRACTICAL PROJECT</footer>
    </main>
  );
}

export default App;
